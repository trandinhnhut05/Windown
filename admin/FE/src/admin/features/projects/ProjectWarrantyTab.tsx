import { useEffect, useState } from 'react'
import { Plus, Check, Trash2, ShieldAlert, ShieldCheck, X } from 'lucide-react'
import dayjs from 'dayjs'
import { warrantyApi } from '@/shared/api/warrantyApi'
import type { Warranty } from '@/shared/api/warrantyApi'
import ConfirmModal from '@/shared/components/ConfirmModal'

interface Props {
  projectId: number
}

export default function ProjectWarrantyTab({ projectId }: Props) {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [warrantyDate, setWarrantyDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [issue, setIssue] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Warranty | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await warrantyApi.getByProject(projectId)
      setWarranties(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issue.trim()) return
    setSaving(true)
    try {
      await warrantyApi.create(projectId, {
        warrantyDate,
        issue,
        note,
        isResolved: false,
      })
      setIssue('')
      setNote('')
      setShowAddForm(false)
      loadData()
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra khi thêm nhật ký bảo hành!')
    } finally {
      setSaving(false)
    }
  }

  const handleResolve = async (w: Warranty) => {
    try {
      await warrantyApi.update(w.id!, {
        warrantyDate: w.warrantyDate,
        issue: w.issue,
        note: w.note || undefined,
        isResolved: true,
        resolvedAt: dayjs().format('YYYY-MM-DD'),
      })
      loadData()
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra!')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await warrantyApi.delete(deleteTarget.id!)
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      console.error(err)
      alert('Không thể xóa!')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>🛡️ Lịch sử Bảo hành Công trình</h3>
        {!showAddForm && (
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(true)}>
            <Plus size={14} />
            Báo cáo sự cố bảo hành
          </button>
        )}
      </div>

      {/* Form reporting issue */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 16, border: '1.5px solid var(--color-warning-light)', background: '#fffbeb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#b45309' }}>⚠️ Báo cáo sự cố cần bảo hành</h4>
            <button type="button" className="btn btn-icon btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Ngày ghi nhận sự cố</label>
              <input
                type="date"
                className="form-input"
                value={warrantyDate}
                onChange={(e) => setWarrantyDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú sửa chữa (nếu có)</label>
              <input
                className="form-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Cần mang theo bản lề thủy lực thay thế..."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả sự cố lỗi <span className="required">*</span></label>
            <textarea
              className="form-input"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Ví dụ: Kính cửa sổ bị sệ cánh, khó đóng khít bản lề..."
              rows={2}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      )}

      {/* List warranties */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
          <span className="spinner" style={{ width: 24, height: 24 }} />
        </div>
      ) : warranties.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px 0', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <ShieldCheck size={36} color="var(--color-success)" />
          <h4>Chưa có yêu cầu bảo hành nào</h4>
          <p style={{ fontSize: 13 }}>Công trình đang hoạt động tốt hoặc chưa phát sinh lỗi bảo hành.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {warranties.map((w) => (
            <div
              key={w.id}
              className="card"
              style={{
                padding: 16,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                borderLeft: `4px solid ${w.isResolved ? 'var(--color-success)' : 'var(--color-danger)'}`,
              }}
            >
              <div style={{
                color: w.isResolved ? 'var(--color-success)' : 'var(--color-danger)',
                padding: 8,
                borderRadius: 100,
                background: w.isResolved ? '#dcfce7' : '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {w.isResolved ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    Sự cố ngày {dayjs(w.warrantyDate).format('DD/MM/YYYY')}
                  </span>
                  <span className={`badge ${w.isResolved ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>
                    {w.isResolved ? 'Đã sửa xong' : 'Chưa xử lý'}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--color-text-primary)', marginTop: 4, fontWeight: 500 }}>
                  {w.issue}
                </div>

                {w.isResolved && w.resolvedAt && (
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    ✅ Đã hoàn thành sửa chữa vào ngày: {dayjs(w.resolvedAt).format('DD/MM/YYYY')}
                  </div>
                )}

                {w.note && (
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                    Ghi chú: {w.note}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, alignSelf: 'center' }}>
                {!w.isResolved && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleResolve(w)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Check size={12} />
                    Xong
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm btn-icon"
                  title="Xóa bản ghi"
                  onClick={() => setDeleteTarget(w)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Xóa nhật ký bảo hành"
          message="Bạn có chắc chắn muốn xóa bản ghi bảo hành này không?"
          confirmLabel="Xóa"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
