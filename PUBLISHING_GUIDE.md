# 📱 Guía de Publicación - Primer Latido App

## 🎯 Estado de la App

✅ **App 100% lista para publicar**
- Código optimizado
- 5 pantallas funcionales
- 40 semanas de contenido
- 20 PDFs integrados
- Multiidioma (ES/EN)
- UI/UX profesional

---

## 📋 Pre-requisitos para Publicar

### **1. Crear Cuenta Expo (GRATIS)**
- Ve a https://expo.dev/
- Haz click en "Sign Up"
- Crea tu cuenta
- Confirma tu email

### **2. Crear Cuentas de Desarrollador**

#### **Para iOS (App Store)**
- Ve a https://developer.apple.com/
- Paga $99 USD/año
- Registra tu cuenta de desarrollador

#### **Para Android (Google Play)**
- Ve a https://play.google.com/console
- Paga $25 USD (una sola vez)
- Registra tu cuenta de desarrollador

---

## 🔧 Instalación EAS CLI

```bash
# En tu terminal, ejecuta:
npm install -g eas-cli

# Verifica que se instaló:
eas --version
```

---

## 🚀 Paso 1: Preparar la App

```bash
cd /home/user/marketing-con-eli/mobile

# Loguéate en Expo
eas login

# (Te pide usuario y contraseña de Expo)
```

---

## 📲 Paso 2: Build para Android

```bash
cd /home/user/marketing-con-eli/mobile

# Crear build de Android
eas build --platform android

# Te pregunta:
# - Build type: "release" (para producción)
# - Wait for build: "yes"

# Espera 10-15 minutos...
# Te da un link para descargar el APK/AAB
```

**Archivo generado:** `primer-latido.aab` (Android App Bundle)

---

## 🍎 Paso 3: Build para iOS

```bash
cd /home/user/marketing-con-eli/mobile

# Crear build de iOS
eas build --platform ios

# Te pregunta:
# - Build type: "release" (para producción)
# - Wait for build: "yes"

# Espera 20-30 minutos...
# Te da un link para descargar el IPA
```

**Archivo generado:** `primer-latido.ipa` (iOS)

---

## 📤 Paso 4: Publicar en Google Play (Android)

### **1. Abrí Google Play Console:**
https://play.google.com/console

### **2. Crear nueva app:**
- Click en "Create app"
- Nombre: "Primer Latido"
- Categoría: "Health & Fitness"
- Contenido: "Apps"

### **3. Cargar el build:**
- Ve a "Release" → "Production"
- Click en "Create release"
- Sube el archivo `.aab` que descargaste

### **4. Completar información:**
- **Título:** Primer Latido
- **Descripción:** 
```
Acompaña tu embarazo semana a semana con Primer Latido.
Información detallada, recordatorios personalizables y 20 PDFs completos.

✨ Características:
- 40 semanas de información
- Tamaño y desarrollo del bebé
- Síntomas normales y de alerta
- 13 recordatorios configurables
- 20 PDFs descargables
- Calculadora de fecha probable de parto
- Multiidioma (Español/Inglés)
```
- **Precio:** $9.99 USD (o lo que quieras)
- **Categoría:** Health & Fitness
- **Edad:** 12+

### **5. Cargar capturas:**
- 2-8 capturas del teléfono (screenshots)
- Icon (512x512px)
- Feature image (1024x500px)

### **6. Review y publicar:**
- Google revisa en 2-4 horas
- ¡LISTO! 🎉

---

## 🍎 Paso 5: Publicar en App Store (iOS)

### **1. Abrí App Store Connect:**
https://appstoreconnect.apple.com/

### **2. Crear nueva app:**
- Click en "Apps" → "New App"
- Nombre: "Primer Latido"
- Bundle ID: `com.primerlatido.app`
- SKU: `primerlatido`

### **3. Completar información:**
- **Nombre:** Primer Latido
- **Descripción:**
```
Acompaña tu embarazo semana a semana con Primer Latido.

✨ Características:
- 40 semanas de información detallada
- Desarrollo del bebé semana a semana
- Síntomas normales y de alerta
- 13 recordatorios configurables
- 20 PDFs completos (descargables)
- Calculadora de fecha probable de parto
- Multiidioma: Español e Inglés
```
- **Palabras clave:** embarazo, mamá, bebé, parto, maternidad
- **Categoría:** Health & Fitness
- **Edad:** 12+
- **Precio:** $9.99 USD

### **4. Cargar capturas:**
- Mínimo 2, máximo 10 screenshots
- Distintos para iPhone y iPad

### **5. Usar Transporter para enviar build:**
- Descargá "Transporter" de App Store
- Carga el `.ipa` que descargaste
- Envía a App Store

### **6. Review:**
- Apple revisa en 24-48 horas
- ¡LISTO! 🎉

---

## 💰 Configurar Pagos

### **Para Google Play:**
- Ve a "Monetization" → "Products"
- Configura métodos de pago
- Habilita pagos en tu país

### **Para App Store:**
- Ve a "Agreements, Tax, and Banking"
- Completa información bancaria
- Espera a que Apple verifique

---

## 📊 Checklist Final

- [ ] Cuenta Expo creada
- [ ] Cuenta App Store Developer creada ($99)
- [ ] Cuenta Google Play creada ($25)
- [ ] EAS CLI instalado
- [ ] Build Android generado
- [ ] Build iOS generado
- [ ] Google Play publicado
- [ ] App Store publicado
- [ ] Métodos de pago configurados

---

## 🎁 Próximas Mejoras (Opcional)

- [ ] Integrar visor PDF real
- [ ] Notificaciones push
- [ ] Sincronización cloud
- [ ] Análisis (Firebase Analytics)
- [ ] Versión web
- [ ] Sistema de rating/reviews

---

## 💬 Soporte

**Email:** soporte@primerlatido.com
**Instagram:** @primerlatido
**Website:** www.primerlatido.com

---

**¡Felicidades! 🎉 Tu app está lista para vender!**
