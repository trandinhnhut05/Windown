import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, CreditCard } from 'lucide-react'
import { projectApi } from '@/shared/api/projectApi'
import { formatCurrency } from '@/shared/utils/format'
import CurrencyInput from '@/shared/components/CurrencyInput'

const schema = z.object({
  amount: z.coerce.number().min(1000, 'Số tiền phải ít nhất 1.000 VND'),
  type: z.enum(['DEPOSIT', 'EXTRA', 'FINAL']),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  projectId: number
  remainingDebt: number
  onSuccess: () => void
  onClose: () => void
}

export default function PaymentModal({ projectId, remainingDebt, onSuccess, onClose }: Props) {
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'EXTRA' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await projectApi.addPayment(projectId, data)
      onSuccess()
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Lỗi khi ghi nhận thanh toán')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-success)', flexShrink: 0,
            }}>
              <CreditCard size={20} />
            </div>
            <h2 className="modal-title" style={{ fontSize: 16 }}>Ghi nhận thu tiền</h2>
          </div>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {remainingDebt > 0 && (
              <div style={{
                padding: '10px 14px',
                background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)',
                fontSize: 14, color: 'var(--color-warning)', fontWeight: 600,
              }}>
                ⚠️ Còn nợ: {formatCurrency(remainingDebt)}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Loại thanh toán <span className="required">*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { value: 'DEPOSIT', label: '💰 Tiền cọc' },
                  { value: 'EXTRA', label: '➕ Thu thêm' },
                  { value: 'FINAL', label: '✅ Thanh toán đủ' },
                ].map((opt) => (
                  <label key={opt.value} style={{
                    flex: 1, padding: '8px 4px', border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, textAlign: 'center',
                  }}>
                    <input type="radio" value={opt.value} {...register('type')} style={{ display: 'none' }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label">Số tiền <span className="required">*</span></label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.amount}
                    placeholder="Nhập số tiền..."
                  />
                )}
              />
              {remainingDebt > 0 && (
                <button
                  type="button"
                  style={{ alignSelf: 'flex-start', fontSize: 12, color: 'var(--color-primary)', marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setValue('amount', remainingDebt)}
                >
                  Điền đủ số còn nợ ({formatCurrency(remainingDebt)})
                </button>
              )}
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <input {...register('note')} className="form-input" placeholder="VD: Tiền mặt, chuyển khoản..." />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : 'Ghi nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
