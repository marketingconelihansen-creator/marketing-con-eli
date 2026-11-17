import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers';
import './DebtManager.css';

export default function DebtManager({ debts: initialDebts, onUpdate }) {
  const [debts, setDebts] = useState(initialDebts || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: 0,
    minPayment: '',
    status: 'active'
  });

  useEffect(() => {
    setDebts(initialDebts || []);
  }, [initialDebts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'amount' || name === 'minPayment' || name === 'interestRate') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDebt = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);

    const data = JSON.parse(localStorage.getItem('financialData')) || {};
    data.debts = updatedDebts;
    localStorage.setItem('financialData', JSON.stringify(data));

    setFormData({ name: '', amount: '', interestRate: 0, minPayment: '', status: 'active' });
    setShowForm(false);
    onUpdate();
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro?')) {
      const updatedDebts = debts.filter(d => d.id !== id);
      setDebts(updatedDebts);
      const data = JSON.parse(localStorage.getItem('financialData')) || {};
      data.debts = updatedDebts;
      localStorage.setItem('financialData', JSON.stringify(data));
      onUpdate();
    }
  };

  const activeDebts = debts.filter(d => d.status === 'active');
  const totalDebt = activeDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="debt-manager">
      <h2>💳 Gestión de Deudas</h2>

      <div className="debt-summary">
        <div className="summary-card">
          <div className="summary-label">Deudas Activas</div>
          <div className="summary-value">{activeDebts.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Adeudado</div>
          <div className="summary-value">{formatCurrency(totalDebt)}</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖ Cancelar' : '➕ Agregar Deuda'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="debt-form card">
          <h3>Nueva Deuda</h3>
          <div className="form-group">
            <label>Nombre *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Tarjeta Crédito" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Monto *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="1000" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Tasa de Interés (%)</label>
              <input type="number" name="interestRate" value={formData.interestRate} onChange={handleInputChange} placeholder="18" step="0.1" />
            </div>
            <div className="form-group">
              <label>Pago Mínimo</label>
              <input type="number" name="minPayment" value={formData.minPayment} onChange={handleInputChange} placeholder="100" step="0.01" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Guardar Deuda</button>
        </form>
      )}

      <div className="debts-container mt-4">
        <h3>📋 Mis Deudas</h3>
        {activeDebts.length === 0 ? (
          <p className="text-muted">¡Excelente! No tienes deudas registradas.</p>
        ) : (
          <div className="debt-grid">
            {activeDebts.map(debt => (
              <div key={debt.id} className="debt-card">
                <div className="debt-header">
                  <h4>{debt.name}</h4>
                  <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(debt.id)}>🗑️</button>
                </div>
                <div className="debt-body">
                  <div className="amount-box">{formatCurrency(debt.amount)}</div>
                  <div className="debt-details">
                    <p>Interés: {debt.interestRate}%</p>
                    <p>Pago mín: {formatCurrency(debt.minPayment)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
