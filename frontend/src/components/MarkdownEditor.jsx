import { useRef, useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import Markdown from './Markdown.jsx';

const TOOLS = [
  { label: 'H1',     title: 'Заголовок 1',    wrap: null,       line: '# ' },
  { label: 'H2',     title: 'Заголовок 2',    wrap: null,       line: '## ' },
  { label: 'H3',     title: 'Заголовок 3',    wrap: null,       line: '### ' },
  { label: 'B',      title: 'Жирный',         wrap: ['**','**'] },
  { label: 'I',      title: 'Курсив',         wrap: ['*','*'] },
  { label: '`</>`',  title: 'Код инлайн',     wrap: ['`','`'] },
  { label: '```',    title: 'Блок кода',      block: '```js\n', blockEnd: '\n```' },
  { label: '•',      title: 'Маркированный список', line: '- ' },
  { label: '1.',     title: 'Нумерованный список', line: '1. ' },
  { label: '🔗',     title: 'Ссылка',         wrap: ['[', '](https://)'] },
  { label: '⎯',      title: 'Горизонтальная линия', line: '\n---\n' },
  { label: '|',      title: 'Таблица (шаблон)', block: '| Заголовок | Заголовок |\n|---|---|\n| ячейка | ячейка |\n' },
];

/**
 * Разделённый MD-редактор: слева CodeMirror с подсветкой markdown,
 * справа живой предпросмотр через наш рендерер. Сверху — тулбар вставки.
 */
export default function MarkdownEditor({ value, onChange, height = 320 }) {
  const viewRef = useRef(null);
  const [tab, setTab] = useState('split'); // 'edit' | 'split' | 'preview'

  const applyTool = useCallback((tool) => {
    const view = viewRef.current?.view;
    if (!view) return;
    const { state } = view;
    const sel = state.selection.main;
    const selected = state.sliceDoc(sel.from, sel.to);

    let insert = '';
    let cursor = null;
    if (tool.wrap) {
      insert = `${tool.wrap[0]}${selected || 'текст'}${tool.wrap[1]}`;
      cursor = sel.from + tool.wrap[0].length + (selected || 'текст').length + tool.wrap[1].length;
    } else if (tool.line) {
      // Вставляем префикс в начало каждой выделенной строки
      const startLine = state.doc.lineAt(sel.from);
      const endLine = state.doc.lineAt(sel.to);
      let result = '';
      for (let n = startLine.number; n <= endLine.number; n++) {
        const l = state.doc.line(n);
        result += tool.line + l.text + (n < endLine.number ? '\n' : '');
      }
      view.dispatch({
        changes: { from: startLine.from, to: endLine.to, insert: result },
        selection: { anchor: startLine.from + result.length },
      });
      view.focus();
      return;
    } else if (tool.block) {
      insert = `${tool.block}${selected}${tool.blockEnd || ''}`;
      cursor = sel.from + tool.block.length + selected.length;
    }

    view.dispatch({
      changes: { from: sel.from, to: sel.to, insert },
      selection: cursor != null ? { anchor: cursor } : undefined,
    });
    view.focus();
  }, []);

  return (
    <div className="md-editor">
      <div className="md-toolbar">
        {TOOLS.map(t => (
          <button key={t.label} type="button" className="md-btn" title={t.title}
                  onClick={() => applyTool(t)}>
            {t.label}
          </button>
        ))}
        <div className="md-tabs">
          <button type="button" className={`md-tab ${tab === 'edit' ? 'active' : ''}`} onClick={() => setTab('edit')}>Редактор</button>
          <button type="button" className={`md-tab ${tab === 'split' ? 'active' : ''}`} onClick={() => setTab('split')}>Оба</button>
          <button type="button" className={`md-tab ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>Предпросмотр</button>
        </div>
      </div>
      <div className={`md-body md-${tab}`}>
        {tab !== 'preview' && (
          <div className="md-edit-pane">
            <CodeMirror
              ref={viewRef}
              value={value || ''}
              height={`${height}px`}
              extensions={[markdown()]}
              onChange={onChange}
              basicSetup={{ lineNumbers: false, foldGutter: false, highlightActiveLine: false }}
            />
          </div>
        )}
        {tab !== 'edit' && (
          <div className="md-preview-pane" style={{ maxHeight: height, overflowY: 'auto' }}>
            <Markdown text={value || '*Пусто*'} className="theory md-preview-content" />
          </div>
        )}
      </div>
    </div>
  );
}