import React, { useState } from 'react';
import axios from 'axios';
import { formatCurrency, getDaysUntilDue, getTodayISO } from '../utils/helpers';
import './DebtManager.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DebtManager({ debts, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    creditor: '',
    amount: '',
    dueDate: getTodayISO(),
    category: 'Otros',
    notes: '',
    source: 'Veraz'
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
      await axios.post(`${API_URL}/api/debts`, formData);
      setFormData({
        creditor: '',
        amount: '',
        dueDate: getTodayISO(),
        category: 'Otros',
        notes: '',
        source: 'Veraz'
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating debt:', error);
      alert('Error al crear la deuda');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
      try {
        await axios.delete(`${API_URL}/api/debts/${id}`);
        onUpdate();
      } catch (error) {
        console.error('Error deleting debt:', error);
        alert('Error al eliminar la deuda');
      }
    }
  };

  const pendingDebts = debts.filter(d => d.status === 'pending');
  const paidDebts = debts.filter(d => d.status === 'paid');

  const sortedDebts = [...pendingDebts].sort((a, b) => {
    const daysA = getDaysUntilDue(a.dueDate);
    const daysB = getDaysUntilDue(b.dueDate);
    return daysA - daysB;
  });

  const totalDebt = pendingDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="debt-manager">
      <h2>💳 Gestión de Deudas</h2>

      <div className="debt-summary">
        <div className="summary-card">
          <div className="summary-label">Deudas Pendientes</div>
          <div className="summary-value">{pendingDebts.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Adeudado</div>
          <div className="summary-value">{formatCurrency(totalDebt)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Deudas Pagadas</div>
          <div className="summary-value">{paidDebts.length}</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖ Cancelar' : '➕ Agregar Deuda'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="debt-form card">
          <h3>Nueva Deuda</h3>

          <div className="form-group">
            <label>Acreedor *</label>
            <input
              type="text"
              name="creditor"
              value={formData.creditor}
              onChange={handleInputChange}
              placeholder="Ej: Banco, Tarjeta de crédito"
              required
            />
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label>Fecha de Vencimiento *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option>Otros</option>
                <option>Tarjeta Crédito</option>
                <option>Préstamo Bancario</option>
                <option>Servicios</option>
                <option>Alquiler</option>
                <option>Impuestos</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fuente</label>
              <select name="source" value={formData.source} onChange={handleInputChange}>
                <option>Veraz</option>
                <option>Personal</option>
                <option>Familiar</option>
                <option>Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Detalles adicionales"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">Guardar Deuda</button>
        </form>
      )}

      <div className="debts-container">
        <h3>📋 Deudas Pendientes</h3>
        {sortedDebts.length === 0 ? (
          <p className="text-muted">¡Excelente! No tienes deudas registradas.</p>
        ) : (
          <div className="debt-grid">
            {sortedDebts.map(debt => {
              const daysUntil = getDaysUntilDue(debt.dueDate);
              const isOverdue = daysUntil < 0;
              const isUrgent = daysUntil >= 0 && daysUntil <= 7;

              return (
                <div key={debt.id} className={`debt-card ${isOverdue ? 'overdue' : isUrgent ? 'urgent' : ''}`}>
                  <div className="debt-header">
                    <div>
                      <h4>{debt.creditor}</h4>
                      <p className="text-muted">{debt.category} {debt.source && `• ${debt.source}`}</p>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleDelete(debt.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="debt-body">
                    <div className="amount-box">{formatCurrency(debt.amount)}</div>
                    <div className={`days-status ${isOverdue ? 'overdue-text' : isUrgent ? 'urgent-text' : ''}`}>
                      {isOverdue
                        ? `⚠️ Atrasado hace ${Math.abs(daysUntil)} días`
                        : `📅 Vence en ${daysUntil} días`
                      }
                    </div>
                  </div>

                  {debt.notes && <div className="debt-notes">{debt.notes}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {paidDebts.length > 0 && (
        <div className="debts-container mt-4">
          <h3>✅ Deudas Pagadas ({paidDebts.length})</h3>
          <div className="debt-grid">
            {paidDebts.map(debt => (
              <div key={debt.id} className="debt-card paid">
                <div className="debt-header">
                  <div>
                    <h4>{debt.creditor}</h4>
                    <p className="text-muted">{debt.category}</p>
                  </div>
                </div>
                <div className="amount-box">{formatCurrency(debt.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
