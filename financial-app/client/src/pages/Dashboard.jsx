import React from 'react';
import { formatCurrency, getDaysUntilDue } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard({ data, loading }) {
  if (loading) return <div className="loading">Cargando datos...</div>;

  const { totalDebts, totalIncome, totalExpenses, overdueCount } = data.dashboard;
  const balance = totalIncome - totalExpenses;

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
      <h2>📊 Panel de Control</h2>

      <div className="stats-grid">
        <div className="stat-card debt-card">
          <div className="stat-label">Deudas Totales</div>
          <div className="stat-value">{formatCurrency(totalDebts)}</div>
          <div className="stat-meta">Monto pendiente de pagar</div>
        </div>

        <div className="stat-card income-card">
          <div className="stat-label">Ingresos Totales</div>
          <div className="stat-value">{formatCurrency(totalIncome)}</div>
          <div className="stat-meta">Dinero ganado</div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-label">Gastos Totales</div>
          <div className="stat-value">{formatCurrency(totalExpenses)}</div>
          <div className="stat-meta">Dinero gastado</div>
        </div>

        <div className={`stat-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-label">Balance</div>
          <div className="stat-value">{formatCurrency(balance)}</div>
          <div className="stat-meta">{balance >= 0 ? 'Positivo' : 'Negativo'}</div>
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
