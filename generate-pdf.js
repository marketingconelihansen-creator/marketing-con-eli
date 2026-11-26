const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 40 });
const filename = path.join(__dirname, 'docs', 'Primer_Latido_Guia_de_Uso.pdf');

doc.pipe(fs.createWriteStream(filename));

// Header
doc.fontSize(28).fillColor('#E8A5C4').text('❤️ Primer Latido', { align: 'center' });
doc.fontSize(14).fillColor('#999').text('Tu compañero en el embarazo', { align: 'center' });
doc.text('Guía Completa de Uso', { align: 'center' });
doc.moveDown(1);
doc.fillColor('#333');

// Contenido
const sections = [
  { title: '📲 CÓMO DESCARGAR E INSTALAR', content: `
1. Abre el navegador de tu celular (Chrome en Android, Safari en iPhone)

2. Entra a este link:
   https://marketingconelihansen-creator.github.io/marketing-con-eli/docs/app.html

3. Instala la app:
   • ANDROID (Chrome): Toca el menú (⋮) arriba → "Instalar aplicación"
   • IPHONE (Safari): Tapa Compartir → "Agregar a pantalla de inicio"

4. ¡Listo! La app aparecerá como ícono en tu pantalla de inicio

VENTAJAS:
✓ Se abre como una app nativa (sin barra de navegador)
✓ Funciona offline (sin conexión a internet)
✓ Rápida y sin publicidades
✓ Acceso desde tu pantalla de inicio
  ` },

  { title: '❤️ PANTALLA DE INICIO', content: `
Es la primera pantalla que ves al abrir la app. Aquí encuentras:

• Tu semana actual: Desliza para seleccionar en qué semana estás
• Tamaño del bebé: Comparación visual (como una fruta)
• Desarrollo: Qué ocurre en el desarrollo del bebé
• Cambios en ti: Cómo se modifica tu cuerpo
• Síntomas: Síntomas normales a esperar
• Días restantes: Cuántos días faltan para la fecha estimada
  ` },

  { title: '📅 INFORMACIÓN DE LAS 40 SEMANAS', content: `
En la pestaña "SEMANAS" puedes explorar cualquiera de las 40 semanas.

INFORMACIÓN POR SEMANA:
✓ Tamaño del bebé (medidas y comparación)
✓ Desarrollo (hitos importantes)
✓ Cambios en ti (cómo tu cuerpo se adapta)
✓ Síntomas normales
✓ Consejos específicos

Desliza el slider para moverte entre semanas.
  ` },

  { title: '📚 PDFs DESCARGABLES', content: `
En la pestaña "PDFs" encontrarás 20 guías en formato PDF.

CATEGORÍAS:
• Inicio del embarazo
• Salud médica
• Bienestar
• Parto
• Posparto
• Otros (derechos, comunidad, recursos)
  ` },

  { title: '🔔 RECORDATORIOS PERSONALIZADOS', content: `
En la pestaña "RECORDATORIOS" activa/desactiva 13 recordatorios:

Tomar agua • Ejercicio • Vitaminas • Descanso • Control médico
Almuerzo saludable • Meditación • Hidratación • Hierro • Ácido fólico
Calcio • Descanso nocturno • Revisión prenatal

Toca el botón redondo al lado de cada recordatorio para activar/desactivar.
Verde = activado | Gris = desactivado
  ` },

  { title: '⚙️ MI PERFIL', content: `
En la última pestaña "PERFIL" encuentras:

✓ Nombre de la app: Primer Latido
✓ Versión: 1.0
✓ Idioma actual: Español o Inglés
✓ Características: Resumen de lo que incluye la app
  ` },

  { title: '🌍 CAMBIAR IDIOMA', content: `
En la esquina superior derecha verás el botón "EN/ES".

Tócalo para cambiar entre español e inglés.
Toda la información se traduce automáticamente.
  ` },

  { title: '❓ PREGUNTAS FRECUENTES', content: `
P: ¿Necesito conexión a internet?
R: No. La app funciona completamente offline.

P: ¿Dónde se guardan mis datos?
R: En tu celular. Son privados y no se comparten.

P: ¿Puedo usar la app en dos celulares?
R: Sí, pero los datos se guardan por separado en cada uno.

P: ¿Cuánto espacio ocupa?
R: Menos de 1MB.

P: ¿Hay más funciones próximamente?
R: Sí. Galería, diario de síntomas, historial médico, sincronización en la nube.
  ` }
];

sections.forEach(section => {
  doc.fontSize(14).fillColor('#E8A5C4').text(section.title, { underline: true });
  doc.fontSize(10).fillColor('#333').text(section.content.trim());
  doc.moveDown(0.8);
});

// Footer
doc.moveDown(1);
doc.fontSize(10).fillColor('#999').text('Primer Latido v1.0 - Hecho con ❤️ para las mamás embarazadas', { align: 'center' });

doc.end();
console.log('✅ PDF creado exitosamente!');
