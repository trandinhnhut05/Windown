import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { workerApi } from '@/shared/api/workerApi'
import type { Worker } from '@/shared/api/workerApi'

const schema = z.object({
  name: z.string().min(1, 'Tên thợ không được để trống').max(100),
  phone: z.string().max(20).optional(),
  dailyWage: z.coerce.number().min(0, 'Lương ngày không được âm'),
  isActive: z.boolean(),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  worker: Worker | null
  onSuccess: () => void
  onClose: () => void
}

export default function WorkerFormModal({ worker, onSuccess, onClose }: Props) {
  const isEdit = !!worker

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: worker
      ? {
          name: worker.name,
          phone: worker.phone ?? '',
          dailyWage: worker.dailyWage,
          isActive: worker.isActive,
          note: worker.note ?? '',
        }
      : { dailyWage: 300000, isActive: true },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && worker) {
        await workerApi.update(worker.id, data)
      } else {
        await workerApi.create(data)
      }
      onSuccess()
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Có lỗi xảy ra!')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Sửa thông tin thợ' : '➕ Thêm thợ mới'}
          </h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Tên thợ */}
            <div className="form-group">
              <label className="form-label">Tên thợ <span className="required">*</span></label>
              <input
                {...register('name')}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Số điện thoại */}
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('phone')}
                className="form-input"
                placeholder="Ví dụ: 0987654321"
              />
            </div>

            {/* Lương ngày */}
            <div className="form-group">
              <label className="form-label">Lương một ngày công (VND) <span className="required">*</span></label>
              <input
                {...register('dailyWage')}
                type="number"
                className={`form-input ${errors.dailyWage ? 'error' : ''}`}
                placeholder="Ví dụ: 350000"
              />
              {errors.dailyWage && <span className="form-error">{errors.dailyWage.message}</span>}
            </div>

            {/* Trạng thái hoạt động */}
            {isEdit && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  style={{ width: 16, height: 16 }}
                />
                <label htmlFor="isActive" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Đang làm việc tại xưởng
                </label>
              </div>
            )}

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <input
                {...register('note')}
                className="form-input"
                placeholder="Ví dụ: Thợ hàn chính, chuyên cửa đi..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm thợ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
