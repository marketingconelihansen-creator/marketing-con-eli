import React, { useState } from 'react';
import { formatCurrency, getDaysUntilDue } from '../utils/helpers';
import './Dashboard.css';

const motivationalQuotes = [
  "💪 Tu futuro financiero depende de las decisiones que tomes hoy",
  "🎯 Cada peso ahorrado es un paso hacia tu libertad",
  "✨ La riqueza no es un destino, es un viaje de disciplina",
  "🚀 Hoy es el mejor día para empezar a construir tu riqueza",
  "💎 Tu paciencia financiera hoy = tu prosperidad mañana"
];

const DoggyIcon3D = ({ percentage, label }) => (
  <div className="icon-3d-container">
    <svg viewBox="0 0 100 100" className="icon-3d">
      {/* Base dog body with 3D effect */}
      <defs>
        <linearGradient id={`dogGrad${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
          <stop offset={`${percentage}%`} style={{stopColor: '#FFD700', stopOpacity: 1}} />
          <stop offset={`${percentage}%`} style={{stopColor: '#E0E0E0', stopOpacity: 0.5}} />
          <stop offset="100%" style={{stopColor: '#E0E0E0', stopOpacity: 0.5}} />
        </linearGradient>
      </defs>
      {/* Body */}
      <ellipse cx="50" cy="50" rx="30" ry="35" fill={`url(#dogGrad${label})`} />
      {/* Head */}
      <circle cx="50" cy="25" r="18" fill={`url(#dogGrad${label})`} opacity="0.9" />
      {/* Ears */}
      <ellipse cx="38" cy="12" rx="8" ry="12" fill="#FFD700" opacity="0.8" />
      <ellipse cx="62" cy="12" rx="8" ry="12" fill="#FFD700" opacity="0.8" />
      {/* Eyes */}
      <circle cx="45" cy="22" r="2" fill="#000" />
      <circle cx="55" cy="22" r="2" fill="#000" />
      {/* Mouth */}
      <path d="M 50 28 Q 48 32 46 32" stroke="#000" fill="none" strokeWidth="1" />
      {/* Tail */}
      <path d="M 25 55 Q 10 50 15 70" stroke="#FFD700" strokeWidth="6" fill="none" opacity="0.9" />
    </svg>
    <div className="fill-percentage">{Math.round(percentage)}%</div>
    <div className="icon-label">{label}</div>
  </div>
);

export default function Dashboard({ data, loading }) {
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  if (loading) return <div className="loading">Cargando datos...</div>;

  const { totalDebts, totalIncome, totalExpenses, overdueCount } = data.dashboard;
  const balance = totalIncome - totalExpenses;
  const savings = Math.max(balance, 0);
  const savingsPercentage = Math.min((savings / (totalIncome || 1)) * 100, 100);

  const overdueDebts = data.debts?.filter(d => {
    const daysUntil = getDaysUntilDue(d.dueDate);
    return daysUntil < 0;
  }) || [];

  const nextPayments = data.debts?.filter(d => {
    const daysUntil = getDaysUntilDue(d.dueDate);
    return daysUntil >= 0 && daysUntil <= 7;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) || [];

  return (
    <div className="dashboard">
      {/* Motivational Quote */}
      <div className="motivational-banner">
        <p className="quote-text">{quote}</p>
      </div>

      {/* Title with custom styling */}
      <h1 className="dashboard-title">
        <span className="libertad">Libertad</span> <span className="financiera">Financiera</span>
      </h1>

      <div className="stats-grid">
        <div className="stat-card debt-card">
          <div className="stat-label">💳 Deudas Totales</div>
          <div className="stat-value">{formatCurrency(totalDebts)}</div>
          <div className="stat-meta">Monto pendiente de pagar</div>
        </div>

        <div className="stat-card income-card">
          <div className="stat-label">💰 Ingresos Totales</div>
          <div className="stat-value">{formatCurrency(totalIncome)}</div>
          <div className="stat-meta">Dinero ganado</div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-label">📊 Gastos Totales</div>
          <div className="stat-value">{formatCurrency(totalExpenses)}</div>
          <div className="stat-meta">Dinero gastado</div>
        </div>

        <div className={`stat-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-label">⚖️ Balance</div>
          <div className="stat-value">{formatCurrency(balance)}</div>
          <div className="stat-meta">{balance >= 0 ? 'Positivo' : 'Negativo'}</div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="monthly-section">
        <h3>📅 Presupuesto Mensual</h3>
        <div className="monthly-cards">
          <div className="month-card">
            <h4>Tienes que Pagar</h4>
            <p className="amount need-to-pay">{formatCurrency(totalDebts / 12)}</p>
            <small>Deuda mensual</small>
          </div>
          <div className="month-card">
            <h4>Necesitas para Vivir</h4>
            <p className="amount live-cost">{formatCurrency(totalExpenses)}</p>
            <small>Gasto mensual</small>
          </div>
          <div className="month-card">
            <h4>Deberías Pagar Mes a Mes</h4>
            <p className="amount total-needed">{formatCurrency((totalDebts / 12) + totalExpenses)}</p>
            <small>Total mes</small>
          </div>
        </div>
      </div>

      {/* Savings Section */}
      <div className="savings-section">
        <h3>🎯 Tus Ahorros</h3>
        <div className="savings-grid">
          <DoggyIcon3D percentage={savingsPercentage} label="Ahorros" />
        </div>
        <div className="savings-info">
          <p>Tienes <strong>{formatCurrency(savings)}</strong> disponibles</p>
          <p className="savings-percentage">{Math.round(savingsPercentage)}% de tus ingresos</p>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="alert-danger">
          ⚠️ Tienes <strong>{overdueCount}</strong> pago(s) atrasado(s)
        </div>
      )}

      <div className="sections">
        <div className="section">
          <h3>🔴 Pagos Atrasados ({overdueDebts.length})</h3>
          {overdueDebts.length === 0 ? (
            <p className="text-muted">¡Excelente! No tienes pagos atrasados.</p>
          ) : (
            <div className="debt-list">
              {overdueDebts.map(debt => (
                <div key={debt.id} className="debt-item overdue">
                  <div className="debt-info">
                    <div className="debt-creditor">{debt.creditor}</div>
                    <div className="debt-date">Vencido hace {Math.abs(getDaysUntilDue(debt.dueDate))} días</div>
                  </div>
                  <div className="debt-amount">{formatCurrency(debt.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3>🟡 Próximos Pagos (Próximos 7 días)</h3>
          {nextPayments.length === 0 ? (
            <p className="text-muted">No hay pagos vencidos en la próxima semana.</p>
          ) : (
            <div className="debt-list">
              {nextPayments.map(debt => (
                <div key={debt.id} className="debt-item upcoming">
                  <div className="debt-info">
                    <div className="debt-creditor">{debt.creditor}</div>
                    <div className="debt-date">Vence en {getDaysUntilDue(debt.dueDate)} días</div>
                  </div>
                  <div className="debt-amount">{formatCurrency(debt.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tip-box">
        <h4>💡 Consejo</h4>
        <p>Enfócate primero en pagar las deudas atrasadas para evitar más intereses. Luego mantén un orden con los próximos pagos.</p>
      </div>
    </div>
  );
}
