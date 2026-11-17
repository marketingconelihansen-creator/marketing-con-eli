import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import DebtManager from './pages/DebtManager';
import IncomeExpense from './pages/IncomeExpense';
import BusinessDashboard from './pages/BusinessDashboard';
import Goals from './pages/Goals';
import { initFirebase, loadDataFromFirebase, saveDataToFirebase, isFirebaseReady } from './firebase';
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
  const [loading, setLoading] = useState(true);

  // Inicializar Firebase y cargar datos
  useEffect(() => {
    const initData = async () => {
      setLoading(true);

      // Inicializar Firebase
      const firebaseReady = await initFirebase();

      if (firebaseReady) {
        // Cargar datos desde Firebase con sincronización en tiempo real
        const unsubscribe = loadDataFromFirebase((remoteData) => {
          setData(remoteData);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        // Fallback a localStorage si Firebase falla
        console.log('Usando localStorage como fallback');
        const savedData = localStorage.getItem('financialData');
        if (savedData) {
          try {
            setData(JSON.parse(savedData));
          } catch (e) {
            console.error('Error loading data:', e);
          }
        } else {
          const initialData = {
            debts: [],
            income: [],
            expenses: [],
            goals: [],
            dashboard: {}
          };
          setData(initialData);
          localStorage.setItem('financialData', JSON.stringify(initialData));
        }
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Guardar datos - sincroniza con Firebase si está disponible
  const saveData = (newData) => {
    setData(newData);

    if (isFirebaseReady()) {
      saveDataToFirebase(newData);
    } else {
      localStorage.setItem('financialData', JSON.stringify(newData));
    }
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
