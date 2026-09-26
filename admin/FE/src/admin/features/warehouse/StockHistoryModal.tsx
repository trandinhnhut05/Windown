import React, { useEffect, useState } from 'react'
import { X, History, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { warehouseApi } from '@/shared/api/warehouseApi'
import type { WarehouseItem, WarehouseTransaction } from '@/shared/api/warehouseApi'
import { formatDateTime } from '@/shared/utils/format'

interface Props {
  item: WarehouseItem
  onClose: () => void
}

export default function StockHistoryModal({ item, onClose }: Props) {
  const [transactions, setTransactions] = useState<WarehouseTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    warehouseApi.getTransactions(item.id)
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [item.id])

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <History size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 className="modal-title">
              Thẻ kho: [{item.code}] {item.name}
            </h3>
          </div>
          <button onClick={onClose} className="btn-close" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tóm tắt tồn hiện tại */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: 'var(--color-bg-subtle, #f8fafc)',
              borderRadius: 6,
              marginBottom: 14,
              fontSize: 13,
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Đơn vị tính: </span>
              <strong>{item.unit}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Định mức tối thiểu: </span>
              <strong>{item.minStock} {item.unit}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Tồn hiện tại: </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: item.isLowStock ? 'var(--color-danger)' : 'var(--color-success, #16a34a)',
                }}
              >
                {item.currentStock} {item.unit}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
              Đang tải lịch sử thẻ kho...
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
              Chưa có giao dịch biến động nào được ghi nhận cho mặt hàng này.
            </div>
          ) : (
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', width: '22%' }}>Thời gian</th>
                    <th style={{ padding: '8px 10px', width: '18%' }}>Loại giao dịch</th>
                    <th style={{ padding: '8px 10px', width: '15%', textAlign: 'right' }}>Thay đổi</th>
                    <th style={{ padding: '8px 10px', width: '15%', textAlign: 'right' }}>Tồn sau</th>
                    <th style={{ padding: '8px 10px', width: '30%' }}>Ghi chú / Chứng từ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isPlus = tx.quantity > 0
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '8px 10px', color: 'var(--color-text-muted)' }}>
                          {formatDateTime(tx.transactionDate)}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background:
                                tx.type === 'IMPORT' || tx.type === 'INIT'
                                  ? 'rgba(34, 197, 94, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              color:
                                tx.type === 'IMPORT' || tx.type === 'INIT'
                                  ? '#16a34a'
                                  : '#dc2626',
                            }}
                          >
                            {tx.type === 'IMPORT' ? (
                              <>
                                <ArrowDownRight size={12} /> Nhập kho
                              </>
                            ) : tx.type === 'EXPORT' ? (
                              <>
                                <ArrowUpRight size={12} /> Xuất kho
                              </>
                            ) : (
                              'Khởi tạo'
                            )}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '8px 10px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: isPlus ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {isPlus ? `+${tx.quantity}` : tx.quantity} {item.unit}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                          {tx.stockAfter} {item.unit}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <div>{tx.note || '—'}</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
