import React, { useState, useEffect } from 'react'
import {
  X,
  Package,
  PackagePlus,
  Layers,
  Barcode,
  Scale,
  MapPin,
  FileText,
  AlertTriangle,
  Check,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
  DollarSign,
  Edit2,
  Box,
} from 'lucide-react'
import { warehouseApi, ITEM_CATEGORY_LABELS } from '@/shared/api/warehouseApi'
import type { WarehouseItem, ItemCategory } from '@/shared/api/warehouseApi'
import CurrencyInput from '@/shared/components/CurrencyInput'
import { formatCurrency } from '@/shared/utils/format'

interface Props {
  item: WarehouseItem | null
  onSuccess: () => void
  onClose: () => void
}

// Quick workshop presets for aluminum & glass fabrication
const WORKSHOP_PRESETS: Array<{
  name: string
  category: ItemCategory
  unit: string
  location?: string
  minStock?: number
}> = [
  { name: 'Nhôm Xingfa hệ 55 (Cây 5.8m)', category: 'NHOM', unit: 'cây', location: 'Kệ nhôm tầng 1', minStock: 10 },
  { name: 'Nhôm Xingfa hệ 93 lùa (Cây 5.8m)', category: 'NHOM', unit: 'cây', location: 'Kệ nhôm tầng 2', minStock: 8 },
  { name: 'Kính dán an toàn 8.38mm (Trắng trong)', category: 'KINH', unit: 'm²', location: 'Kho kính đứng', minStock: 15 },
  { name: 'Kính cường lực 10mm', category: 'KINH', unit: 'm²', location: 'Kho kính đứng', minStock: 15 },
  { name: 'Bản lề 3D Kinlong cửa đi', category: 'PHU_KIEN', unit: 'bộ', location: 'Tủ kim khí ngăn A1', minStock: 20 },
  { name: 'Khóa tay gạt đa điểm Kinlong', category: 'PHU_KIEN', unit: 'bộ', location: 'Tủ kim khí ngăn A2', minStock: 10 },
  { name: 'Keo Silicone Apollo A500 (Trắng sữa)', category: 'VAT_TU_PHU', unit: 'chai', location: 'Kệ hóa chất', minStock: 24 },
  { name: 'Gioăng cao su EPDM chèn cánh', category: 'VAT_TU_PHU', unit: 'cuộn', location: 'Khu phụ liệu', minStock: 5 },
]

const POPULAR_UNITS = ['cây', 'm²', 'bộ', 'chai', 'cuộn', 'kg', 'cái', 'thanh', 'hộp']
const POPULAR_LOCATIONS = ['Kệ nhôm tầng 1', 'Kệ nhôm tầng 2', 'Kho kính đứng', 'Tủ phụ kiện A', 'Khu keo phụ liệu']

