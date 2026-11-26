const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// PDF EN ESPAÑOL
function crearPDFEspanol() {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const filename = path.join(__dirname, 'docs', 'Primer_Latido_Instructivo_ES.pdf');
  
  doc.pipe(fs.createWriteStream(filename));
  
  doc.fontSize(24).fillColor('#E8A5C4').text('PRIMER LATIDO', { align: 'center' });
  doc.fontSize(16).fillColor('#999').text('Instructivo de instalación y uso', { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('📱 INSTALACIÓN EN ANDROID');
  doc.fontSize(11).fillColor('#333');
  doc.text('1. Abre Chrome en tu celular\n2. Entra a: https://marketingconelihansen-creator.github.io/marketing-con-eli/docs/app.html\n3. Toca el menú (⋮) arriba a la derecha\n4. Selecciona "Instalar aplicación"\n5. Confirma\n6. ¡Listo! Aparecerá en tu pantalla de inicio', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('🍎 INSTALACIÓN EN IPHONE');
  doc.fontSize(11).fillColor('#333');
  doc.text('1. Abre Safari en tu iPhone\n2. Entra a: https://marketingconelihansen-creator.github.io/marketing-con-eli/docs/app.html\n3. Toca Compartir (flecha hacia arriba)\n4. Selecciona "Agregar a pantalla de inicio"\n5. Nómbrala "Primer Latido"\n6. Toca Agregar\n7. ¡Listo! Aparecerá como app en tu pantalla', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('❤️ CARACTERÍSTICAS DE LA APP');
  doc.fontSize(11).fillColor('#333');
  doc.text('✓ 40 semanas de información del bebé\n✓ Tamaño del bebé comparado con frutas\n✓ Desarrollo semana a semana\n✓ Cambios en tu cuerpo\n✓ Síntomas normales\n✓ 20 PDFs descargables\n✓ 13 recordatorios personalizables\n✓ Cambiar entre español e inglés\n✓ Funciona sin internet (offline)\n✓ Rápida y sin publicidades', { lineGap: 6 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('🌍 CAMBIAR IDIOMA');
  doc.fontSize(11).fillColor('#333');
  doc.text('Toca el botón "EN/ES" en la esquina superior derecha para cambiar entre español e inglés.', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(10).fillColor('#999');
  doc.text('Primer Latido v1.0 - Hecho para las mamás embarazadas', { align: 'center' });
  
  doc.end();
}

// PDF EN INGLÉS
function crearPDFIngles() {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const filename = path.join(__dirname, 'docs', 'Primer_Latido_Instructivo_EN.pdf');
  
  doc.pipe(fs.createWriteStream(filename));
  
  doc.fontSize(24).fillColor('#E8A5C4').text('PRIMER LATIDO', { align: 'center' });
  doc.fontSize(16).fillColor('#999').text('Installation & Usage Guide', { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('📱 INSTALLATION ON ANDROID');
  doc.fontSize(11).fillColor('#333');
  doc.text('1. Open Chrome on your phone\n2. Go to: https://marketingconelihansen-creator.github.io/marketing-con-eli/docs/app.html\n3. Tap the menu (⋮) in the top right\n4. Select "Install app"\n5. Confirm\n6. Done! It will appear on your home screen', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('🍎 INSTALLATION ON IPHONE');
  doc.fontSize(11).fillColor('#333');
  doc.text('1. Open Safari on your iPhone\n2. Go to: https://marketingconelihansen-creator.github.io/marketing-con-eli/docs/app.html\n3. Tap Share (up arrow)\n4. Select "Add to Home Screen"\n5. Name it "Primer Latido"\n6. Tap Add\n7. Done! It will appear as an app on your screen', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('❤️ APP FEATURES');
  doc.fontSize(11).fillColor('#333');
  doc.text('✓ 40 weeks of baby development info\n✓ Baby size compared to fruits\n✓ Week-by-week development\n✓ Changes in your body\n✓ Normal symptoms\n✓ 20 downloadable PDFs\n✓ 13 customizable reminders\n✓ Switch between Spanish and English\n✓ Works without internet (offline)\n✓ Fast and ad-free', { lineGap: 6 });
  doc.moveDown(2);
  
  doc.fontSize(14).fillColor('#D48BB0').text('🌍 CHANGE LANGUAGE');
  doc.fontSize(11).fillColor('#333');
  doc.text('Tap the "EN/ES" button in the top right corner to switch between Spanish and English.', { lineGap: 8 });
  doc.moveDown(2);
  
  doc.fontSize(10).fillColor('#999');
  doc.text('Primer Latido v1.0 - Made for pregnant women', { align: 'center' });
  
  doc.end();
}

crearPDFEspanol();
crearPDFIngles();
console.log('✅ PDFs creados');
