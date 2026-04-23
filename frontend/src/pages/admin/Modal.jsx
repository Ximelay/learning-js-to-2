export default function Modal({ title, onClose, children, onSave, saveLabel = 'Сохранить', busy }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        {children}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Отмена</button>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} disabled={busy}>
              {busy ? '...' : saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}