import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'financial.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
const initDb = () => {
  db.serialize(() => {
    // Tabla de deudas
    db.run(`CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY,
      creditor TEXT NOT NULL,
      amount REAL NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      category TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      source TEXT
    )`);

    // Tabla de ingresos
    db.run(`CREATE TABLE IF NOT EXISTS income (
      id TEXT PRIMARY KEY,
      business TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de gastos
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      business TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de pagos realizados
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      debtId TEXT,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      method TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (debtId) REFERENCES debts(id)
    )`);

    // Tabla de notificaciones
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      debtId TEXT,
      type TEXT,
      message TEXT,
      read BOOLEAN DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (debtId) REFERENCES debts(id)
    )`);
  });
};

initDb();

// DEUDAS - Endpoints

// Obtener todas las deudas
app.get('/api/debts', (req, res) => {
  db.all(`SELECT * FROM debts ORDER BY dueDate ASC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener deuda por ID
app.get('/api/debts/:id', (req, res) => {
  db.get(`SELECT * FROM debts WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Crear deuda
app.post('/api/debts', (req, res) => {
  const { creditor, amount, dueDate, category, notes, source } = req.body;
  const id = uuid();

  db.run(
    `INSERT INTO debts (id, creditor, amount, dueDate, category, notes, source) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, creditor, amount, dueDate, category, notes, source],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, creditor, amount, dueDate, category, notes, source, status: 'pending' });
    }
  );
});

// Actualizar deuda
app.put('/api/debts/:id', (req, res) => {
  const { creditor, amount, dueDate, status, category, notes } = req.body;

  db.run(
    `UPDATE debts SET creditor = ?, amount = ?, dueDate = ?, status = ?, category = ?, notes = ? WHERE id = ?`,
    [creditor, amount, dueDate, status, category, notes, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Eliminar deuda
app.delete('/api/debts/:id', (req, res) => {
  db.run(`DELETE FROM debts WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// INGRESOS - Endpoints

// Obtener ingresos
app.get('/api/income', (req, res) => {
  db.all(`SELECT * FROM income ORDER BY date DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear ingreso
app.post('/api/income', (req, res) => {
  const { business, amount, date, category, description } = req.body;
  const id = uuid();

  db.run(
    `INSERT INTO income (id, business, amount, date, category, description) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, business, amount, date, category, description],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, business, amount, date, category, description });
    }
  );
});

// GASTOS - Endpoints

// Obtener gastos
app.get('/api/expenses', (req, res) => {
  db.all(`SELECT * FROM expenses ORDER BY date DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear gasto
app.post('/api/expenses', (req, res) => {
  const { business, amount, date, category, description } = req.body;
  const id = uuid();

  db.run(
    `INSERT INTO expenses (id, business, amount, date, category, description) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, business, amount, date, category, description],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, business, amount, date, category, description });
    }
  );
});

// PAGOS - Endpoints

// Registrar pago
app.post('/api/payments', (req, res) => {
  const { debtId, amount, date, method, notes } = req.body;
  const id = uuid();

  db.run(
    `INSERT INTO payments (id, debtId, amount, date, method, notes) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, debtId, amount, date, method, notes],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, debtId, amount, date, method, notes });
    }
  );
});

// DASHBOARD - Estadísticas

app.get('/api/dashboard', (req, res) => {
  db.all(`SELECT SUM(amount) as totalDebts FROM debts WHERE status = 'pending'`, (err, row1) => {
    db.all(`SELECT SUM(amount) as totalIncome FROM income`, (err, row2) => {
      db.all(`SELECT SUM(amount) as totalExpenses FROM expenses`, (err, row3) => {
        db.all(`SELECT COUNT(*) as overdueCount FROM debts WHERE status = 'pending' AND dueDate < date('now')`, (err, row4) => {
          res.json({
            totalDebts: row1[0]?.totalDebts || 0,
            totalIncome: row2[0]?.totalIncome || 0,
            totalExpenses: row3[0]?.totalExpenses || 0,
            overdueCount: row4[0]?.overdueCount || 0
          });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
