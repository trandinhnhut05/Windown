import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Users, Phone } from 'lucide-react'
import { workerApi } from '@/shared/api/workerApi'
import type { Worker } from '@/shared/api/workerApi'
import { formatCurrency } from '@/shared/utils/format'
import WorkerFormModal from './WorkerFormModal'
import ConfirmModal from '@/shared/components/ConfirmModal'

export default function WorkerListPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filters
  const [keyword, setKeyword] = useState('')
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)

  // Modals state
  const [showForm, setShowForm] = useState(false)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (page = 0) => {
    setLoading(true)
    try {
      const res = await workerApi.getAll({
        page,
        size: 10,
        keyword: keyword || undefined,
        isActive,
      })
      setWorkers(res.content)
      setTotalPages(res.totalPages)
      setCurrentPage(res.number)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(0)
  }, [isActive])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    load(0)
  }

  const handleEdit = (w: Worker) => {
    setEditingWorker(w)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await workerApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      load(currentPage)
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Không thể xóa thợ này vì đã có dữ liệu chấm công / ứng lương.')
    } finally {
      setDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingWorker(null)
    load(currentPage)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>👷 Quản lý Thợ</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Quản lý thông tin thợ xưởng, số điện thoại và đơn giá công ngày.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingWorker(null); setShowForm(true) }}>
          <Plus size={16} />
          Thêm thợ mới
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="card" style={{ padding: 16 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', background: 'var(--color-bg)', flex: 1, minWidth: 200 }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên thợ, số điện thoại..."
              style={{ border: 'none', background: 'none', width: '100%', outline: 'none', fontSize: 14 }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 180, margin: 0 }}
            value={isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const val = e.target.value
              setIsActive(val === 'all' ? undefined : val === 'active')
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang làm việc</option>
            <option value="inactive">Đã nghỉ việc</option>
          </select>

          <button type="submit" className="btn btn-secondary">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Workers Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : workers.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <Users size={44} color="var(--color-text-muted)" />
            <h3>Danh sách thợ trống</h3>
            <p>Vui lòng nhấp nút "Thêm thợ mới" để khai báo thợ xưởng.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Tên thợ</th>
                    <th>Số điện thoại</th>
                    <th style={{ textAlign: 'right' }}>Lương một ngày công</th>
                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{w.name}</td>
                      <td>
                        {w.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <Phone size={12} color="var(--color-text-muted)" />
                            {w.phone}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatCurrency(w.dailyWage)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${w.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '4px 8px', fontSize: 11 }}>
                          {w.isActive ? 'Đang làm' : 'Đã nghỉ'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {w.note || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Sửa thông tin"
                            onClick={() => handleEdit(w)}
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-icon"
                            title="Xóa thợ"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 0}
                  onClick={() => load(currentPage - 1)}
                >
                  Trước
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600 }}>
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => load(currentPage + 1)}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <WorkerFormModal
          worker={editingWorker}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingWorker(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Xóa thợ xưởng"
          message={`Bạn có chắc chắn muốn xóa thông tin của thợ "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
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
