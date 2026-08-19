import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { reminderApi } from '@/shared/api/reminderApi'
import type { Reminder, ReminderType } from '@/shared/api/reminderApi'
import { projectApi } from '@/shared/api/projectApi'
import type { Project } from '@/shared/api/projectApi'

const schema = z.object({
  title: z.string().min(1, 'Tiêu đề nhắc nhở không được để trống').max(200),
  remindAt: z.string().min(1, 'Vui lòng chọn thời gian nhắc nhở'),
  type: z.enum(['DELIVERY', 'PAYMENT', 'WARRANTY', 'OTHER']),
  projectId: z.coerce.number().nullable().optional(),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  reminder: Reminder | null
  onSuccess: () => void
  onClose: () => void
}

export default function ReminderFormModal({ reminder, onSuccess, onClose }: Props) {
  const isEdit = !!reminder
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    projectApi.getAll({ size: 100 }).then((res) => {
      setProjects(res.content)
    }).catch(console.error)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: reminder
      ? {
          title: reminder.title,
          remindAt: reminder.remindAt.substring(0, 16), // format to YYYY-MM-DDTHH:mm
          type: reminder.type,
          projectId: reminder.projectId || null,
          note: reminder.note || '',
        }
      : {
          title: '',
          remindAt: new Date(Date.now() + 3600000).toISOString().substring(0, 16), // current time + 1h
          type: 'OTHER',
          note: '',
        },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        projectId: data.projectId || null,
        remindAt: new Date(data.remindAt).toISOString(), // Format to ISO
      }

      if (isEdit && reminder) {
        await reminderApi.update(reminder.id, formattedData)
      } else {
        await reminderApi.create(formattedData)
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
            {isEdit ? '✏️ Sửa nhắc việc' : '⏰ Thêm lịch nhắc việc'}
          </h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Tiêu đề */}
            <div className="form-group">
              <label className="form-label">Tiêu đề nhắc nhở <span className="required">*</span></label>
              <input
                {...register('title')}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Ví dụ: Đo đạc kính cường lực ở Vũng Tàu..."
              />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            {/* Thời gian */}
            <div className="form-group">
              <label className="form-label">Thời gian nhắc nhở <span className="required">*</span></label>
              <input
                {...register('remindAt')}
                type="datetime-local"
                className={`form-input ${errors.remindAt ? 'error' : ''}`}
              />
              {errors.remindAt && <span className="form-error">{errors.remindAt.message}</span>}
            </div>

            {/* Loại nhắc nhở */}
            <div className="form-group">
              <label className="form-label">Phân loại việc</label>
              <select {...register('type')} className="form-input">
                <option value="DELIVERY">🚚 Giao hàng / Thi công</option>
                <option value="PAYMENT">💰 Thu tiền đợt kế tiếp</option>
                <option value="WARRANTY">🛡️ Bảo trì / Bảo hành</option>
                <option value="OTHER">☕ Việc khác</option>
              </select>
            </div>

            {/* Liên kết công trình */}
            <div className="form-group">
              <label className="form-label">Liên kết công trình (Không bắt buộc)</label>
              <select {...register('projectId')} className="form-input">
                <option value="">-- Không liên kết --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.customerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú thêm</label>
              <input
                {...register('note')}
                className="form-input"
                placeholder="Ví dụ: Mang theo thước dây và bản vẽ A3..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm nhắc nhở')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
