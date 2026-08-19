import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calculator } from 'lucide-react'
import { projectApi } from '@/shared/api/projectApi'
import { formatCurrency } from '@/shared/utils/format'

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
  status: string
  startDate: string | null
  deliveryDate: string | null
  note: string
  payments: any[]
  createdAt: string
  updatedAt: string
}

const schema = z.object({
  name: z.string().min(1, 'Tên công trình không được để trống').max(200),
  customerName: z.string().min(1, 'Tên khách hàng không được để trống').max(100),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  lengthM: z.coerce.number().min(0.01, 'Chiều dài phải lớn hơn 0'),
  widthM: z.coerce.number().min(0.01, 'Chiều rộng phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá không được âm'),
  deposit: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  project: Project | null
  onSuccess: () => void
  onClose: () => void
}

export default function ProjectFormModal({ project, onSuccess, onClose }: Props) {
  const isEdit = !!project

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          customerName: project.customerName,
          customerPhone: project.customerPhone ?? '',
          address: project.address ?? '',
          lengthM: project.lengthM,
          widthM: project.widthM,
          unitPrice: project.unitPrice,
          deposit: project.deposit,
          status: project.status,
          startDate: project.startDate ?? '',
          deliveryDate: project.deliveryDate ?? '',
          note: project.note ?? '',
        }
      : { deposit: 0 },
  })

  const [lengthM, widthM, unitPrice, deposit] = watch(['lengthM', 'widthM', 'unitPrice', 'deposit'])

  const calc = useMemo(() => {
    const area = (Number(lengthM) || 0) * (Number(widthM) || 0)
    const total = area * (Number(unitPrice) || 0)
    const paid = Number(deposit) || 0
    const debt = total - paid
    return { area, total, debt }
  }, [lengthM, widthM, unitPrice, deposit])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && project) {
        await projectApi.update(project.id, data as any)
      } else {
        await projectApi.create(data as any)
      }
      onSuccess()
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Có lỗi xảy ra!')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Sửa công trình' : '➕ Thêm công trình mới'}
          </h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Thông tin khách hàng */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                Thông tin khách hàng
              </h3>
              <div className="form-row" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tên khách hàng <span className="required">*</span></label>
                  <input {...register('customerName')} className={`form-input ${errors.customerName ? 'error' : ''}`} placeholder="Nguyễn Văn A" />
                  {errors.customerName && <span className="form-error">{errors.customerName.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input {...register('customerPhone')} className="form-input" placeholder="0901 234 567" />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Địa chỉ công trình</label>
                <input {...register('address')} className="form-input" placeholder="123 Đường ABC, Phường XYZ, TP. HCM" />
              </div>
            </div>

            {/* Tên công trình */}
            <div className="form-group">
              <label className="form-label">Tên / Mô tả công trình <span className="required">*</span></label>
              <input {...register('name')} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Cửa nhôm kính hệ 55, mặt tiền 3 tầng" />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Kích thước & Đơn giá */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                Kích thước & Tính tiền
              </h3>
              <div className="form-row-3" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Chiều dài (m) <span className="required">*</span></label>
                  <input
                    {...register('lengthM')}
                    type="number" step="0.01"
                    className={`form-input ${errors.lengthM ? 'error' : ''}`}
                    placeholder="5.5"
                  />
                  {errors.lengthM && <span className="form-error">{errors.lengthM.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Chiều rộng (m) <span className="required">*</span></label>
                  <input
                    {...register('widthM')}
                    type="number" step="0.01"
                    className={`form-input ${errors.widthM ? 'error' : ''}`}
                    placeholder="3.2"
                  />
                  {errors.widthM && <span className="form-error">{errors.widthM.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Đơn giá (VND/m²) <span className="required">*</span></label>
                  <input
                    {...register('unitPrice')}
                    type="number"
                    className={`form-input ${errors.unitPrice ? 'error' : ''}`}
                    placeholder="850000"
                  />
                  {errors.unitPrice && <span className="form-error">{errors.unitPrice.message}</span>}
                </div>
              </div>

              {/* Calc Preview */}
              {(calc.area > 0 || calc.total > 0) && (
                <div className="calc-preview" style={{ marginTop: 12 }}>
                  <div className="calc-row">
                    <span className="calc-label">📐 Diện tích</span>
                    <span className="calc-value">{calc.area.toFixed(2)} m²</span>
                  </div>
                  <div className="calc-row">
                    <span className="calc-label">💰 Thành tiền</span>
                    <span className="calc-value">{formatCurrency(calc.total)}</span>
                  </div>
                  <div className="calc-row">
                    <span className="calc-label">💵 Tiền cọc</span>
                    <span className="calc-value">{formatCurrency(Number(deposit) || 0)}</span>
                  </div>
                  <div className="calc-row">
                    <span className="calc-label">⚠️ Còn nợ</span>
                    <span className={`calc-value ${calc.debt > 0 ? 'danger' : 'success'}`}>
                      {calc.debt > 0 ? formatCurrency(calc.debt) : '✓ Đã đủ'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Thanh toán & Tiến độ */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                Thanh toán & Tiến độ
              </h3>
              <div className="form-row" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tiền cọc (VND)</label>
                  <input {...register('deposit')} type="number" className="form-input" placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <select {...register('status')} className="form-select">
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang làm</option>
                    <option value="WAITING_PAYMENT">Chờ thu tiền</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ gap: 12, marginTop: 12 }}>
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu</label>
                  <input {...register('startDate')} type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày giao hàng</label>
                  <input {...register('deliveryDate')} type="date" className="form-input" />
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <textarea {...register('note')} className="form-textarea" rows={3} placeholder="Ghi chú thêm về công trình..." />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm công trình')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
