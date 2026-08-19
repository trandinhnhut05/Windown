import { AlertTriangle, X } from 'lucide-react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  title, message, confirmLabel = 'Xác nhận', variant = 'primary', loading, onConfirm, onCancel,
}: Props) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: variant === 'danger' ? '#fef2f2' : 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)',
              flexShrink: 0,
            }}>
              <AlertTriangle size={20} />
            </div>
            <h2 className="modal-title" style={{ fontSize: 16 }}>{title}</h2>
          </div>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onCancel}>
            <X size={14} />
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
