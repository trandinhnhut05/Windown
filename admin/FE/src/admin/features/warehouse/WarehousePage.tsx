import React, { useState, useEffect, useCallback } from 'react'
import {
  Package,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  AlertTriangle,
  FileText,
  History,
  TrendingDown,
  TrendingUp,
  Edit2,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react'
import {
  warehouseApi,
  ITEM_CATEGORY_LABELS,
  RECEIPT_REASON_LABELS,
} from '@/shared/api/warehouseApi'
import type {
  WarehouseItem,
  WarehouseReceipt,
  WarehouseSummary,
  WarehouseTransaction,
  ItemCategory,
  ReceiptType,
} from '@/shared/api/warehouseApi'
import { formatCurrency, formatDate, formatDateTime } from '@/shared/utils/format'
import WarehouseItemModal from './WarehouseItemModal'
import WarehouseReceiptModal from './WarehouseReceiptModal'
import ReceiptDetailModal from './ReceiptDetailModal'
import StockHistoryModal from './StockHistoryModal'

type ActiveTab = 'inventory' | 'imports' | 'exports' | 'ledger'

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory')

  // Data states
  const [summary, setSummary] = useState<WarehouseSummary | null>(null)
  const [items, setItems] = useState<WarehouseItem[]>([])
  const [receipts, setReceipts] = useState<WarehouseReceipt[]>([])
  const [transactions, setTransactions] = useState<WarehouseTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | ''>('')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  // Receipt filters
  const [receiptStartDate, setReceiptStartDate] = useState('')
  const [receiptEndDate, setReceiptEndDate] = useState('')

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null)

  const [receiptModalType, setReceiptModalType] = useState<ReceiptType | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<WarehouseReceipt | null>(null)
  const [historyItem, setHistoryItem] = useState<WarehouseItem | null>(null)

  // Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      const data = await warehouseApi.getSummary()
      setSummary(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  // Load items
  const loadItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await warehouseApi.getItems({
        keyword: searchKeyword || undefined,
        category: selectedCategory || undefined,
        lowStockOnly: lowStockOnly || undefined,
      })
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [searchKeyword, selectedCategory, lowStockOnly])

  // Load receipts
  const loadReceipts = useCallback(async (type?: ReceiptType) => {
    setIsLoading(true)
    try {
      const data = await warehouseApi.getReceipts({
        type,
        startDate: receiptStartDate || undefined,
        endDate: receiptEndDate || undefined,
      })
      setReceipts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [receiptStartDate, receiptEndDate])

  // Load transactions
  const loadTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await warehouseApi.getTransactions()
      setTransactions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial and reactive loading
  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadItems()
    } else if (activeTab === 'imports') {
      loadReceipts('IMPORT')
    } else if (activeTab === 'exports') {
      loadReceipts('EXPORT')
    } else if (activeTab === 'ledger') {
      loadTransactions()
    }
  }, [activeTab, loadItems, loadReceipts, loadTransactions])

  const handleDeleteItem = async (item: WarehouseItem) => {
    if (window.confirm(`Bạn có chắc muốn xóa mặt hàng "${item.name}" khỏi danh sách kho?`)) {
      try {
        await warehouseApi.deleteItem(item.id)
        loadItems()
        loadSummary()
      } catch (err) {
        console.error(err)
        alert('Không thể xóa mặt hàng này')
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={22} style={{ color: 'var(--color-primary)' }} />
            Quản lý Kho Vật tư
          </h2>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            Theo dõi tồn kho nhôm kính, phụ kiện, nhập xuất kho và cảnh báo thiếu hàng
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setReceiptModalType('IMPORT')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowDownRight size={16} style={{ color: '#16a34a' }} />
            <span>Nhập kho</span>
          </button>

          <button
            onClick={() => setReceiptModalType('EXPORT')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowUpRight size={16} style={{ color: '#ea580c' }} />
            <span>Xuất kho</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null)
              setIsItemModalOpen(true)
            }}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Thêm vật tư</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
          {/* Card 1: Tổng mặt hàng */}
          <div className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>TỔNG MẶT HÀNG</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
              {summary.totalItems} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>loại</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
              Đang lưu trữ trong kho
            </div>
          </div>

          {/* Card 2: Giá trị tồn kho */}
          <div className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>GIÁ TRỊ TỒN KHO</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--color-primary)' }}>
              {formatCurrency(summary.totalStockValue)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
              Ước tính theo giá vốn hiện tại
            </div>
          </div>

          {/* Card 3: Cảnh báo sắp hết */}
          <div
            className="card"
            style={{
              padding: '14px 18px',
              cursor: 'pointer',
              borderLeft: summary.lowStockItemsCount > 0 ? '4px solid var(--color-danger, #ef4444)' : undefined,
            }}
            onClick={() => {
              setActiveTab('inventory')
              setLowStockOnly(!lowStockOnly)
            }}
            title="Bấm để lọc các mặt hàng sắp hết"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>CẢNH BÁO SẮP HẾT</span>
              {summary.lowStockItemsCount > 0 && <AlertTriangle size={16} color="#ef4444" />}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginTop: 4,
                color: summary.lowStockItemsCount > 0 ? 'var(--color-danger, #ef4444)' : 'inherit',
              }}
            >
              {summary.lowStockItemsCount} <span style={{ fontSize: 13, fontWeight: 500 }}>mặt hàng</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
              {lowStockOnly ? 'Đang lọc xem hàng sắp hết' : 'Dưới định mức tối thiểu'}
            </div>
          </div>

          {/* Card 4: Nhập trong tháng */}
          <div className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
              <TrendingDown size={14} color="#16a34a" />
              <span>NHẬP THÁNG NÀY</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: '#16a34a' }}>
              {formatCurrency(summary.totalImportValueThisMonth)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
              {summary.totalImportsThisMonth} lượt nhập kho
            </div>
          </div>

          {/* Card 5: Xuất trong tháng */}
          <div className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
              <TrendingUp size={14} color="#ea580c" />
              <span>XUẤT THÁNG NÀY</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: '#ea580c' }}>
              {formatCurrency(summary.totalExportValueThisMonth)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
              {summary.totalExportsThisMonth} lượt xuất kho
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Tabs */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tabs Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-subtle, #f8fafc)',
            padding: '0 16px',
            gap: 24,
          }}
        >
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: activeTab === 'inventory' ? 700 : 500,
              color: activeTab === 'inventory' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === 'inventory' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Package size={17} />
            <span>Danh mục Tồn kho</span>
            <span style={{ fontSize: 11, background: 'var(--color-border)', padding: '2px 6px', borderRadius: 100 }}>
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('imports')}
            style={{
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: activeTab === 'imports' ? 700 : 500,
              color: activeTab === 'imports' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === 'imports' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowDownRight size={17} style={{ color: '#16a34a' }} />
            <span>Phiếu Nhập kho (PN)</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            style={{
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: activeTab === 'exports' ? 700 : 500,
              color: activeTab === 'exports' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === 'exports' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowUpRight size={17} style={{ color: '#ea580c' }} />
            <span>Phiếu Xuất kho (PX)</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            style={{
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: activeTab === 'ledger' ? 700 : 500,
              color: activeTab === 'ledger' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === 'ledger' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <History size={17} />
            <span>Sổ Thẻ kho toàn xưởng</span>
          </button>
        </div>

        {/* Tab 1: Danh mục Tồn kho */}
        {activeTab === 'inventory' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Filter Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm theo tên vật tư hoặc mã VT..."
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 170 }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | '')}
              >
                <option value="">Tất cả phân loại</option>
                {Object.entries(ITEM_CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                />
                <span style={{ color: lowStockOnly ? 'var(--color-danger)' : 'inherit', fontWeight: lowStockOnly ? 600 : 400 }}>
                  Chỉ hiện hàng sắp hết ({summary?.lowStockItemsCount || 0})
                </span>
              </label>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', width: '5%', textAlign: 'center' }}>STT</th>
                    <th style={{ padding: '10px 12px', width: '12%' }}>Mã VT</th>
                    <th style={{ padding: '10px 12px', width: '22%' }}>Tên vật tư</th>
                    <th style={{ padding: '10px 12px', width: '12%' }}>Phân loại</th>
                    <th style={{ padding: '10px 12px', width: '7%', textAlign: 'center' }}>ĐVT</th>
                    <th style={{ padding: '10px 12px', width: '11%', textAlign: 'right' }}>Tồn kho</th>
                    <th style={{ padding: '10px 12px', width: '11%', textAlign: 'right' }}>Giá vốn</th>
                    <th style={{ padding: '10px 12px', width: '12%', textAlign: 'right' }}>Tổng giá trị</th>
                    <th style={{ padding: '10px 12px', width: '8%', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Đang tải danh sách vật tư...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Không có mặt hàng nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const isLow = item.isLowStock
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                              {item.code}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            {item.location && (
                              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                📍 {item.location}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                background: 'var(--color-bg-subtle, #f1f5f9)',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              {ITEM_CATEGORY_LABELS[item.category] || item.category}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.unit}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: isLow ? 'var(--color-danger, #ef4444)' : '#16a34a',
                                }}
                              >
                                {item.currentStock}
                              </span>
                              {isLow && (
                                <span title={`Dưới định mức an toàn (${item.minStock} ${item.unit})`}>
                                  <AlertTriangle size={14} color="#ef4444" />
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                              Tối thiểu: {item.minStock}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {formatCurrency(item.costPrice)}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                            {formatCurrency(item.totalValue)}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                              <button
                                onClick={() => setHistoryItem(item)}
                                className="btn btn-icon btn-sm"
                                title="Xem thẻ kho"
                                style={{ color: 'var(--color-primary)' }}
                              >
                                <History size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItem(item)
                                  setIsItemModalOpen(true)
                                }}
                                className="btn btn-icon btn-sm"
                                title="Chỉnh sửa"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="btn btn-icon btn-sm"
                                title="Xóa"
                                style={{ color: 'var(--color-danger)' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2 & 3: Phiếu Nhập / Xuất kho */}
        {(activeTab === 'imports' || activeTab === 'exports') && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span>Từ ngày:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 140, padding: '6px 8px' }}
                  value={receiptStartDate}
                  onChange={(e) => setReceiptStartDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span>Đến ngày:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 140, padding: '6px 8px' }}
                  value={receiptEndDate}
                  onChange={(e) => setReceiptEndDate(e.target.value)}
                />
              </div>

              {(receiptStartDate || receiptEndDate) && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setReceiptStartDate('')
                    setReceiptEndDate('')
                  }}
                >
                  Xóa lọc ngày
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', width: '5%', textAlign: 'center' }}>STT</th>
                    <th style={{ padding: '10px 12px', width: '15%' }}>Mã phiếu</th>
                    <th style={{ padding: '10px 12px', width: '12%' }}>Ngày thực hiện</th>
                    <th style={{ padding: '10px 12px', width: '18%' }}>Lý do</th>
                    <th style={{ padding: '10px 12px', width: '22%' }}>
                      {activeTab === 'imports' ? 'Nhà cung cấp' : 'Đối tượng nhận / Công trình'}
                    </th>
                    <th style={{ padding: '10px 12px', width: '15%', textAlign: 'right' }}>Tổng giá trị</th>
                    <th style={{ padding: '10px 12px', width: '8%', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Đang tải danh sách phiếu kho...
                      </td>
                    </tr>
                  ) : receipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Chưa có phiếu kho nào được ghi nhận.
                      </td>
                    </tr>
                  ) : (
                    receipts.map((r, index) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                            {r.code}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>{formatDate(r.receiptDate)}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background:
                                r.type === 'IMPORT' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                              color: r.type === 'IMPORT' ? '#16a34a' : '#ea580c',
                            }}
                          >
                            {RECEIPT_REASON_LABELS[r.reason] || r.reason}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {r.projectCode ? (
                            <div>
                              <strong style={{ color: 'var(--color-primary)' }}>[{r.projectCode}]</strong> {r.projectName}
                            </div>
                          ) : (
                            r.supplierOrRecipient || '—'
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                          {formatCurrency(r.totalAmount)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedReceipt(r)}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            <Eye size={14} />
                            <span>Xem</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Sổ Thẻ kho toàn xưởng */}
        {activeTab === 'ledger' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Nhật ký ghi nhận 100 biến động xuất / nhập kho gần nhất trong toàn xưởng:
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-subtle, #f1f5f9)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', width: '16%' }}>Thời gian</th>
                    <th style={{ padding: '10px 12px', width: '22%' }}>Vật tư</th>
                    <th style={{ padding: '10px 12px', width: '14%' }}>Loại giao dịch</th>
                    <th style={{ padding: '10px 12px', width: '12%', textAlign: 'right' }}>Biến động</th>
                    <th style={{ padding: '10px 12px', width: '12%', textAlign: 'right' }}>Tồn sau GD</th>
                    <th style={{ padding: '10px 12px', width: '24%' }}>Chứng từ / Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Đang tải sổ thẻ kho...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--color-text-muted)' }}>
                        Chưa có lịch sử giao dịch kho nào.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isPlus = tx.quantity > 0
                      return (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>
                            {formatDateTime(tx.transactionDate)}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <strong>[{tx.itemCode}]</strong> {tx.itemName}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
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
                              {tx.type === 'IMPORT' ? 'Nhập kho' : tx.type === 'EXPORT' ? 'Xuất kho' : 'Khởi tạo'}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'right',
                              fontWeight: 700,
                              color: isPlus ? '#16a34a' : '#dc2626',
                            }}
                          >
                            {isPlus ? `+${tx.quantity}` : tx.quantity} {tx.itemUnit}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                            {tx.stockAfter} {tx.itemUnit}
                          </td>
                          <td style={{ padding: '10px 12px' }}>{tx.note || '—'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isItemModalOpen && (
        <WarehouseItemModal
          item={editingItem}
          onSuccess={() => {
            setIsItemModalOpen(false)
            setEditingItem(null)
            loadItems()
            loadSummary()
          }}
          onClose={() => {
            setIsItemModalOpen(false)
            setEditingItem(null)
          }}
        />
      )}

      {receiptModalType && (
        <WarehouseReceiptModal
          type={receiptModalType}
          onSuccess={() => {
            setReceiptModalType(null)
            loadSummary()
            if (activeTab === 'inventory') loadItems()
            else if (activeTab === 'imports') loadReceipts('IMPORT')
            else if (activeTab === 'exports') loadReceipts('EXPORT')
            else if (activeTab === 'ledger') loadTransactions()
          }}
          onClose={() => setReceiptModalType(null)}
        />
      )}

      {selectedReceipt && (
        <ReceiptDetailModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {historyItem && (
        <StockHistoryModal
          item={historyItem}
          onClose={() => setHistoryItem(null)}
        />
      )}
    </div>
  )
}
