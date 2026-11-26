# 🎯 Primer Latido - Roadmap Completo

## ✅ ¿QUÉ YA ESTÁ HECHO?

```
✅ Estructura base React Native/Expo
✅ 5 pantallas iniciales (Home, Week, PDFs, Reminders, Profile)
✅ 40 semanas de contenido (tamaño bebé, desarrollo, cambios)
✅ Multiidioma (ES/EN)
✅ Contextos (Language, App, User)
✅ Colores pastel del logo
✅ GalleryScreen (captura fotos del embarazo)
✅ Consejos de bienestar semanales
✅ Medicamentos comunes
✅ Gestión de síntomas
✅ Firebase integrado en package.json
```

---

## 🔨 ¿QUÉ FALTA? (Prioridad)

### **FASE 1: Pantallas Críticas (40%)**

#### 1. **MedicalHistoryScreen** ⭐⭐⭐
- Registrar visitas al doctor
- Fecha, doctor, notas
- Peso, presión arterial
- Próxima cita
- Historial completo

**Archivo:** `mobile/src/screens/MedicalHistoryScreen.js`

#### 2. **ImprovedProfileScreen** ⭐⭐⭐
- Datos del usuario:
  - Nombre, edad, email
  - Fecha de entrada al embarazo
  - Semana actual
  - Próxima cita médica
  - Foto de perfil
- Preferencias:
  - Idioma
  - Notificaciones
  - Modo oscuro

**Archivo:** `mobile/src/screens/ImprovedProfileScreen.js`

#### 3. **SymptomDiaryScreen** ⭐⭐⭐
- Escribir cómo se siente
- Síntomas del día
- Severidad (1-5)
- Acciones tomadas
- Historial de síntomas

**Archivo:** `mobile/src/screens/SymptomDiaryScreen.js`

---

### **FASE 2: Mejoras a Pantallas Existentes (30%)**

#### 4. **HomeScreen Mejorado**
Agregar a la semana actual:
- 🖼️ Imagen del bebé (emoji + fruta)
- 📖 Consejos de bienestar
- 💊 Medicamentos para esta semana
- 📄 PDFs recomendados
- 🏥 Control médico próximo

#### 5. **WeekScreen Expandido**
- Imágenes del bebé (emoji + fruta + dibujo)
- Consejos completos (náuseas, fatiga, etc.)
- Medicamentos para esta semana
- PDFs recomendados
- Tips específicos

#### 6. **RemindersScreen Avanzado**
- Agregar medicamentos personalizados
- Hierro, vitaminas, etc.
- Horarios de toma
- Recordatorios automáticos

---

### **FASE 3: Features Avanzadas (20%)**

#### 7. **Sistema de PDF Export**
- Generar PDF con:
  - Perfil del usuario
  - Fotos de cada semana
  - Notas del diario
  - Citas médicas
  - Todo lo que ella escribió
- Descargar/Imprimir

**Archivo:** `mobile/src/utils/pdfGenerator.js`

#### 8. **Firebase Integration** ⭐
- Autenticación (crear cuenta)
- Almacenar fotos en Storage
- Sincronizar datos en Firestore
- Backup automático

**Archivos:** 
- `mobile/src/services/firebaseConfig.js`
- `mobile/src/services/authService.js`
- `mobile/src/services/storageService.js`

#### 9. **Notificaciones Push** ⭐⭐
- Recordatorios diarios
- Próxima cita médica
- Medicamentos
- Hidratación (cada 2 horas)
- Personalizado (lo que ella agregue)

**Archivo:** `mobile/src/services/notificationService.js`

---

### **FASE 4: Polish & UX (10%)**

#### 10. **Mejoras UI/UX**
- Animaciones suaves
- Transiciones profesionales
- Loading states
- Error handling
- Empty states

#### 11. **Modo Oscuro Completo**
- Aplicar a todas las screens
- Perfeccionar contraste

#### 12. **Accesibilidad**
- Font sizes escalables
- Color contrast
- Touch targets

---

## 📊 DATOS A COMPLETAR

### 1. **Imágenes del bebé**
Por cada semana necesitamos:
```json
{
  "week": 5,
  "babyImage": "🫐",  // emoji
  "fruit": "Blueberry",
  "babyDrawing": "url_or_svg"  // Dibujo del bebé
}
```

