import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { config } from '../config.js';

const FONT_CANDIDATES = {
    regular: [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/Library/Fonts/Arial Unicode.ttf',
    ],
    bold: [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    ],
};

function pickFont(candidates) {
    return candidates.find(p => fs.existsSync(p)) || null;
}

export function generateCertificatePdf({ username, score, issuedAt }) {
    if (!fs.existsSync(config.certDir)) {
        fs.mkdirSync(config.certDir, { recursive: true });
    }

    const safeName = username.replace(/[^a-zA-Zа-яА-Я0-9_-]+/g, '_');
    const fileName = `certificate_${safeName}_${Date.now()}.pdf`;
    const filePath = path.join(config.certDir, fileName);

    const regularPath = pickFont(FONT_CANDIDATES.regular);
    const boldPath = pickFont(FONT_CANDIDATES.bold) || regularPath;

    if (!regularPath) throw new Error('Не найден шрифт с поддержкой кириллицы');

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    doc.registerFont('Body', regularPath);
    doc.registerFont('Body-Bold', boldPath);
    doc.pipe(fs.createWriteStream(filePath));

    const w = doc.page.width;
    const h = doc.page.height;

    // === КОСМИЧЕСКИЙ ФОН С ГРАДИЕНТОМ ===
    const grad = doc.linearGradient(0, 0, 0, h);
    grad.stop(0, '#0a1129');           // тёмно-синий
    grad.stop(0.6, '#1a0f3d');         // глубокий фиолетовый
    grad.stop(1, '#2a1b4d');           // ближе к RGB 106,13,173

    doc.rect(0, 0, w, h).fill(grad);

    // === ЗВЁЗДЫ ===
    doc.fillColor('#e0f2fe').opacity(0.9);
    const stars = [
        [80, 80], [150, 120], [300, 70], [450, 150], [620, 90],
        [750, 200], [900, 80], [1050, 160], [1200, 110], [100, 280],
        [200, 350], [400, 280], [700, 320], [850, 250], [1100, 300]
    ];

    stars.forEach(([x, y]) => {
        doc.circle(x, y, 2.5).fill();
        doc.circle(x + 25, y - 18, 1.5).fill();
    });

    // === РАМКА ===
    doc.lineWidth(14).strokeColor('#a5f3fc').rect(35, 35, w - 70, h - 70).stroke();
    doc.lineWidth(5).strokeColor('#67e8f9').rect(55, 55, w - 110, h - 110).stroke();

    // === ТЕКСТ ===
    doc.fillColor('#e0f2fe').font('Body-Bold').fontSize(48)
        .text('СЕРТИФИКАТ', 0, 95, { align: 'center', width: w });

    doc.fillColor('#a5f3fc').font('Body').fontSize(20)
        .text('о прохождении образовательного веб-квеста', 0, 155, { align: 'center', width: w });

    // Имя
    doc.fillColor('#fef08c').font('Body-Bold').fontSize(36)
        .text(username.toUpperCase(), 0, 225, { align: 'center', width: w });

    doc.fillColor('#e0f2fe').font('Body').fontSize(18)
        .text('успешно завершил(а) путешествие по', 0, 295, { align: 'center', width: w });

    doc.fillColor('#c4b5fd').font('Body-Bold').fontSize(26)
        .text('«ИЗМЕРЕНИЕ JAVASCRIPT»', 0, 330, { align: 'center', width: w });

    doc.fillColor('#e0f2fe').font('Body').fontSize(16)
        .text(`пройдя все 9 планет и набрав ${score} звёзд`, 0, 375, { align: 'center', width: w });

    // Дата
    const dateStr = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(issuedAt));

    doc.fillColor('#94a3b8').font('Body').fontSize(14)
        .text(`Дата выдачи: ${dateStr}`, 0, 460, { align: 'center', width: w });

    // Подвал
    doc.fillColor('#64748b').font('Body').fontSize(12)
        .text('JS-Квест · Измерение JavaScript', 0, h - 70, { align: 'center', width: w });

    doc.end();

    return { filePath, fileName };
}