# 💰 Mi Finanzas - Control Total

Una aplicación completa para gestionar tus finanzas personales y de tus negocios. Perfecto para iPhone, tablet y escritorio.

## 🎯 Características

- 📊 **Dashboard Ejecutivo** - Resumen completo de tu situación financiera
- 💳 **Gestión de Deudas** - Registra, monitorea y paga tus deudas
- 💰 **Control de Ingresos/Gastos** - Registra cada transacción
- 🏢 **Panel por Negocio** - Analiza ganancia/pérdida de cada negocio
- 📱 **Responsive** - Funciona perfecto en móvil, tablet y desktop
- 🔔 **Alertas de Pagos** - Notificaciones de deudas vencidas y próximas

## 🚀 Instalación Rápida

### Requisitos
- Node.js 16+ instalado
- npm o yarn

### Paso 1: Instalar dependencias

```bash
# Instalar dependencias del servidor
cd server
npm install

# En otra terminal, instalar dependencias del cliente
cd ../client
npm install
```

### Paso 2: Ejecutar la aplicación

```bash
# Terminal 1: Iniciar servidor (desde carpeta /server)
npm run dev

# Terminal 2: Iniciar cliente (desde carpeta /client)
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📱 Instalar como App en iPhone

1. Abre la app en Safari en tu iPhone
2. Toca el ícono "Compartir"
3. Toca "Añadir a la pantalla de inicio"
4. Dale un nombre y toca "Añadir"

¡Ahora tendrás una app instalada como nativa!

## 💾 Estructura de la Base de Datos

La app usa SQLite automáticamente:

```
financial.db (se crea automáticamente)
├── debts (deudas)
├── income (ingresos)
├── expenses (gastos)
├── payments (pagos registrados)
└── notifications (notificaciones)
```

## 🎨 Funcionalidades Principales

### Panel de Control
- Deudas totales pendientes
- Ingresos totales
- Gastos totales
- Balance neto
- Alertas de pagos atrasados
- Próximos pagos

### Gestión de Deudas
- Crear nuevas deudas manualmente
- Registrar fuente (Veraz, personal, familiar)
- Categorizar deudas
- Ver deudas ordenadas por fecha de vencimiento
- Marcar como pagadas

### Ingresos y Gastos
- Registrar ingresos por negocio
- Registrar gastos por negocio
- Categorizar transacciones
- Ver histórico completo
- Totales por período

### Panel de Negocios
- **ODC** - Tu infoproducto principal
- **Ebooks Diabetes** - Venta de ebooks
- **Cursos Marketing** - Cursos de marketing de afiliado
- **Agencia Viajes** - Agencia de viajes

Cada negocio muestra:
- Ingresos totales
- Gastos en publicidad
- Ganancia neta
- Margen de ganancia
- Ratio gasto/ingreso

## 🔧 Configuración Personalizada

Edita `server/index.js` para personalizar:
- Puerto del servidor (línea 8)
- Categorías de deudas
- Nombres de negocios

## 📊 Próximas Mejoras

- [ ] Exportar datos a CSV/Excel
- [ ] Gráficos de tendencias
- [ ] Presupuestos y proyecciones
- [ ] Sincronización con múltiples dispositivos
- [ ] App de escritorio
- [ ] Análisis predictivo

## 🤝 Soporte

Para problemas o preguntas:
1. Verifica que Node.js esté instalado (`node --version`)
2. Asegúrate que los puertos 5000 y 5173 estén disponibles
3. Limpia las dependencias y reinstala: `rm -rf node_modules package-lock.json && npm install`

## 📄 Licencia

Creado para tu éxito financiero. © 2024
