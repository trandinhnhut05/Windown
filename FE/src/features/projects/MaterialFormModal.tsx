import { useEffect, useState, useMemo, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Search } from 'lucide-react'
import { materialApi } from '@/shared/api/materialApi'
import type { Material, MaterialTemplate } from '@/shared/api/materialApi'
import { formatCurrency } from '@/shared/utils/format'
import CurrencyInput from '@/shared/components/CurrencyInput'

const schema = z.object({
  name: z.string().min(1, 'Tên vật tư không được để trống').max(100),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(30),
  quantity: z.coerce.number().min(0.001, 'Số lượng phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá không được âm'),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  projectId: number
  material: Material | null
  onSuccess: () => void
  onClose: () => void
}

export default function MaterialFormModal({ projectId, material, onSuccess, onClose }: Props) {
  const isEdit = !!material
  const autocompleteRef = useRef<HTMLDivElement>(null)

  const [suggestions, setSuggestions] = useState<MaterialTemplate[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: material
      ? {
          name: material.name,
          unit: material.unit,
          quantity: material.quantity,
          unitPrice: material.unitPrice,
          note: material.note ?? '',
        }
      : { quantity: 1, unitPrice: 0 },
  })

  const [name, quantity, unitPrice] = watch(['name', 'quantity', 'unitPrice'])

  // Live total preview
  const totalPreview = useMemo(() => {
    return (Number(quantity) || 0) * (Number(unitPrice) || 0)
  }, [quantity, unitPrice])

  // Fetch suggestions when name changes
  useEffect(() => {
    if (!name || name.trim().length < 1) {
      setSuggestions([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const templates = await materialApi.getTemplates(name)
        setSuggestions(templates)
      } catch (err) {
        console.error(err)
      }
    }, 200)

    return () => clearTimeout(delayDebounce)
  }, [name])

  // Handle outside click to hide autocomplete dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleSelectTemplate = (tpl: MaterialTemplate) => {
    setValue('name', tpl.name)
    setValue('unit', tpl.unit)
    setValue('unitPrice', tpl.defaultPrice)
    setShowSuggestions(false)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && material) {
        await materialApi.update(material.id, data)
      } else {
        await materialApi.create(projectId, data)
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
            {isEdit ? '✏️ Sửa vật tư' : '➕ Thêm vật tư mới'}
          </h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Tên vật tư (với Autocomplete) */}
            <div className="form-group" style={{ position: 'relative' }} ref={autocompleteRef}>
              <label className="form-label">Tên vật tư <span className="required">*</span></label>
              <input
                {...register('name')}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ví dụ: Sắt hộp 30x60, Cát, Xi măng..."
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: 'var(--color-bg)', border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)', marginTop: 4, maxHeight: 180, overflowY: 'auto',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {suggestions.map((tpl) => (
                    <div
                      key={tpl.id}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                        borderBottom: '1px solid var(--color-border-light)',
                        display: 'flex', justifyContent: 'space-between',
                      }}
                      className="autocomplete-item"
                      onClick={() => handleSelectTemplate(tpl)}
                    >
                      <span style={{ color: 'var(--color-text-primary)' }}>{tpl.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {formatCurrency(tpl.defaultPrice)} / {tpl.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Đơn vị tính */}
            <div className="form-group">
              <label className="form-label">Đơn vị tính <span className="required">*</span></label>
              <input
                {...register('unit')}
                className={`form-input ${errors.unit ? 'error' : ''}`}
                placeholder="Ví dụ: thanh, bao, khối, m²..."
              />
              {errors.unit && <span className="form-error">{errors.unit.message}</span>}
            </div>

            {/* Số lượng & Đơn giá */}
            <div className="form-row" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Số lượng <span className="required">*</span></label>
                <input
                  {...register('quantity')}
                  type="number" step="any"
                  className={`form-input ${errors.quantity ? 'error' : ''}`}
                  placeholder="10"
                />
                {errors.quantity && <span className="form-error">{errors.quantity.message}</span>}
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">Đơn giá <span className="required">*</span></label>
                <Controller
                  control={control}
                  name="unitPrice"
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.unitPrice}
                      placeholder="Nhập đơn giá..."
                    />
                  )}
                />
                {errors.unitPrice && <span className="form-error">{errors.unitPrice.message}</span>}
              </div>
            </div>

            {/* Calc preview */}
            {totalPreview > 0 && (
              <div style={{
                padding: '10px 14px', background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between',
              }}>
                <span>💰 Thành tiền vật tư:</span>
                <span>{formatCurrency(totalPreview)}</span>
              </div>
            )}

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <input
                {...register('note')}
                className="form-input"
                placeholder="Ví dụ: Đã nhận, mua ở tiệm ABC..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm vật tư')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
