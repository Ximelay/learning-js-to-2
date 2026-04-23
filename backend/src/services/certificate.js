import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { config } from '../config.js';

/**
 * Генерирует PDF-сертификат на имя пользователя и сохраняет его в config.certDir.
 * Возвращает { filePath, fileName }.
 */
export function generateCertificatePdf({ username, score, issuedAt }) {
  if (!fs.existsSync(config.certDir)) fs.mkdirSync(config.certDir, { recursive: true });

  const safeName = username.replace(/[^a-zA-Zа-яА-Я0-9_-]+/g, '_');
  const fileName = `certificate_${safeName}_${Date.now()}.pdf`;
  const filePath = path.join(config.certDir, fileName);

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  // Рамка
  const w = doc.page.width;
  const h = doc.page.height;
  doc.lineWidth(3).strokeColor('#6d4c41').rect(20, 20, w - 40, h - 40).stroke();
  doc.lineWidth(1).strokeColor('#a1887f').rect(32, 32, w - 64, h - 64).stroke();

  doc.fillColor('#3e2723').font('Helvetica-Bold').fontSize(40)
    .text('СЕРТИФИКАТ', 0, 90, { align: 'center', width: w });
  doc.font('Helvetica').fontSize(18)
    .text('о прохождении образовательного курса', 0, 150, { align: 'center', width: w });

  doc.moveDown(2);
  doc.fontSize(22).font('Helvetica').text('Настоящим подтверждается, что', 0, 220, { align: 'center', width: w });

  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(34).fillColor('#1b5e20')
    .text(username, 0, 270, { align: 'center', width: w });

  doc.moveDown(1);
  doc.font('Helvetica').fontSize(18).fillColor('#3e2723').text(
    'успешно завершил(а) учебный веб-квест',
    0, 340, { align: 'center', width: w }
  );
  doc.font('Helvetica-Bold').fontSize(22)
    .text('«Острова JavaScript»', 0, 365, { align: 'center', width: w });

  doc.moveDown(1.5);
  doc.font('Helvetica').fontSize(14)
    .text(`пройдя все 9 островов и набрав ${score} баллов.`, 0, 420, { align: 'center', width: w });

  doc.font('Helvetica').fontSize(12).fillColor('#6d4c41')
    .text(`Дата выдачи: ${new Intl.DateTimeFormat('ru-RU').format(new Date(issuedAt))}`, 0, 500, { align: 'center', width: w });

  doc.font('Helvetica-Oblique').fontSize(10).fillColor('#8d6e63')
    .text('JS-Квест · образовательная платформа', 0, h - 70, { align: 'center', width: w });

  doc.end();

  return { filePath, fileName };
}