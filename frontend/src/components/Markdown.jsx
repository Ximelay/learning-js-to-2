// Мини-рендер Markdown без внешних зависимостей.
// Поддержка: заголовки #, списки -, inline `code`, блоки ```lang ... ```,
// **жирный**, таблицы в GFM.

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderInline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderMarkdown(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (line.startsWith('```')) {
      const end = lines.indexOf('```', i + 1);
      const body = lines.slice(i + 1, end === -1 ? lines.length : end).join('\n');
      out.push(`<pre><code>${escapeHtml(body)}</code></pre>`);
      i = end === -1 ? lines.length : end + 1;
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${renderInline(h[2])}</h${h[1].length}>`); i++; continue; }

    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(`<li>${renderInline(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\|.*\|$/.test(line) && /^\|[-: |]+\|$/.test(lines[i + 1] || '')) {
      const headers = line.split('|').slice(1, -1).map(s => `<th>${renderInline(s.trim())}</th>`).join('');
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i])) {
        const cells = lines[i].split('|').slice(1, -1).map(s => `<td>${renderInline(s.trim())}</td>`).join('');
        rows.push(`<tr>${cells}</tr>`);
        i++;
      }
      out.push(`<table><thead><tr>${headers}</tr></thead><tbody>${rows.join('')}</tbody></table>`);
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    out.push(`<p>${renderInline(line)}</p>`);
    i++;
  }
  return out.join('\n');
}

export default function Markdown({ text = '', className = 'theory' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />;
}