import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/PDFImporter.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFImporter({ onDebtExtracted }) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [manualEdit, setManualEdit] = useState(null);

  const extractTextFromPDF = async (file) => {
    setIsLoading(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const pdfData = e.target.result;
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let fullText = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        // Extrae datos del texto
        const data = parseDebtData(fullText, file.name);
        setExtractedData(data);
        setManualEdit({ ...data });
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading PDF:', error);
      alert('Error al leer el PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDebtData = (text, fileName) => {
    // Busca números grandes (posibles montos) - busca números de 2-10 dígitos
    const amountMatches = text.match(/\$?\s*([\d,]+(?:\.?\d{1,2})?)/g) || [];
    let amount = 0;
    for (let match of amountMatches) {
      const num = parseFloat(match.replace(/[^0-9.-]/g, ''));
      if (num > 10 && num < 999999) {
        amount = num;
        break;
      }
    }

    // Busca fechas (DD/MM/YYYY o DD-MM-YYYY o YYYY-MM-DD)
    const dateMatch = text.match(/(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})/);
    let dueDate = new Date().toISOString().split('T')[0];
    if (dateMatch) {
      let [, part1, part2, part3] = dateMatch;
      if (part1.length === 4) {
        dueDate = `${part1}-${part2.padStart(2, '0')}-${part3.padStart(2, '0')}`;
      } else {
        dueDate = `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
      }
    }

    // Mejora búsqueda de acreedor - busca en las primeras líneas del PDF
    let creditor = 'Deuda sin identificar';
    const lines = text.split('\n').slice(0, 15);
    for (let line of lines) {
      line = line.trim();
      if (line.length > 2 && line.length < 60 && !line.match(/^\d+/) && line.match(/[a-záéíóúñ]/i)) {
        creditor = line.replace(/\s+/g, ' ');
        break;
      }
    }
    if (creditor === 'Deuda sin identificar') {
      creditor = fileName.replace(/\.[^/.]+$/, '').substring(0, 40);
    }

    return {
      name: creditor,
      amount: amount,
      dueDate: dueDate,
      interestRate: 0,
      minPayment: Math.max(amount * 0.05, 10),
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
        <h3>📄 Importar Deuda desde PDF</h3>
        <p className="pdf-info">Sube una factura o documento de deuda. La app extraerá automáticamente los datos.</p>

        <label className="pdf-upload-label">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files[0] && extractTextFromPDF(e.target.files[0])}
            disabled={isLoading}
            style={{ display: 'none' }}
          />
          <span className="upload-btn-text">
            {isLoading ? '⏳ Leyendo PDF...' : '📤 Seleccionar PDF'}
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
