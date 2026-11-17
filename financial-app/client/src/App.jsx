import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [debts, income, expenses, goals, dashboard] = await Promise.all([
        axios.get(`${API_URL}/api/debts`),
        axios.get(`${API_URL}/api/income`),
        axios.get(`${API_URL}/api/expenses`),
        axios.get(`${API_URL}/api/goals`),
        axios.get(`${API_URL}/api/dashboard`)
      ]);

      setData({
        debts: debts.data,
        income: income.data,
        expenses: expenses.data,
        goals: goals.data,
        dashboard: dashboard.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataUpdate = () => {
    fetchData();
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
