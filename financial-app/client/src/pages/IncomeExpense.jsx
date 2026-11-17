import React, { useState } from 'react';
import axios from 'axios';
import { formatCurrency, getTodayISO } from '../utils/helpers';
import './IncomeExpense.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function IncomeExpense({ income, expenses, onUpdate }) {
  const [formType, setFormType] = useState('income');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    business: 'ODC',
    amount: '',
    date: getTodayISO(),
    category: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formType === 'income' ? '/api/income' : '/api/expenses';
      await axios.post(`${API_URL}${endpoint}`, formData);
      setFormData({
        business: 'ODC',
        amount: '',
        date: getTodayISO(),
        category: '',
        description: ''
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Error al registrar');
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const businesses = ['ODC', 'Ebooks Diabetes', 'Cursos Marketing', 'Agencia Viajes'];

  return (
    <div className="income-expense">
      <h2>💰 Ingresos y Gastos</h2>

      <div className="ie-summary">
        <div className="summary-card income">
          <div className="summary-label">Ingresos</div>
          <div className="summary-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="summary-card expense">
          <div className="summary-label">Gastos</div>
          <div className="summary-value">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="summary-label">Balance</div>
          <div className="summary-value">{formatCurrency(balance)}</div>
        </div>
      </div>

      <div className="form-controls">
        <button
          className={`btn ${formType === 'income' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setFormType('income'); setShowForm(true); }}
        >
          ➕ Agregar Ingreso
        </button>
        <button
          className={`btn ${formType === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setFormType('expense'); setShowForm(true); }}
        >
          ➖ Agregar Gasto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="ie-form card">
          <h3>{formType === 'income' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Negocio *</label>
              <select name="business" value={formData.business} onChange={handleInputChange} required>
                {businesses.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Monto *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="1000"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Ej: Venta, Publicidad, Comisión"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detalles del registro"
              rows="2"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">Guardar</button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowForm(false)}
              style={{ background: 'var(--border)', color: 'var(--text)' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="records-container">
        <h3>📊 Ingresos Recientes</h3>
        {income.length === 0 ? (
          <p className="text-muted">No hay ingresos registrados</p>
        ) : (
          <div className="records-list">
            {income.slice().reverse().map(item => (
              <div key={item.id} className="record-item income-item">
                <div className="record-info">
                  <div className="record-business">{item.business}</div>
                  <div className="record-meta">{item.date} {item.category && `• ${item.category}`}</div>
                  {item.description && <div className="record-desc">{item.description}</div>}
                </div>
                <div className="record-amount income-amount">+{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="records-container">
        <h3>📉 Gastos Recientes</h3>
        {expenses.length === 0 ? (
          <p className="text-muted">No hay gastos registrados</p>
        ) : (
          <div className="records-list">
            {expenses.slice().reverse().map(item => (
              <div key={item.id} className="record-item expense-item">
                <div className="record-info">
                  <div className="record-business">{item.business}</div>
                  <div className="record-meta">{item.date} {item.category && `• ${item.category}`}</div>
                  {item.description && <div className="record-desc">{item.description}</div>}
                </div>
                <div className="record-amount expense-amount">-{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
