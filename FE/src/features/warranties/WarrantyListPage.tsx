import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ShieldAlert, Check, Trash2, Calendar, Briefcase } from 'lucide-react'
import dayjs from 'dayjs'
import { warrantyApi } from '@/shared/api/warrantyApi'
import type { Warranty } from '@/shared/api/warrantyApi'
import ConfirmModal from '@/shared/components/ConfirmModal'

export default function WarrantyListPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Warranty | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await warrantyApi.getAll()
      setWarranties(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>🛡️ Nhật ký bảo hành</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
          Tổng hợp tất cả sự cố và lịch sử bảo hành, bảo trì cửa nhôm kính của toàn xưởng.
        </p>
      </div>

      {/* Warranties Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : warranties.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <ShieldCheck size={44} color="var(--color-success)" />
            <h3>Nhật ký bảo hành trống</h3>
            <p>Tuyệt vời! Không có sự cố hay yêu cầu bảo hành nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Công trình</th>
                  <th>Ngày ghi nhận</th>
                  <th>Mô tả sự cố</th>
                  <th style={{ textAlign: 'center' }}>Trạng thái</th>
                  <th>Giải quyết lúc</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {warranties.map((w) => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 700 }}>
                      <Link to={`/projects/${w.projectId}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={13} color="var(--color-primary)" />
                        {w.projectName}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Calendar size={13} color="var(--color-text-muted)" />
                        {dayjs(w.warrantyDate).format('DD/MM/YYYY')}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={w.issue}>
                      {w.issue}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${w.isResolved ? 'badge-success' : 'badge-danger'}`} style={{ padding: '4px 8px', fontSize: 11 }}>
                        {w.isResolved ? 'Đã sửa' : 'Chưa sửa'}
                      </span>
                    </td>
                    <td>
                      {w.resolvedAt ? (
                        <span style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>
                          ✓ {dayjs(w.resolvedAt).format('DD/MM/YYYY')}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.note || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {!w.isResolved && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleResolve(w)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Xóa nhật ký bảo hành"
          message="Bạn có chắc chắn muốn xóa lịch sử bảo hành này không?"
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