export default function WarehouseItemModal({ item, onSuccess, onClose }: Props) {
  const isEdit = !!item

  const [code, setCode] = useState(item?.code || '')
  const [name, setName] = useState(item?.name || '')
  const [category, setCategory] = useState<ItemCategory>(item?.category || 'NHOM')
  const [unit, setUnit] = useState(item?.unit || 'cây')
  const [currentStock, setCurrentStock] = useState<number>(item?.currentStock || 0)
  const [minStock, setMinStock] = useState<number>(item?.minStock || 5)
  const [costPrice, setCostPrice] = useState<number>(item?.costPrice || 0)
  const [sellingPrice, setSellingPrice] = useState<number>(item?.sellingPrice || 0)
  const [location, setLocation] = useState(item?.location || '')
  const [note, setNote] = useState(item?.note || '')

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Listen to Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleApplyPreset = (preset: typeof WORKSHOP_PRESETS[0]) => {
    setName(preset.name)
    setCategory(preset.category)
    setUnit(preset.unit)
    if (preset.location && !location) setLocation(preset.location)
    if (preset.minStock) setMinStock(preset.minStock)
  }

  // Calculate profit margin if prices are provided
  const profitPerUnit = sellingPrice > 0 && costPrice > 0 ? sellingPrice - costPrice : 0
  const profitMarginPercent =
    sellingPrice > 0 && costPrice > 0 ? Math.round((profitPerUnit / costPrice) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tên vật tư không được để trống')
      return
    }
    if (!unit.trim()) {
      setError('Đơn vị tính không được để trống')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const payload = {
        code: code.trim() || undefined,
        name: name.trim(),
        category,
        unit: unit.trim(),
        currentStock: isEdit ? undefined : Number(currentStock) || 0,
        minStock: Number(minStock) || 0,
        costPrice: Number(costPrice) || 0,
        sellingPrice: Number(sellingPrice) || 0,
        location: location.trim() || undefined,
        note: note.trim() || undefined,
      }

      if (isEdit) {
        await warehouseApi.updateItem(item.id, payload)
      } else {
        await warehouseApi.createItem(payload)
      }

      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu vật tư kho')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal modal-md"
        style={{
          maxWidth: 760,
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #ffffff, #f8faff)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: isEdit
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #4f6ef7 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isEdit
                  ? '0 6px 14px -3px rgba(245, 158, 11, 0.35)'
                  : '0 6px 14px -3px rgba(79, 110, 247, 0.35)',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              {isEdit ? <Edit2 size={20} /> : <PackagePlus size={20} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
                {isEdit ? `Chỉnh sửa vật tư: ${item.name}` : 'Thêm mới vật tư vào kho'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                {isEdit
                  ? 'Cập nhật định mức tồn kho, vị trí lưu trữ và đơn giá vật tư'
                  : 'Khai báo thông số quy cách, định mức tồn và đơn giá vật tư xưởng'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            title="Đóng (Phím Esc)"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="modal-body"
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: 'calc(88vh - 120px)',
              overflowY: 'auto',
            }}
          >
            {/* Error Banner */}
            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* SECTION 1: Thông tin cơ bản & Phân loại */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Package size={16} color="#4f6ef7" />
                <span>Thông tin nhận diện vật tư</span>
              </div>

              {/* Tên vật tư */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    Tên vật tư <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Quy cách / Chủng loại</span>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box
                    size={16}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      paddingLeft: 38,
                      borderRadius: 10,
                      borderColor: '#cbd5e1',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    placeholder="Ví dụ: Nhôm Xingfa hệ 55 cây 5.8m, Kính dán an toàn 8.38mm..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                {/* Quick Presets for Aluminum & Glass Workshop */}
                {!isEdit && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Sparkles size={13} color="#f59e0b" />
                      <span>Gợi ý mẫu thông dụng xưởng nhôm kính:</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {WORKSHOP_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          style={{
                            fontSize: 11.5,
                            padding: '3px 9px',
                            borderRadius: 6,
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#4f6ef7'
                            e.currentTarget.style.color = '#4f6ef7'
                            e.currentTarget.style.background = '#eef2ff'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0'
                            e.currentTarget.style.color = '#475569'
                            e.currentTarget.style.background = '#ffffff'
                          }}
                        >
                          + {preset.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nhóm vật tư & Mã vật tư */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    Nhóm phân loại <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Layers
                      size={16}
                      color="#94a3b8"
                      style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
                    />
                    <select
                      className="form-select"
                      style={{
                        paddingLeft: 38,
                        borderRadius: 10,
                        borderColor: '#cbd5e1',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    >
                      {Object.entries(ITEM_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                      Mã vật tư
                    </label>
                    <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 500 }}>
                      ⚡ Để trống tự sinh mã
                    </span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Barcode
                      size={16}
                      color="#94a3b8"
                      style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{
                        paddingLeft: 38,
                        borderRadius: 10,
                        borderColor: '#cbd5e1',
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                      placeholder="VD: NHOM-XF55, PK-001..."
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Quy cách & Định mức tồn kho */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Scale size={16} color="#059669" />
                <span>Quy cách & Mức độ an toàn kho</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isEdit ? '1fr 1fr' : '1fr 1fr 1fr', gap: 12 }}>
                {/* Đơn vị tính */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    Đơn vị tính <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      borderRadius: 10,
                      borderColor: '#cbd5e1',
                      fontWeight: 600,
                    }}
                    placeholder="cây, m², bộ..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    list="unit-presets-list"
                    required
                  />
                  <datalist id="unit-presets-list">
                    {POPULAR_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {POPULAR_UNITS.slice(0, 5).map((u) => (
                      <span
                        key={u}
                        onClick={() => setUnit(u)}
                        style={{
                          fontSize: 11,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: unit === u ? '#4f6ef7' : '#e2e8f0',
                          color: unit === u ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tồn ban đầu */}
                {!isEdit && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                      Tồn kho ban đầu
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="form-input"
                        style={{
                          borderRadius: 10,
                          borderColor: '#cbd5e1',
                          fontWeight: 600,
                          paddingRight: 42,
                        }}
                        value={currentStock}
                        onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: 10,
                          fontSize: 12,
                          color: '#64748b',
                          fontWeight: 500,
                          pointerEvents: 'none',
                        }}
                      >
                        {unit || 'đv'}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Số lượng sẵn có lúc khởi tạo
                    </span>
                  </div>
                )}

                {/* Định mức an toàn tối thiểu */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      Mức cảnh báo tồn
                    </label>
                    <span title="Cảnh báo vàng/đỏ khi số lượng thực tế dưới mức này">
                      <AlertTriangle size={13} color="#f59e0b" />
                    </span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="form-input"
                      style={{
                        borderRadius: 10,
                        borderColor: '#cbd5e1',
                        fontWeight: 600,
                        paddingRight: 42,
                      }}
                      value={minStock}
                      onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: 10,
                        fontSize: 12,
                        color: '#64748b',
                        fontWeight: 500,
                        pointerEvents: 'none',
                      }}
                    >
                      {unit || 'đv'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500, marginTop: 2 }}>
                    Báo động đỏ khi tồn ≤ {minStock} {unit}
                  </span>
                </div>
              </div>

              {/* Vị trí lưu kho */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  Vị trí trong kho
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin
                    size={16}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      paddingLeft: 38,
                      borderRadius: 10,
                      borderColor: '#cbd5e1',
                      fontSize: 13,
                    }}
                    placeholder="Ví dụ: Kệ nhôm tầng 1, Tủ phụ kiện ngăn B2, Kho kính ngoài..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <span
                      key={loc}
                      onClick={() => setLocation(loc)}
                      style={{
                        fontSize: 11,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: location === loc ? '#dbeafe' : '#f1f5f9',
                        color: location === loc ? '#1e40af' : '#475569',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                      }}
                    >
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Đơn giá & Tài chính */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#334155',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <DollarSign size={16} color="#2563eb" />
                  <span>Đơn giá & Tài chính</span>
                </div>

                {profitPerUnit > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 100,
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <TrendingUp size={13} />
                    Chênh lệch: +{formatCurrency(profitPerUnit)} ({profitMarginPercent > 0 ? `+${profitMarginPercent}%` : ''})
                  </span>
                )}
                {profitPerUnit < 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 100,
                      background: '#fef2f2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <AlertTriangle size={13} />
                    Lưu ý: Giá bán thấp hơn giá vốn ({formatCurrency(profitPerUnit)})
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <TrendingDown size={14} color="#059669" />
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      Đơn giá nhập (Giá vốn)
                    </label>
                  </div>
                  <CurrencyInput
                    value={costPrice}
                    onChange={setCostPrice}
                    placeholder="0"
                    style={{ borderRadius: 10, borderColor: '#cbd5e1' }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Dùng để định giá vốn & tổng tài sản tồn kho
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <TrendingUp size={14} color="#ea580c" />
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      Đơn giá bán / Xuất tham khảo
                    </label>
                  </div>
                  <CurrencyInput
                    value={sellingPrice}
                    onChange={setSellingPrice}
                    placeholder="0"
                    style={{ borderRadius: 10, borderColor: '#cbd5e1' }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Gợi ý khi tạo báo giá hoặc xuất vật tư
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Ghi chú thêm */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <FileText size={14} color="#64748b" />
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  Ghi chú & Thông số kỹ thuật bổ sung
                </label>
              </div>
              <textarea
                className="form-textarea"
                rows={2}
                style={{
                  borderRadius: 10,
                  borderColor: '#cbd5e1',
                  fontSize: 13,
                  resize: 'vertical',
                }}
                placeholder="Độ dày nhôm/kính, màu sắc (ghi, đen, xơ dừa), nhà cung cấp quen thuộc..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="modal-footer"
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #f1f5f9',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
              <kbd
                style={{
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: '#e2e8f0',
                  color: '#475569',
                  fontFamily: 'monospace',
                  fontSize: 11,
                }}
              >
                Esc
              </kbd>
              <span>để đóng</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
                style={{
                  borderRadius: 10,
                  padding: '9px 18px',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{
                  borderRadius: 10,
                  padding: '9px 22px',
                  fontWeight: 600,
                  fontSize: 14,
                  background: 'linear-gradient(135deg, #4f6ef7 0%, #3b82f6 100%)',
                  boxShadow: '0 4px 12px rgba(79, 110, 247, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.6s linear infinite',
                      }}
                    />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{isEdit ? 'Cập nhật thay đổi' : 'Thêm vật tư vào kho'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
