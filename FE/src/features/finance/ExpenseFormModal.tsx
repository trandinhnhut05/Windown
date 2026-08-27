import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { financeApi } from '@/shared/api/financeApi'
import type { ExpenseCategory } from '@/shared/api/financeApi'
import CurrencyInput from '@/shared/components/CurrencyInput'

const schema = z.object({
  category: z.enum(['RENT', 'ELECTRICITY', 'TRANSPORT', 'MACHINERY_MAINTENANCE', 'OTHER']),
  amount: z.coerce.number().min(1000, 'Số tiền tối thiểu 1.000 ₫'),
  expenseDate: z.string().min(1, 'Vui lòng chọn ngày chi'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSuccess: () => void
  onClose: () => void
}

export default function ExpenseFormModal({ onSuccess, onClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'ELECTRICITY',
      amount: 1000000,
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await financeApi.addExpense({
        category: data.category as ExpenseCategory,
        amount: data.amount,
        expenseDate: data.expenseDate,
        description: data.description,
      })
      onSuccess()
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Có lỗi xảy ra!')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">💸 Ghi nhận Chi phí chung</h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Danh mục */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Danh mục chi phí <span className="required">*</span></label>
              <select {...register('category')} className="form-input">
                <option value="RENT">Thuê mặt bằng</option>
                <option value="ELECTRICITY">Điện sản xuất</option>
                <option value="TRANSPORT">Vận chuyển / Xe tải</option>
                <option value="MACHINERY_MAINTENANCE">Bảo trì máy móc / Công cụ</option>
                <option value="OTHER">Chi phí khác</option>
              </select>
            </div>

            {/* Số tiền */}
            <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <label className="form-label">Số tiền chi <span className="required">*</span></label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.amount}
                    placeholder="Ví dụ: 3.500.000"
                  />
                )}
              />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>

            {/* Ngày chi */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ngày chi <span className="required">*</span></label>
              <input
                {...register('expenseDate')}
                type="date"
                className={`form-input ${errors.expenseDate ? 'error' : ''}`}
              />
              {errors.expenseDate && <span className="form-error">{errors.expenseDate.message}</span>}
            </div>

            {/* Mô tả */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mô tả chi tiết</label>
              <input
                {...register('description')}
                className="form-input"
                placeholder="Ví dụ: Tiền điện xưởng tháng 8/2026"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : 'Ghi nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
