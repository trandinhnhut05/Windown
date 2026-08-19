import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Pencil, Trash2, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { projectApi } from '@/shared/api/projectApi'
import { formatCurrency, formatDate, projectStatusMap } from '@/shared/utils/format'

type ProjectStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'WAITING_PAYMENT'
  | 'COMPLETED'
  | 'CANCELLED'

interface Project {
  id: number
  projectCode: string
  name: string
  customerName: string
  customerPhone: string
  address: string
  lengthM: number
  widthM: number
  areaM2: number
  unitPrice: number
  totalAmount: number
  deposit: number
  extraPaid: number
  remainingDebt: number
  status: ProjectStatus
  startDate: string | null
  deliveryDate: string | null
  note: string
  payments: any[]
  createdAt: string
  updatedAt: string
}

interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
import ProjectFormModal from './ProjectFormModal'
import ConfirmModal from '@/shared/components/ConfirmModal'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'IN_PROGRESS', label: 'Đang làm' },
  { value: 'WAITING_PAYMENT', label: 'Chờ thu tiền' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState<PageResponse<Project> | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await projectApi.getAll({
        status: statusFilter || undefined,
        keyword: keyword || undefined,
        page: currentPage,
        size: 15,
      })
      setPage(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [currentPage, keyword, statusFilter])

  useEffect(() => { load() }, [load])

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(searchInput)
      setCurrentPage(0)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleStatusChange = (s: string) => {
    setStatusFilter(s)
    setCurrentPage(0)
  }

  const handleEdit = (p: Project) => {
    setEditingProject(p)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await projectApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProject(null)
    load()
  }

  const projects = page?.content ?? []
  const totalPages = page?.totalPages ?? 0

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            className="form-input search-input"
            placeholder="Tìm theo tên khách, tên CT..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={15} color="var(--color-text-muted)" />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: 160 }}
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingProject(null); setShowForm(true) }}
          >
            <Plus size={16} />
            Thêm công trình
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} />
            <h3>Không có công trình nào</h3>
            <p>Thêm công trình mới hoặc thay đổi bộ lọc</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã CT</th>
                    <th>Khách hàng</th>
                    <th>Tên công trình</th>
                    <th>Diện tích</th>
                    <th>Thành tiền</th>
                    <th>Còn nợ</th>
                    <th>Trạng thái</th>
                    <th>Giao hàng</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const status = projectStatusMap[p.status]
                    const isOverdue = p.deliveryDate && new Date(p.deliveryDate) < new Date() && p.status !== 'COMPLETED'
                    return (
                      <tr key={p.id}>
                        <td>
                          <code style={{
                            fontSize: 12, color: 'var(--color-primary)',
                            background: 'var(--color-primary-light)',
                            padding: '2px 7px', borderRadius: 4, fontWeight: 600,
                          }}>
                            {p.projectCode}
                          </code>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.customerName}</div>
                          {p.customerPhone && (
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.customerPhone}</div>
                          )}
                        </td>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {p.name}
                          </div>
                          {p.address && (
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              📍 {p.address}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 13 }}>
                          <div>{p.lengthM}m × {p.widthM}m</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{Number(p.areaM2).toFixed(2)} m²</div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {formatCurrency(p.totalAmount)}
                        </td>
                        <td>
                          {p.remainingDebt > 0 ? (
                            <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
                              {formatCurrency(p.remainingDebt)}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 13 }}>
                              ✓ Đã thanh toán
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 13,
                            color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                            fontWeight: isOverdue ? 600 : 400,
                          }}>
                            {isOverdue && '⚠️ '}
                            {formatDate(p.deliveryDate)}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Xem chi tiết"
                              onClick={() => navigate(`/projects/${p.id}`)}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Sửa"
                              onClick={() => handleEdit(p)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm btn-icon"
                              title="Xóa"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Trang {currentPage + 1} / {totalPages} • {page?.totalElements} công trình
                </span>
                <div className="pagination" style={{ padding: 0 }}>
                  <button
                    className="page-btn"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i
                    return (
                      <button
                        key={p}
                        className={`page-btn ${p === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p + 1}
                      </button>
                    )
                  })}
                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ProjectFormModal
          project={editingProject}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingProject(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Xóa công trình"
          message={`Bạn chắc chắn muốn xóa công trình "${deleteTarget.name}" của khách ${deleteTarget.customerName}? Hành động này không thể hoàn tác.`}
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
