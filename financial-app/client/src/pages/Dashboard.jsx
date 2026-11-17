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
    <svg viewBox="0 0 120 140" className="icon-3d doggy-floating">
      {/* Dollar bills in left hand */}
      <g className="left-dollar">
        <rect x="10" y="45" width="20" height="12" fill="#10b981" stroke="#059669" strokeWidth="1" />
        <text x="20" y="54" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">$</text>
      </g>

      {/* Dollar bills in right hand */}
      <g className="right-dollar">
        <rect x="90" y="45" width="20" height="12" fill="#10b981" stroke="#059669" strokeWidth="1" />
        <text x="100" y="54" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">$</text>
      </g>

      {/* Wings */}
      <g className="wings">
        <path d="M 42 32 Q 25 22 32 52" stroke="#fbbf24" strokeWidth="4" fill="none" opacity="0.8" />
        <path d="M 78 32 Q 95 22 88 52" stroke="#fbbf24" strokeWidth="4" fill="none" opacity="0.8" />
      </g>

      {/* Body with fill gradient */}
      <defs>
        <linearGradient id={`dogGrad${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
          <stop offset={`${percentage}%`} style={{stopColor: '#FFD700', stopOpacity: 1}} />
          <stop offset={`${percentage}%`} style={{stopColor: '#E0E0E0', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#E0E0E0', stopOpacity: 0.3}} />
        </linearGradient>
      </defs>

      {/* Body */}
      <ellipse cx="60" cy="70" rx="25" ry="30" fill={`url(#dogGrad${label})`} />

      {/* Head */}
      <circle cx="60" cy="40" r="16" fill={`url(#dogGrad${label})`} opacity="0.95" />

      {/* Ears */}
      <ellipse cx="48" cy="28" rx="7" ry="11" fill="#FFD700" opacity="0.85" />
      <ellipse cx="72" cy="28" rx="7" ry="11" fill="#FFD700" opacity="0.85" />

      {/* Eyes */}
      <circle cx="55" cy="37" r="1.5" fill="#000" />
      <circle cx="65" cy="37" r="1.5" fill="#000" />

      {/* Happy mouth */}
      <path d="M 60 42 Q 58 44 56 43.5" stroke="#000" fill="none" strokeWidth="0.8" />

      {/* Tail */}
      <path d="M 38 80 Q 20 75 25 100" stroke="#FFD700" strokeWidth="5" fill="none" opacity="0.9" />

      {/* Power effect */}
      <circle cx="60" cy="70" r="45" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
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
