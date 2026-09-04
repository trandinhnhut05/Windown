import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, AlertCircle } from 'lucide-react'
import {
  warehouseApi,
  RECEIPT_REASON_LABELS,
} from '@/shared/api/warehouseApi'
import type {
  ReceiptType,
  ReceiptReason,
  WarehouseItem,
} from '@/shared/api/warehouseApi'
import { projectApi } from '@/shared/api/projectApi'
import type { Project } from '@/shared/api/projectApi'
import CurrencyInput from '@/shared/components/CurrencyInput'
import { formatCurrency } from '@/shared/utils/format'

interface ReceiptItemRow {
  id: string // temporary key
  itemId: number | null
  quantity: number
  unitPrice: number
  note: string
}

interface Props {
  type: ReceiptType
  onSuccess: () => void
  onClose: () => void
}

export default function WarehouseReceiptModal({ type, onSuccess, onClose }: Props) {
  const isImport = type === 'IMPORT'

  const [reason, setReason] = useState<ReceiptReason>(
    isImport ? 'NHAP_MUA' : 'XUAT_CONG_TRINH'
  )
  const [projectId, setProjectId] = useState<number | null>(null)
  const [supplierOrRecipient, setSupplierOrRecipient] = useState('')
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().substring(0, 10))
  const [note, setNote] = useState('')
  const [syncToProjectMaterials, setSyncToProjectMaterials] = useState(true)

  const [availableItems, setAvailableItems] = useState<WarehouseItem[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [rows, setRows] = useState<ReceiptItemRow[]>([
    { id: 'row-1', itemId: null, quantity: 1, unitPrice: 0, note: '' },
  ])

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Tải danh sách vật tư kho
    warehouseApi.getItems().then((items) => {
      setAvailableItems(items)
      if (items.length > 0 && rows.length > 0 && !rows[0].itemId) {
        setRows([
          {
            id: 'row-1',
            itemId: items[0].id,
            quantity: 1,
            unitPrice: isImport ? items[0].costPrice : (items[0].sellingPrice || items[0].costPrice),
            note: '',
          },
        ])
      }
    }).catch(console.error)

    // Tải danh sách công trình
    projectApi.getAll({ size: 100 }).then((res) => {
      setProjects(res.content)
      if (res.content.length > 0 && !isImport) {
        setProjectId(res.content[0].id)
      }
    }).catch(console.error)
  }, [type, isImport])

  const handleAddRow = () => {
    const defaultItem = availableItems[0]
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random()}`,
        itemId: defaultItem ? defaultItem.id : null,
        quantity: 1,
        unitPrice: defaultItem
          ? isImport
            ? defaultItem.costPrice
            : (defaultItem.sellingPrice || defaultItem.costPrice)
          : 0,
        note: '',
      },
    ])
  }

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, itemId: number) => {
    const selected = availableItems.find((i) => i.id === itemId)
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        itemId,
        unitPrice: selected
          ? isImport
            ? selected.costPrice
            : (selected.sellingPrice || selected.costPrice)
          : 0,
      }
      return updated
    })
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], quantity }
      return updated
    })
  }

  const handlePriceChange = (index: number, unitPrice: number) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], unitPrice }
      return updated
    })
  }

  const handleNoteChange = (index: number, note: string) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], note }
      return updated
    })
  }

  // Tính tổng giá trị phiếu
  const totalAmount = rows.reduce((sum, r) => sum + (r.quantity || 0) * (r.unitPrice || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate rows
    for (const r of rows) {
      if (!r.itemId) {
        setError('Vui lòng chọn vật tư cho tất cả các dòng')
        return
      }
      if (r.quantity <= 0) {
        setError('Số lượng vật tư phải lớn hơn 0')
        return
      }

      // Check stock if export
      if (!isImport) {
        const item = availableItems.find((i) => i.id === r.itemId)
        if (item && r.quantity > item.currentStock) {
          setError(
            `Vật tư "${item.name}" chỉ còn tồn ${item.currentStock} ${item.unit}, không đủ để xuất ${r.quantity} ${item.unit}`
          )
          return
        }
      }
    }

    try {
      setIsSubmitting(true)

      await warehouseApi.createReceipt({
        type,
        reason,
        projectId: reason === 'XUAT_CONG_TRINH' ? projectId : null,
        supplierOrRecipient: supplierOrRecipient.trim() || undefined,
        receiptDate,
        note: note.trim() || undefined,
        syncToProjectMaterials: !isImport && reason === 'XUAT_CONG_TRINH' ? syncToProjectMaterials : false,
        items: rows.map((r) => ({
          itemId: r.itemId!,
          quantity: Number(r.quantity),
          unitPrice: Number(r.unitPrice),
          note: r.note.trim() || undefined,
        })),
      })

      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo phiếu kho')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 840 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isImport ? '📥 Tạo Phiếu Nhập Kho (PN)' : '📤 Tạo Phiếu Xuất Kho (PX)'}
          </h3>
          <button onClick={onClose} className="btn-close" type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-danger, #ef4444)',
                  padding: '10px 14px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Thông tin chung phiếu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Lý do {isImport ? 'nhập' : 'xuất'} <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReceiptReason)}
                >
                  {isImport ? (
                    <>
                      <option value="NHAP_MUA">{RECEIPT_REASON_LABELS.NHAP_MUA}</option>
                      <option value="NHAP_HOAN_TRA">{RECEIPT_REASON_LABELS.NHAP_HOAN_TRA}</option>
                    </>
                  ) : (
                    <>
                      <option value="XUAT_CONG_TRINH">{RECEIPT_REASON_LABELS.XUAT_CONG_TRINH}</option>
                      <option value="XUAT_HU_HONG">{RECEIPT_REASON_LABELS.XUAT_HU_HONG}</option>
                      <option value="XUAT_BAN_LE">{RECEIPT_REASON_LABELS.XUAT_BAN_LE}</option>
                      <option value="XUAT_KHAC">{RECEIPT_REASON_LABELS.XUAT_KHAC}</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Ngày {isImport ? 'nhập' : 'xuất'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isImport ? 'Nhà cung cấp / Nguồn' : 'Người nhận hàng'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isImport ? 'VD: Đại lý nhôm Nam Hải...' : 'VD: Thợ lắp ráp, khách mua...'}
                  value={supplierOrRecipient}
                  onChange={(e) => setSupplierOrRecipient(e.target.value)}
                />
              </div>
            </div>

            {/* Nếu xuất công trình */}
            {!isImport && reason === 'XUAT_CONG_TRINH' && (
              <div
                style={{
                  background: 'var(--color-bg-subtle, #f8fafc)',
                  border: '1px solid var(--color-border)',
                  padding: '12px 16px',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Chọn công trình nhận vật tư <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={projectId || ''}
                    onChange={(e) => setProjectId(Number(e.target.value) || null)}
                    required
                  >
                    <option value="">-- Chọn công trình --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectCode} - {p.name} ({p.customerName})
                      </option>
                    ))}
                  </select>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={syncToProjectMaterials}
                    onChange={(e) => setSyncToProjectMaterials(e.target.checked)}
                  />
                  <span>
                    <strong>Tự động đồng bộ vào Chi phí vật tư của công trình này</strong> (Hệ thống sẽ thêm danh sách vật tư vào bảng Chi phí công trình)
                  </span>
                </label>
              </div>
            )}

            {/* Bảng chi tiết dòng vật tư */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Danh sách vật tư {isImport ? 'nhập' : 'xuất'}:</span>
                <button type="button" onClick={handleAddRow} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={15} />
                  <span>Thêm dòng</span>
                </button>
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 6 }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', width: '35%' }}>Vật tư</th>
                      <th style={{ padding: '8px 10px', width: '15%' }}>Số lượng</th>
                      <th style={{ padding: '8px 10px', width: '22%' }}>Đơn giá</th>
                      <th style={{ padding: '8px 10px', width: '22%', textAlign: 'right' }}>Thành tiền</th>
                      <th style={{ padding: '8px 6px', width: '6%', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const selectedItem = availableItems.find((i) => i.id === row.itemId)
                      const rowTotal = (row.quantity || 0) * (row.unitPrice || 0)
                      const isOverStock = !isImport && selectedItem && row.quantity > selectedItem.currentStock

                      return (
                        <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '6px 10px' }}>
                            <select
                              className="form-select"
                              style={{ width: '100%', fontSize: 13 }}
                              value={row.itemId || ''}
                              onChange={(e) => handleItemChange(idx, Number(e.target.value))}
                              required
                            >
                              <option value="">-- Chọn vật tư --</option>
                              {availableItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  [{item.code}] {item.name} (Tồn: {item.currentStock} {item.unit})
                                </option>
                              ))}
                            </select>
                            {selectedItem && (
                              <div style={{ fontSize: 11, color: isOverStock ? 'var(--color-danger)' : 'var(--color-text-muted)', marginTop: 2 }}>
                                Tồn hiện tại: <strong>{selectedItem.currentStock} {selectedItem.unit}</strong>
                                {isOverStock && ' ⚠️ Vượt quá tồn kho!'}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                className={`form-input ${isOverStock ? 'error' : ''}`}
                                style={{ width: '100%', fontSize: 13, textAlign: 'right' }}
                                value={row.quantity}
                                onChange={(e) => handleQuantityChange(idx, parseFloat(e.target.value) || 0)}
                                required
                              />
                              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                {selectedItem?.unit || ''}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <CurrencyInput
                              value={row.unitPrice}
                              onChange={(val) => handlePriceChange(idx, val)}
                              showWords={false}
                              style={{ fontSize: 13 }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(rowTotal)}
                          </td>
                          <td style={{ padding: '6px 6px', textAlign: 'center' }}>
                            {rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="btn btn-icon btn-sm"
                                style={{ color: 'var(--color-danger, #ef4444)', border: 'none', background: 'transparent' }}
                                title="Xóa dòng"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tổng thành tiền phiếu */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 10,
                  padding: '8px 12px',
                  background: 'var(--color-bg-subtle, #f8fafc)',
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Tổng cộng giá trị phiếu:</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary, #2563eb)' }}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi chú phiếu</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Ghi chú thêm về chuyến hàng, số hóa đơn, tình trạng giao nhận..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={`btn ${isImport ? 'btn-primary' : 'btn-warning'}`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : isImport
                ? 'Xác nhận Nhập kho'
                : 'Xác nhận Xuất kho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
