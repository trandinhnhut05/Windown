import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Trash2, Calendar, DollarSign } from 'lucide-react'
import { payrollApi } from '@/shared/api/payrollApi'
import type { Payroll, Piecework } from '@/shared/api/payrollApi'
import { projectApi } from '@/shared/api/projectApi'
import type { Project } from '@/shared/api/projectApi'
import { formatCurrency, formatDate } from '@/shared/utils/format'

const schema = z.object({
  projectId: z.string().optional(),
  description: z.string().min(1, 'Vui lòng nhập mô tả công việc khoán'),
  quantity: z.coerce.number().min(0.01, 'Số lượng phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá không được nhỏ hơn 0'),
  workDate: z.string().min(1, 'Vui lòng chọn ngày thực hiện'),
})

type FormData = z.infer<typeof schema>

interface Props {
  worker: Payroll
  onSuccess: () => void
  onClose: () => void
}

export default function PieceworkModal({ worker, onSuccess, onClose }: Props) {
  const [pieceworks, setPieceworks] = useState<Piecework[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: '',
      description: 'Lắp ráp cửa Xingfa',
      quantity: 1,
      unitPrice: 150000,
      workDate: new Date().toISOString().split('T')[0],
    },
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [list, projPage] = await Promise.all([
        payrollApi.getPiecework(worker.workerId),
        projectApi.getAll({ size: 100 }), // get active/recent projects
      ])
      setPieceworks(list)
      setProjects(projPage.content)
    } catch (err) {
      console.error('Không thể tải dữ liệu lương khoán', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [worker.workerId])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        projectId: data.projectId ? Number(data.projectId) : undefined,
        description: data.description,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        workDate: data.workDate,
      }
      await payrollApi.addPiecework(worker.workerId, payload)
      reset({
        projectId: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        workDate: new Date().toISOString().split('T')[0],
      })
      loadData()
      onSuccess() // triggers parent reload
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Có lỗi xảy ra!')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa khoản công khoán này?')) return
    try {
      await payrollApi.deletePiecework(id)
      loadData()
      onSuccess()
    } catch (err: any) {
      alert('Không thể xóa khoản công khoán!')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <h2 className="modal-title">🔧 Ghi nhận Lương khoán thợ</h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          {/* Form thêm mới bên trái */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Thêm công khoán mới
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Thợ nhận */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thợ thực hiện</label>
                <div style={{ padding: '8px 12px', background: 'var(--color-bg-light)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                  {worker.workerName}
                </div>
              </div>

              {/* Dự án/Công trình */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Công trình liên kết</label>
                <select {...register('projectId')} className="form-input">
                  <option value="">-- Không thuộc công trình nào --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.projectCode}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mô tả */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mô tả công việc <span className="required">*</span></label>
                <input
                  {...register('description')}
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  placeholder="Ví dụ: Ráp cửa đi Xingfa hệ 55"
                />
                {errors.description && <span className="form-error">{errors.description.message}</span>}
              </div>

              {/* Số lượng */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Số lượng khoán <span className="required">*</span></label>
                <input
                  {...register('quantity')}
                  type="number"
                  step="0.01"
                  className={`form-input ${errors.quantity ? 'error' : ''}`}
                  placeholder="Ví dụ: 5"
                />
                {errors.quantity && <span className="form-error">{errors.quantity.message}</span>}
              </div>

              {/* Đơn giá */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Đơn giá khoán (VND) <span className="required">*</span></label>
                <input
                  {...register('unitPrice')}
                  type="number"
                  className={`form-input ${errors.unitPrice ? 'error' : ''}`}
                  placeholder="Ví dụ: 150000"
                />
                {errors.unitPrice && <span className="form-error">{errors.unitPrice.message}</span>}
              </div>

              {/* Ngày thực hiện */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ngày thực hiện <span className="required">*</span></label>
                <input
                  {...register('workDate')}
                  type="date"
                  className={`form-input ${errors.workDate ? 'error' : ''}`}
                />
                {errors.workDate && <span className="form-error">{errors.workDate.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} disabled={isSubmitting}>
                {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Plus size={16} />}
                Ghi nhận công khoán
              </button>
            </form>
          </div>

          {/* Danh sách đã có bên phải */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Danh sách công khoán đã ghi nhận
            </h3>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40, flex: 1, alignItems: 'center' }}>
                <span className="spinner" style={{ width: 28, height: 28 }} />
              </div>
            ) : pieceworks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--color-text-muted)', border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <DollarSign size={32} />
                <p style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>Chưa có công việc khoán nào</p>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', maxHeights: '400px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>Ngày</th>
                      <th style={{ padding: '8px 12px' }}>Công việc & Công trình</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>SL x Đơn giá</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Thành tiền</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pieceworks.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>
                          {formatDate(p.workDate)}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700 }}>{p.description}</div>
                          {p.projectName && (
                            <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 2 }}>
                              🏗️ {p.projectName}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {p.quantity} x {formatCurrency(p.unitPrice)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--color-success)' }}>
                          {formatCurrency(p.amount)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm btn-icon"
                            onClick={() => handleDelete(p.id)}
                            style={{ padding: 4, height: 'auto' }}
                          >
                            <Trash2 size={13} color="var(--color-danger)" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
