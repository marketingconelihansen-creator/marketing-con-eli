import React, { useState } from 'react';
import axios from 'axios';
import { formatCurrency, getTodayISO } from '../utils/helpers';
import './Goals.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Goals({ goals, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    category: 'Ahorro',
    description: '',
    icon: '🎯',
    color: '#6366f1'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/goals`, formData);
      setFormData({
        name: '',
        targetAmount: '',
        category: 'Ahorro',
        description: '',
        icon: '🎯',
        color: '#6366f1'
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Error al crear la meta');
    }
  };

  const handleUpdateProgress = async (goalId, currentAmount) => {
    const newAmount = parseFloat(prompt('Monto actual:', currentAmount));
    if (newAmount !== null && newAmount !== NaN) {
      try {
        await axios.put(`${API_URL}/api/goals/${goalId}`, { currentAmount: newAmount });
        onUpdate();
      } catch (error) {
        console.error('Error updating goal:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta meta?')) {
      try {
        await axios.delete(`${API_URL}/api/goals/${id}`);
        onUpdate();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const ProgressCircle = ({ percentage, currentAmount, targetAmount, icon, color, name }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-circle-container">
        <svg className="progress-circle-svg" viewBox="0 0 100 100">
          <circle
            className="progress-circle-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            className="progress-circle-fill"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDashoffset,
              stroke: color
            }}
          />
        </svg>
        <div className="progress-circle-content">
          <div className="progress-icon">{icon}</div>
          <div className="progress-percentage">{Math.round(percentage)}%</div>
          <div className="progress-name">{name}</div>
        </div>
      </div>
    );
  };

  const totalGoalAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const globalProgress = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;

  return (
    <div className="goals-page">
      <h2>🎯 Mis Metas</h2>

      <div className="goals-summary">
        <div className="summary-card">
          <div className="summary-label">Metas Activas</div>
          <div className="summary-value">{goals.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Progreso Total</div>
          <div className="summary-value">{Math.round(globalProgress)}%</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Ya Alcanzado</div>
          <div className="summary-value">{formatCurrency(totalCurrentAmount)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Meta Total</div>
          <div className="summary-value">{formatCurrency(totalGoalAmount)}</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖ Cancelar' : '➕ Nueva Meta'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="goals-form card">
          <h3>Crear Nueva Meta</h3>

          <div className="form-group">
            <label>Nombre de la Meta *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: Fondo de emergencia, Pagar deudas Veraz"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Monto Meta *</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                placeholder="1000000"
                step="1000"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option>Ahorro</option>
                <option>Pagar Deuda</option>
                <option>Inversión</option>
                <option>Viaje</option>
                <option>Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Emoji</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                maxLength="2"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detalles de la meta"
              rows="2"
            />
          </div>

          <button type="submit" className="btn btn-primary">Crear Meta</button>
        </form>
      )}

      <div className="goals-container">
        {goals.length === 0 ? (
          <div className="empty-state">
            <p>📌 No tienes metas creadas</p>
            <p className="text-muted">Crea una meta para empezar a alcanzar tus objetivos</p>
          </div>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => {
              const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                  <div className="goal-header">
                    <h3>{goal.name}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(goal.id)}
                    >
                      ✕
                    </button>
                  </div>

                  <ProgressCircle
                    percentage={Math.min(percentage, 100)}
                    currentAmount={goal.currentAmount}
                    targetAmount={goal.targetAmount}
                    icon={goal.icon}
                    color={goal.color}
                    name={goal.name}
                  />

                  <div className="goal-stats">
                    <div className="stat">
                      <div className="stat-label">Alcanzado</div>
                      <div className="stat-value">{formatCurrency(goal.currentAmount)}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Meta</div>
                      <div className="stat-value">{formatCurrency(goal.targetAmount)}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Falta</div>
                      <div className="stat-value">
                        {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                      </div>
                    </div>
                  </div>

                  {goal.description && (
                    <div className="goal-description">{goal.description}</div>
                  )}

                  <button
                    className="btn btn-primary btn-update"
                    onClick={() => handleUpdateProgress(goal.id, goal.currentAmount)}
                  >
                    📊 Actualizar Progreso
                  </button>

                  {isCompleted && (
                    <div className="goal-completed">
                      ✅ ¡Meta completada!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
