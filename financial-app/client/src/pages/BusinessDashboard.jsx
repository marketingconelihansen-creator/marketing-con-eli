import React from 'react';
import { formatCurrency, groupByBusiness } from '../utils/helpers';
import './BusinessDashboard.css';

export default function BusinessDashboard({ income, expenses }) {
  const incomeByBusiness = groupByBusiness(income);
  const expensesByBusiness = groupByBusiness(expenses);

  const businesses = new Set([
    ...Object.keys(incomeByBusiness),
    ...Object.keys(expensesByBusiness),
    'ODC',
    'Ebooks Diabetes',
    'Cursos Marketing',
    'Agencia Viajes'
  ]);

  const getBusinessData = (business) => {
    const businessIncome = incomeByBusiness[business]?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const businessExpenses = expensesByBusiness[business]?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const profit = businessIncome - businessExpenses;
    const profitMargin = businessIncome > 0 ? ((profit / businessIncome) * 100).toFixed(1) : 0;

    return {
      name: business,
      income: businessIncome,
      expenses: businessExpenses,
      profit,
      profitMargin,
      hasData: businessIncome > 0 || businessExpenses > 0
    };
  };

  const allBusinesses = Array.from(businesses)
    .map(getBusinessData)
    .sort((a, b) => b.profit - a.profit);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalProfit = totalIncome - totalExpenses;

  return (
    <div className="business-dashboard">
      <h2>🏢 Desempeño de Negocios</h2>

      <div className="business-summary">
        <div className="summary-card">
          <div className="summary-label">Ingresos Totales</div>
          <div className="summary-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Gastos Totales</div>
          <div className="summary-value">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className={`summary-card ${totalProfit >= 0 ? 'profit' : 'loss'}`}>
          <div className="summary-label">Ganancia Neta</div>
          <div className="summary-value">{formatCurrency(totalProfit)}</div>
        </div>
        {totalIncome > 0 && (
          <div className="summary-card">
            <div className="summary-label">Margen de Ganancia</div>
            <div className="summary-value">{((totalProfit / totalIncome) * 100).toFixed(1)}%</div>
          </div>
        )}
      </div>

      <div className="business-grid">
        {allBusinesses.map(business => (
          <div
            key={business.name}
            className={`business-card ${!business.hasData ? 'empty' : business.profit >= 0 ? 'profitable' : 'loss'}`}
          >
            <h3>{business.name}</h3>

            {business.hasData ? (
              <>
                <div className="business-metrics">
                  <div className="metric">
                    <div className="metric-label">Ingresos</div>
                    <div className="metric-value income">{formatCurrency(business.income)}</div>
                  </div>

                  <div className="metric">
                    <div className="metric-label">Gastos</div>
                    <div className="metric-value expense">{formatCurrency(business.expenses)}</div>
                  </div>

                  <div className="metric">
                    <div className="metric-label">Ganancia</div>
                    <div className={`metric-value ${business.profit >= 0 ? 'profit' : 'loss'}`}>
                      {formatCurrency(business.profit)}
                    </div>
                  </div>
                </div>

                <div className="profit-bar">
                  <div
                    className="profit-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, (business.profit / business.income) * 100))}%`,
                      backgroundColor: business.profit >= 0 ? 'var(--success)' : 'var(--danger)'
                    }}
                  />
                </div>

                <div className="profit-margin">
                  Margen: <strong>{business.profitMargin}%</strong>
                </div>

                {business.expenses > 0 && (
                  <div className="expense-ratio">
                    Gastos/Ingresos: {((business.expenses / business.income) * 100).toFixed(1)}%
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                Sin datos registrados
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="insights">
        <h3>💡 Insights</h3>
        <div className="insights-list">
          {allBusinesses.some(b => b.profit > 0) && (
            <div className="insight-item">
              <strong>Mejor negocio:</strong> {allBusinesses.find(b => b.profit > 0)?.name} con {formatCurrency(allBusinesses.find(b => b.profit > 0)?.profit)}
            </div>
          )}

          {allBusinesses.some(b => b.hasData && b.expenses > 0) && (
            <div className="insight-item">
              <strong>Mayor inversión en gastos:</strong> {allBusinesses.filter(b => b.hasData && b.expenses > 0).sort((a, b) => b.expenses - a.expenses)[0]?.name}
            </div>
          )}

          {totalProfit < 0 && (
            <div className="insight-item warning">
              ⚠️ Estás gastando más de lo que ganas. Considera reducir gastos o aumentar ingresos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
