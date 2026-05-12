export default function Modal({ title, onClose, children, onSave, saveLabel = 'Сохранить', busy, width = 900 }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              background: 'transparent', border: 0, fontSize: 22, cursor: 'pointer', color: 'var(--muted)',
              lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>
        {children}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Закрыть</button>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} disabled={busy}>
              {busy ? 'Сохраняем...' : saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}