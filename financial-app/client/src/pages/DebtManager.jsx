import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/helpers';
import './DebtManager.css';

export default function DebtManager({ debts: initialDebts, onUpdate }) {
  const [debts, setDebts] = useState(initialDebts || []);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingDebtId, setUploadingDebtId] = useState(null);
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

  const handleUploadReceipt = (debtId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedDebts = debts.map(d => {
          if (d.id === debtId) {
            return {
              ...d,
              status: 'paid',
              receiptFile: file.name,
              uploadDate: new Date().toLocaleDateString('es-AR'),
              receiptData: event.target.result
            };
          }
          return d;
        });
        setDebts(updatedDebts);
        const data = JSON.parse(localStorage.getItem('financialData')) || {};
        data.debts = updatedDebts;
        localStorage.setItem('financialData', JSON.stringify(data));
        setUploadingDebtId(null);
        onUpdate();
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDebts = debts.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDebts = filteredDebts.filter(d => d.status === 'active');
  const paidDebts = filteredDebts.filter(d => d.status === 'paid');
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

      <div className="debt-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar deuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Cancelar' : '➕ Agregar Deuda'}
        </button>
      </div>

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

      {/* Deudas Activas */}
      <div className="debts-container mt-4">
        <h3>🔴 Deudas Pendientes ({activeDebts.length})</h3>
        {activeDebts.length === 0 ? (
          <p className="text-muted">¡Excelente! No tienes deudas pendientes.</p>
        ) : (
          <div className="debt-grid">
            {activeDebts.map(debt => (
              <div key={debt.id} className="debt-card active-debt">
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
                <div className="debt-actions">
                  <label className="upload-btn">
                    📄 Subir Comprobante
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleUploadReceipt(debt.id, e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deudas Pagadas */}
      {paidDebts.length > 0 && (
        <div className="debts-container mt-4">
          <h3>🟢 Deudas Pagadas ({paidDebts.length})</h3>
          <div className="debt-grid">
            {paidDebts.map(debt => (
              <div key={debt.id} className="debt-card paid-debt">
                <div className="debt-header">
                  <h4>{debt.name}</h4>
                  <span className="paid-badge">✅ PAGADA</span>
                </div>
                <div className="debt-body">
                  <div className="amount-box paid">{formatCurrency(debt.amount)}</div>
                  <div className="debt-details">
                    <p>Pagada el: {debt.uploadDate}</p>
                    <p>Comprobante: {debt.receiptFile}</p>
                  </div>
                </div>
                <div className="debt-actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDelete(debt.id)}
                    style={{ color: 'var(--danger)' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
