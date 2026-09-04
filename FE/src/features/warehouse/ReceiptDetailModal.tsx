import React, { useRef } from 'react'
import { X, Printer, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { WarehouseReceipt } from '@/shared/api/warehouseApi'
import { RECEIPT_REASON_LABELS } from '@/shared/api/warehouseApi'
import { formatCurrency, numberToVietnameseWords, formatDate } from '@/shared/utils/format'

interface Props {
  receipt: WarehouseReceipt
  onClose: () => void
}

export default function ReceiptDetailModal({ receipt, onClose }: Props) {
  const isImport = receipt.type === 'IMPORT'
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 780 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                background: isImport ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                color: isImport ? '#16a34a' : '#ea580c',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {isImport ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {isImport ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}
            </span>
            <h3 className="modal-title">{receipt.code}</h3>
          </div>
          <button onClick={onClose} className="btn-close" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" ref={printRef}>
          {/* Header thông tin phiếu */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              padding: '14px 16px',
              background: 'var(--color-bg-subtle, #f8fafc)',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Mã phiếu: </span>
              <strong>{receipt.code}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Ngày thực hiện: </span>
              <strong>{formatDate(receipt.receiptDate)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Lý do: </span>
              <strong>{RECEIPT_REASON_LABELS[receipt.reason] || receipt.reason}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {isImport ? 'Nhà cung cấp / Nguồn: ' : 'Người nhận: '}
              </span>
              <strong>{receipt.supplierOrRecipient || '—'}</strong>
            </div>
            {receipt.projectCode && (
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Công trình: </span>
                <strong style={{ color: 'var(--color-primary)' }}>
                  [{receipt.projectCode}] {receipt.projectName}
                </strong>
              </div>
            )}
            {receipt.note && (
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Ghi chú: </span>
                <span>{receipt.note}</span>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Người lập phiếu: </span>
              <span>{receipt.createdByName || 'Admin'}</span>
            </div>
          </div>

          {/* Bảng chi tiết vật tư */}
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', width: '5%', textAlign: 'center' }}>STT</th>
                <th style={{ padding: '8px 10px', width: '18%' }}>Mã VT</th>
                <th style={{ padding: '8px 10px', width: '32%' }}>Tên vật tư</th>
                <th style={{ padding: '8px 10px', width: '10%', textAlign: 'center' }}>ĐVT</th>
                <th style={{ padding: '8px 10px', width: '12%', textAlign: 'right' }}>Số lượng</th>
                <th style={{ padding: '8px 10px', width: '13%', textAlign: 'right' }}>Đơn giá</th>
                <th style={{ padding: '8px 10px', width: '15%', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>{item.itemCode}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <div>{item.itemName}</div>
                    {item.note && (
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        {item.note}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>{item.itemUnit}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{item.quantity}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--color-bg-subtle, #f8fafc)', borderTop: '2px solid var(--color-border)' }}>
                <td colSpan={6} style={{ padding: '10px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
                  Tổng cộng thành tiền:
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, fontSize: 16, color: 'var(--color-primary)' }}>
                  {formatCurrency(receipt.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Bằng chữ */}
          <div style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            (Bằng chữ: {numberToVietnameseWords(receipt.totalAmount)})
          </div>

          {/* Chữ ký */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              textAlign: 'center',
              marginTop: 32,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            <div>
              <strong>Người lập phiếu</strong>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>(Ký, ghi rõ họ tên)</div>
              <div style={{ height: 50 }}></div>
              <div>{receipt.createdByName || 'Chủ xưởng'}</div>
            </div>
            <div>
              <strong>{isImport ? 'Người giao hàng' : 'Người nhận hàng'}</strong>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>(Ký, ghi rõ họ tên)</div>
              <div style={{ height: 50 }}></div>
              <div>{receipt.supplierOrRecipient || ''}</div>
            </div>
            <div>
              <strong>Thủ kho / Quản lý</strong>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>(Ký, ghi rõ họ tên)</div>
              <div style={{ height: 50 }}></div>
              <div>Mạnh Nghĩa Window</div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={handlePrint} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Printer size={16} />
            <span>In phiếu này</span>
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