**Estado:** Falta crear JSON con 40 imágenes

---

### 2. **Consejos de Bienestar Expandido**
Completar `wellness-advice.json` para:
- Semanas 6-40 (tenemos 1-5)
- Inglés (tenemos solo español)
- Más tips por categoría

**Estado:** 10% completo, necesita 90% más

---

### 3. **Recomendaciones PDF por Síntoma**
Mapear:
```json
{
  "symptom": "nausea",
  "recommendedPDFs": [4, 5, 6],  // IDs de PDFs
  "tips": ["...", "..."]
}
```

**Estado:** Parcial en wellness-advice.json

---

## 📱 NUEVA ESTRUCTURA DE SCREENS

```
App Navigation (5 tabs)
├── Home (Mejorado) ✅
├── Mi Semana (Mejorado) 🔄
├── Recursos (PDF) ✅
├── Recordatorios (Avanzado) 🔄
├── Perfil (Nuevo) 🔨
│
Stacks secundarios (desde cada screen)
├── MedicalHistory 🔨
├── SymptomDiary 🔨
├── Gallery (Nuevo) ✅
└── PDFExport 🔨
```

---

## 🔧 CONFIGURACIÓN FIREBASE

### Setup en Firebase Console:
1. Crear proyecto `primer-latido-app`
2. Habilitar:
   - Authentication (Google/Email)
   - Firestore Database
   - Storage
3. Descargar config y crear:
   - `mobile/src/services/firebaseConfig.js`

### Estructura Firestore:
```
users/
  {userId}/
    - profile
    - medicalHistory/
    - gallery/
    - symptoms/
    - medications/
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Semana 1:
- [ ] MedicalHistoryScreen
- [ ] ImprovedProfileScreen
- [ ] SymptomDiaryScreen
- [ ] Completar wellness-advice.json (semanas 6-40, ES/EN)

### Semana 2:
- [ ] Firebase config
- [ ] AuthService
- [ ] StorageService
- [ ] Mejorar HomeScreen y WeekScreen

### Semana 3:
- [ ] PDF Export generator
- [ ] Notificaciones push
- [ ] Integración fotos con Firebase

### Semana 4:
- [ ] Testing completo
- [ ] Polish UI/UX
- [ ] Dark mode refinado
- [ ] Preparar para publicación

---

## 💾 DATOS QUE YA TENEMOS

✅ `/backend/src/data/weeks.json` - 40 semanas
✅ `/backend/src/data/reminders.json` - 13 recordatorios
✅ `/backend/src/data/pdfs-mapping.json` - 20 PDFs
✅ `/backend/src/data/wellness-advice.json` - Consejos (parcial)
✅ `/mobile/src/data/theme.json` - Colores
✅ `/mobile/src/data/translations.json` - Idiomas

---

## 🎯 TIMELINE ESTIMADO

| Fase | Duración | Estado |
|------|----------|--------|
| Fase 1 | 1 semana | 🔄 En progreso |
| Fase 2 | 1 semana | ⏳ Próxima |
| Fase 3 | 1 semana | ⏳ Próxima |
| Fase 4 | 3-4 días | ⏳ Próxima |
| **TOTAL** | **~4 semanas** | 🚀 |

---

## 🎁 RESULTADO FINAL

Una app **ÉPICA** con:
- ✅ Perfil de usuario completo
- ✅ 40 semanas con consejos personalizados
- ✅ Galería de fotos del embarazo
- ✅ Diario de síntomas
- ✅ Historial médico
- ✅ Medicamentos personalizados
- ✅ Notificaciones inteligentes
- ✅ Descarga PDF con toda tu información
- ✅ Multiidioma (ES/EN)
- ✅ Diseño bonito + Dark Mode
- ✅ Firebase (backup automático)

**Precio:** $9.99 USD (Pago único)
**Target:** Mamás embarazadas
**Lanzamiento:** 4 semanas

---

## 🚀 ¿EMPEZAMOS CON LA FASE 1?

¿Cuál prefieres primero?
1. MedicalHistoryScreen
2. ImprovedProfileScreen
3. SymptomDiaryScreen

O ¿completar los datos primero?
