import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar } from 'lucide-react'
import { payrollApi } from '@/shared/api/payrollApi'
import type { Payroll } from '@/shared/api/payrollApi'
import CurrencyInput from '@/shared/components/CurrencyInput'

const schema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền ứng tối thiểu 1.000 ₫'),
  advanceDate: z.string().min(1, 'Vui lòng chọn ngày ứng'),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  worker: Payroll
  onSuccess: () => void
  onClose: () => void
}

export default function AdvanceModal({ worker, onSuccess, onClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 100000,
      advanceDate: new Date().toISOString().split('T')[0],
      note: 'Ứng lương tuần',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await payrollApi.addAdvance(worker.workerId, data)
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
            💸 Ghi ứng lương thợ
          </h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Tên thợ */}
            <div className="form-group">
              <label className="form-label">Thợ nhận ứng</label>
              <div style={{ padding: '10px 14px', background: 'var(--color-bg-light)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {worker.workerName}
              </div>
            </div>

            {/* Số tiền ứng */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label">Số tiền ứng <span className="required">*</span></label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.amount}
                    placeholder="Ví dụ: 200.000"
                  />
                )}
              />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>

            {/* Ngày ứng lương */}
            <div className="form-group">
              <label className="form-label">Ngày ứng lương <span className="required">*</span></label>
              <input
                {...register('advanceDate')}
                type="date"
                className={`form-input ${errors.advanceDate ? 'error' : ''}`}
              />
              {errors.advanceDate && <span className="form-error">{errors.advanceDate.message}</span>}
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú ứng tiền</label>
              <input
                {...register('note')}
                className="form-input"
                placeholder="Ví dụ: Ứng xăng xe, đi chợ..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang ghi nhận...' : 'Xác nhận ứng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
