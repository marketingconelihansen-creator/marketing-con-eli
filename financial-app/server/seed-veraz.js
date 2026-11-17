import sqlite3 from 'sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'financial.db');
const db = new sqlite3.Database(dbPath);

// Deudas basadas en el informe de Veraz y datos proporcionados
const verazDebts = [
  // Deudas actuales mensuales
  { creditor: 'Alquiler (Casa)', amount: 590000, dueDate: '2026-12-15', category: 'Alquiler', source: 'Personal' },
  { creditor: 'Cuota Curso (1/2)', amount: 244000, dueDate: '2026-12-01', category: 'Educación', source: 'Personal' },
  { creditor: 'Cuota Curso (2/2)', amount: 244000, dueDate: '2027-01-01', category: 'Educación', source: 'Personal' },
  { creditor: 'Servicio Luz', amount: 590000, dueDate: '2026-12-20', category: 'Servicios', source: 'Personal' },
  { creditor: 'Obra Social (Cuota 1)', amount: 206000, dueDate: '2026-11-30', category: 'Salud', source: 'Personal', status: 'pending' },
  { creditor: 'Obra Social (Cuota 2)', amount: 206000, dueDate: '2026-10-31', category: 'Salud', source: 'Personal', status: 'pending' },
  { creditor: 'Seguro Moto', amount: 35000, dueDate: '2026-12-10', category: 'Seguros', source: 'Personal' },

  // Deudas de Veraz (basadas en el reporte)
  { creditor: 'Banco Santander Río', amount: 260000, dueDate: '2027-01-15', category: 'Tarjeta Crédito', source: 'Veraz' },
  { creditor: 'Banco De La Ciudad Buenos Aires', amount: 260000, dueDate: '2027-01-15', category: 'Préstamo Bancario', source: 'Veraz' },
  { creditor: 'Montemar Compañía Financiera', amount: 260000, dueDate: '2027-01-15', category: 'Préstamo Bancario', source: 'Veraz' },
  { creditor: 'Tarjeta Naranja', amount: 72000, dueDate: '2027-01-15', category: 'Tarjeta Crédito', source: 'Veraz' },
  { creditor: 'Banco De La Nación Argentina', amount: 72000, dueDate: '2027-01-15', category: 'Préstamo Bancario', source: 'Veraz' },
  { creditor: 'MercadoLibre', amount: 176000, dueDate: '2027-01-15', category: 'Otros', source: 'Veraz' },
  { creditor: 'Crédito Fideicomisor', amount: 257000, dueDate: '2027-01-15', category: 'Préstamo Bancario', source: 'Veraz' },

  // Monotributo
  { creditor: 'AFIP - Monotributo (Cuota 1)', amount: 150000, dueDate: '2026-12-01', category: 'Impuestos', source: 'Personal', status: 'pending' },
  { creditor: 'AFIP - Monotributo (Cuota 2)', amount: 150000, dueDate: '2026-11-01', category: 'Impuestos', source: 'Personal', status: 'pending' },
  { creditor: 'AFIP - Monotributo Refinanciación (Cuota 1)', amount: 120000, dueDate: '2026-12-15', category: 'Impuestos', source: 'Personal', status: 'pending' },
  { creditor: 'AFIP - Monotributo Refinanciación (Cuota 2)', amount: 120000, dueDate: '2027-01-15', category: 'Impuestos', source: 'Personal' },
  { creditor: 'AFIP - Monotributo Refinanciación (Cuota 3)', amount: 120000, dueDate: '2027-02-15', category: 'Impuestos', source: 'Personal' },
];

const seedDatabase = () => {
  db.serialize(() => {
    // Verificar si ya existen datos
    db.get("SELECT COUNT(*) as count FROM debts", (err, row) => {
      if (err) {
        console.error('Error:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Cargando deudas de Veraz...');

        verazDebts.forEach(debt => {
          db.run(
            `INSERT INTO debts (id, creditor, amount, dueDate, category, source, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              uuid(),
              debt.creditor,
              debt.amount,
              debt.dueDate,
              debt.category,
              debt.source,
              debt.status || 'pending',
              debt.notes || null
            ],
            (err) => {
              if (err) console.error('Error inserting debt:', err);
            }
          );
        });

        console.log(`✅ ${verazDebts.length} deudas cargadas exitosamente`);
      } else {
        console.log(`Base de datos ya contiene ${row.count} deudas`);
      }

      db.close();
    });
  });
};

seedDatabase();
