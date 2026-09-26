import { useEffect, useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, ArrowUpRight, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react'
import { materialApi } from '@/shared/api/materialApi'
import type { Material } from '@/shared/api/materialApi'
import { formatCurrency } from '@/shared/utils/format'
import MaterialFormModal from './MaterialFormModal'
import ConfirmModal from '@/shared/components/ConfirmModal'

interface Props {
  projectId: number
  totalAmount: number
  onUpdate: () => void
}

export default function ProjectMaterialsTab({ projectId, totalAmount, onUpdate }: Props) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await materialApi.getByProject(projectId)
      setMaterials(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [projectId])

  const totalCost = useMemo(() => {
    return materials.reduce((sum, m) => sum + m.total, 0)
  }, [materials])

  const profit = totalAmount - totalCost
  const profitPercent = totalAmount > 0 ? Math.round((profit / totalAmount) * 100) : 0

  const handleEdit = (m: Material) => {
    setEditingMaterial(m)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await materialApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
      onUpdate()
    } finally {
      setDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingMaterial(null)
    load()
    onUpdate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profit & Loss summary card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16 }}>
        <SummaryCard
          title="Doanh thu (Thành tiền)"
          value={formatCurrency(totalAmount)}
          color="var(--color-primary)"
        />
        <SummaryCard
          title="Tổng chi phí vật tư"
          value={formatCurrency(totalCost)}
          color="var(--color-text-secondary)"
        />
        <SummaryCard
          title={`Lợi nhuận ước tính (${profitPercent}%)`}
          value={formatCurrency(profit)}
          color={profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
          highlight
          isSuccess={profit >= 0}
        />
      </div>

      {/* Materials Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Danh sách vật tư sử dụng</h3>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditingMaterial(null); setShowForm(true) }}>
            <Plus size={14} />
            Thêm vật tư
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
          </div>
        ) : materials.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <ShoppingBag size={36} color="var(--color-text-muted)" />
            <h3>Chưa nhập vật tư</h3>
            <p>Nhấp nút "Thêm vật tư" ở trên để ghi nhận chi phí</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Tên vật tư</th>
                  <th style={{ textAlign: 'center' }}>ĐVT</th>
                  <th style={{ textAlign: 'right' }}>Số lượng</th>
                  <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td style={{ textAlign: 'center', fontSize: 13 }}>{m.unit}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{Number(m.quantity).toString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(m.unitPrice)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(m.total)}</td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.note || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Sửa"
                          onClick={() => handleEdit(m)}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Xóa"
                          onClick={() => setDeleteTarget(m)}
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

      {showForm && (
        <MaterialFormModal
          projectId={projectId}
          material={editingMaterial}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingMaterial(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Xóa vật tư"
          message={`Bạn chắc chắn muốn xóa dòng vật tư "${deleteTarget.name}"? Hành động này sẽ hoàn lại chi phí công trình.`}
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

function SummaryCard({
  title, value, color, highlight, isSuccess,
}: {
  title: string
  value: string
  color: string
  highlight?: boolean
  isSuccess?: boolean
}) {
  return (
    <div style={{
      padding: '16px 20px',
      background: highlight ? (isSuccess ? '#f0fdf4' : '#fef2f2') : 'var(--color-bg)',
      border: `1.5px solid ${highlight ? (isSuccess ? '#bbf7d0' : '#fecaca') : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {highlight ? (isSuccess ? <TrendingUp size={14} color="var(--color-success)" /> : <AlertCircle size={14} color="var(--color-danger)" />) : null}
        {title}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}
