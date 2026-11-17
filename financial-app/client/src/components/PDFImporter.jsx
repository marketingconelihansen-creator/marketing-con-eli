import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import '../styles/PDFImporter.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFImporter({ onDebtExtracted }) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [manualEdit, setManualEdit] = useState(null);

  const extractTextFromImage = async (file) => {
    try {
      const worker = await createWorker('es');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw error;
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
          try {
            const pdfData = e.target.result;
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

            let fullText = '';
            for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }
            resolve(fullText);
          } catch (error) {
            reject(error);
          }
        };
        fileReader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw error;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let text = '';

      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        text = await extractTextFromImage(file);
      } else {
        alert('Por favor sube un PDF o una imagen (JPG, PNG)');
        return;
      }

      const data = parseDebtData(text, file.name);
      setExtractedData(data);
      setManualEdit({ ...data });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDebtData = (text, fileName) => {
    // Normalizar texto
    const cleanText = text.replace(/\s+/g, ' ').toUpperCase();

    // Buscar monto - estrategia mejorada
    let amount = 0;

    // Buscar patrones como "Total: $1,234.56" o "Monto: 5000"
    const amountPatterns = [
      /(?:TOTAL|MONTO|DEBE|DEUDA|IMPORTE|VALOR)[\s:]+\$?\s*([\d.,]+)/,
      /\$\s*([\d.,]+)(?:\s*USD|AR|ARS)?/,
      /^([\d.,]+)\s*(?:USD|ARS|$)/m,
      /([\d.,]+)\s*(?:PESOS|DOLARES|USD|ARS)/i
    ];

    for (const pattern of amountPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const numStr = match[1].replace(/[.,]/g, (m, offset, str) => {
          // Si es el último punto/coma y va seguido de 2 dígitos, es decimal
          if ((m === ',' || m === '.') && str.length - offset === 3) return '.';
          return '';
        });
        const num = parseFloat(numStr);
        if (num > 10 && num < 999999) {
          amount = num;
          break;
        }
      }
    }

    // Si no encuentra, buscar el número más grande en el documento
    if (amount === 0) {
      const allNumbers = cleanText.match(/[\d.,]+/g) || [];
      for (const numStr of allNumbers.reverse()) {
        const num = parseFloat(numStr.replace(/[.,]/g, (m, offset, str) => {
          if ((m === ',' || m === '.') && str.length - offset === 3) return '.';
          return '';
        }));
        if (num > 10 && num < 999999) {
          amount = num;
          break;
        }
      }
    }

    // Buscar fecha - múltiples formatos
    let dueDate = new Date().toISOString().split('T')[0];

    const datePatterns = [
      /(?:VENCIMIENTO|FECHA|DUE|PAGAR|HASTA)[\s:]*(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})/,
      /(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})/
    ];

    for (const pattern of datePatterns) {
      const matches = cleanText.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        let [, part1, part2, part3] = match;
        part1 = parseInt(part1);
        part2 = parseInt(part2);
        part3 = parseInt(part3);

        // Detectar formato
        if (part1 > 1900 && part1 < 2100) {
          // YYYY-MM-DD
          if (part2 <= 12 && part3 <= 31) {
            dueDate = `${part1}-${String(part2).padStart(2, '0')}-${String(part3).padStart(2, '0')}`;
            break;
          }
        } else if (part3 > 1900 && part3 < 2100) {
          // DD-MM-YYYY o MM-DD-YYYY
          if (part1 <= 31 && part2 <= 12) {
            dueDate = `${part3}-${String(part2).padStart(2, '0')}-${String(part1).padStart(2, '0')}`;
            break;
          }
        }
      }
      if (dueDate !== new Date().toISOString().split('T')[0]) break;
    }

    // Buscar acreedor/empresa - mejorado
    let creditor = 'Deuda sin identificar';

    // Buscar palabras clave de empresas
    const creditorKeywords = ['FACTURA DE', 'FACTURA:', 'EMPRESA:', 'RAZÓN SOCIAL:', 'PROVEDOR:', 'ACREEDOR:', 'DE:', 'COMPAÑÍA:'];
    for (const keyword of creditorKeywords) {
      const pattern = new RegExp(`${keyword}\\s+(.{2,50}?)(?:\\n|$)`, 'i');
      const match = text.match(pattern);
      if (match) {
        creditor = match[1].trim().substring(0, 50);
        break;
      }
    }

    // Si no encuentra, buscar primera línea no vacía y válida
    if (creditor === 'Deuda sin identificar') {
      const lines = text.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 3 && trimmed.length < 80 && !trimmed.match(/^\d+/) && trimmed.match(/[A-Za-záéíóúñ]/)) {
          creditor = trimmed.substring(0, 50);
          break;
        }
      }
    }

    // Fallback al nombre del archivo
    if (creditor === 'Deuda sin identificar') {
      creditor = fileName.replace(/\.[^/.]+$/, '').substring(0, 50);
    }

    return {
      name: creditor,
      amount: Math.round(amount * 100) / 100,
      dueDate: dueDate,
      interestRate: 0,
      minPayment: Math.max(Math.round(amount * 0.05 * 100) / 100, 10),
      pdfFile: fileName
    };
  };

  const handleAddDebt = () => {
    if (manualEdit && manualEdit.amount > 0) {
      onDebtExtracted({
        ...manualEdit,
        amount: parseFloat(manualEdit.amount),
        minPayment: parseFloat(manualEdit.minPayment),
        interestRate: parseFloat(manualEdit.interestRate)
      });
      setExtractedData(null);
      setManualEdit(null);
      alert('✅ Deuda agregada exitosamente desde PDF');
    } else {
      alert('Por favor ingresa un monto válido');
    }
  };

  return (
    <div className="pdf-importer">
      <div className="pdf-upload-section">
        <h3>📄 Importar Deuda desde Documento</h3>
        <p className="pdf-info">Sube un PDF, factura o captura de pantalla. Extrae automáticamente los datos.</p>

        <label className="pdf-upload-label">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={isLoading}
            style={{ display: 'none' }}
          />
          <span className="upload-btn-text">
            {isLoading ? '⏳ Leyendo documento...' : '📤 Seleccionar Archivo'}
          </span>
        </label>
      </div>

      {/* Extracted Data Editor */}
      {manualEdit && (
        <div className="pdf-editor">
          <h4>✅ Datos Extraídos (puedes editar)</h4>

          <div className="editor-form">
            <div className="form-group">
              <label>Acreedor/Empresa</label>
              <input
                type="text"
                value={manualEdit.name}
                onChange={(e) => setManualEdit({ ...manualEdit, name: e.target.value })}
                placeholder="Nombre del acreedor"
              />
            </div>

            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                value={manualEdit.amount}
                onChange={(e) => setManualEdit({ ...manualEdit, amount: parseFloat(e.target.value) || 0 })}
                placeholder="1000"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Fecha de Vencimiento</label>
              <input
                type="date"
                value={manualEdit.dueDate}
                onChange={(e) => setManualEdit({ ...manualEdit, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Tasa de Interés (%)</label>
              <input
                type="number"
                value={manualEdit.interestRate}
                onChange={(e) => setManualEdit({ ...manualEdit, interestRate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Pago Mínimo</label>
              <input
                type="number"
                value={manualEdit.minPayment}
                onChange={(e) => setManualEdit({ ...manualEdit, minPayment: parseFloat(e.target.value) || 0 })}
                placeholder="100"
                step="0.01"
              />
            </div>

            <div className="editor-actions">
              <button className="btn btn-success" onClick={handleAddDebt}>
                ✅ Agregar Deuda
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => { setExtractedData(null); setManualEdit(null); }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
