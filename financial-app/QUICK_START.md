# ⚡ Inicio Rápido - Mi Finanzas

## 🚀 Opción 1: Inicio Automático (Recomendado)

### En tu computadora:

1. Abre Terminal/Cmd
2. Navega a la carpeta `financial-app`
3. Copia y pega esto:

```bash
npm install concurrently && cd server && npm install && cd ../client && npm install && cd .. && npm run dev
```

Esto instalará todo automáticamente y abrirá:
- **Servidor**: http://localhost:5000
- **App**: http://localhost:5173

## 🚀 Opción 2: Inicio Manual

### Terminal 1 - Servidor:
```bash
cd server
npm install
npm run dev
```

Deberías ver: `Server running on http://localhost:5000`

### Terminal 2 - Cliente (abre nueva terminal):
```bash
cd client
npm install
npm run dev
```

Deberías ver algo como: `Local: http://localhost:5173`

## 📱 Usar en iPhone

### Como App Nativa:
1. Abre Safari
2. Ve a: **http://localhost:5173**
3. Toca el ícono Compartir (arriba a la derecha)
4. Toca **Añadir a pantalla de inicio**
5. Ponle nombre: **Mi Finanzas**
6. Toca **Añadir**

¡Ya tendrás la app instalada como nativa!

### Desde otra red (si quieres acceder desde otro dispositivo):
1. Encuentra tu IP local (macOS/Linux: `ifconfig` | Windows: `ipconfig`)
2. En lugar de localhost, usa: `http://TU_IP:5173`

## 📊 Cargar Deudas de Veraz Automáticamente

Para cargar automáticamente tus deudas del informe de Veraz:

```bash
cd server
node seed-veraz.js
```

Esto cargará todas las deudas conocidas en la base de datos.

## 🔧 Troubleshooting

### "Port 5000/5173 is already in use"
- Cambia los puertos en:
  - `server/index.js` línea 8: cambia `5000` a otro número
  - `client/vite.config.js`: cambia proxy a nuevo puerto

### "npm not found"
- Instala Node.js desde: https://nodejs.org/

### "No connection to server"
- Verifica que el servidor está corriendo (`npm run dev` en carpeta server)
- En el navegador, abre `http://localhost:5000/api/debts` para probar

### "Base de datos vacía"
- Ejecuta: `cd server && node seed-veraz.js`

## 💡 Próximos Pasos

1. **Agregar deudas**: Ve a "Deudas" y registra las que falten
2. **Registrar ingresos**: Ve a "Ingresos/Gastos" y empieza a registrar
3. **Ver análisis**: Ve a "Negocios" para ver ganancia/pérdida por negocio

## 📞 Soporte Rápido

Si algo no funciona:
1. ¿Tienes Node.js? → `node --version`
2. ¿Están los puertos libres? → Los mensajes de error te lo dirán
3. ¿Está el servidor corriendo? → Verifica la Terminal 1
4. ¿Está conectado el cliente? → Abre http://localhost:5000 en navegador

¡Listo! Ahora tienes control total de tus finanzas. 💰
