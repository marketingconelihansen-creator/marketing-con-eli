import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import DebtManager from './pages/DebtManager';
import IncomeExpense from './pages/IncomeExpense';
import BusinessDashboard from './pages/BusinessDashboard';
import Goals from './pages/Goals';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState({
    debts: [],
    income: [],
    expenses: [],
    goals: [],
    dashboard: {}
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos de localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    } else {
      // Datos de ejemplo iniciales
      const initialData = {
        debts: [
          { id: 1, name: 'Tarjeta Crédito', amount: 2500, interestRate: 18, minPayment: 100, status: 'active' },
          { id: 2, name: 'Auto Préstamo', amount: 15000, interestRate: 6, minPayment: 300, status: 'active' }
        ],
        income: [
          { id: 1, source: 'Salario', amount: 3000, frequency: 'monthly', date: new Date().toISOString() }
        ],
        expenses: [
          { id: 1, category: 'Alimentación', amount: 500, date: new Date().toISOString() },
          { id: 2, category: 'Transporte', amount: 200, date: new Date().toISOString() }
        ],
        goals: [
          { id: 1, name: 'Fondo de Emergencia', target: 5000, current: 1200, deadline: '2025-12-31' },
          { id: 2, name: 'Vacaciones', target: 2000, current: 800, deadline: '2025-06-30' }
        ],
        dashboard: { totalIncome: 3000, totalExpenses: 700, totalDebts: 17500 }
      };
      setData(initialData);
      localStorage.setItem('financialData', JSON.stringify(initialData));
    }
  }, []);

  // Guardar datos cuando cambian
  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem('financialData', JSON.stringify(newData));
  };

  const handleDataUpdate = () => {
    // Los datos se actualizan directamente
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={data} loading={loading} />;
      case 'debts':
        return <DebtManager debts={data.debts} onUpdate={handleDataUpdate} />;
      case 'income-expense':
        return <IncomeExpense income={data.income} expenses={data.expenses} onUpdate={handleDataUpdate} />;
      case 'business':
        return <BusinessDashboard income={data.income} expenses={data.expenses} />;
      case 'goals':
        return <Goals goals={data.goals} onUpdate={handleDataUpdate} />;
      default:
        return <Dashboard data={data} loading={loading} />;
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <h1 className="logo">🎯 Libertad Financiera</h1>
        <nav className="nav-links">
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${currentPage === 'debts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('debts')}
          >
            💳 Deudas
          </button>
          <button
            className={`nav-btn ${currentPage === 'income-expense' ? 'active' : ''}`}
            onClick={() => setCurrentPage('income-expense')}
          >
            💰 Ingresos/Gastos
          </button>
          <button
            className={`nav-btn ${currentPage === 'business' ? 'active' : ''}`}
            onClick={() => setCurrentPage('business')}
          >
            🏢 Negocios
          </button>
          <button
            className={`nav-btn ${currentPage === 'goals' ? 'active' : ''}`}
            onClick={() => setCurrentPage('goals')}
          >
            🎯 Metas
          </button>
        </nav>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="footer">
        <p>© 2024 Mi Finanzas. Creado para tu éxito financiero.</p>
      </footer>
    </div>
  );
}
