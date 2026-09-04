import httpClient from '@/shared/api/httpClient'

export type ItemCategory = 'NHOM' | 'KINH' | 'PHU_KIEN' | 'VAT_TU_PHU' | 'KHAC'
export type ReceiptType = 'IMPORT' | 'EXPORT'
export type ReceiptReason =
  | 'NHAP_MUA'
  | 'NHAP_HOAN_TRA'
  | 'XUAT_CONG_TRINH'
  | 'XUAT_HU_HONG'
  | 'XUAT_BAN_LE'
  | 'XUAT_KHAC'

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  NHOM: 'Nhôm hệ',
  KINH: 'Kính các loại',
  PHU_KIEN: 'Phụ kiện kim khí',
  VAT_TU_PHU: 'Vật tư phụ',
  KHAC: 'Khác',
}

export const RECEIPT_REASON_LABELS: Record<ReceiptReason, string> = {
  NHAP_MUA: 'Nhập mua mới',
  NHAP_HOAN_TRA: 'Nhập hoàn trả từ công trình',
  XUAT_CONG_TRINH: 'Xuất thi công công trình',
  XUAT_HU_HONG: 'Xuất hao hụt / Hư hỏng',
  XUAT_BAN_LE: 'Xuất bán lẻ',
  XUAT_KHAC: 'Xuất dùng chung xưởng',
}

export interface WarehouseItem {
  id: number
  code: string
  name: string
  category: ItemCategory
  unit: string
  currentStock: number
  minStock: number
  costPrice: number
  sellingPrice: number
  totalValue: number
  location?: string
  note?: string
  isLowStock: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WarehouseItemRequest {
  code?: string
  name: string
  category: ItemCategory
  unit: string
  currentStock?: number
  minStock?: number
  costPrice?: number
  sellingPrice?: number
  location?: string
  note?: string
}

export interface ReceiptItem {
  id: number
  itemId: number
  itemCode: string
  itemName: string
  itemUnit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  note?: string
}

export interface WarehouseReceipt {
  id: number
  code: string
  type: ReceiptType
  reason: ReceiptReason
  projectId?: number | null
  projectCode?: string | null
  projectName?: string | null
  supplierOrRecipient?: string | null
  receiptDate: string
  totalAmount: number
  note?: string
  createdByName?: string | null
  createdAt: string
  items: ReceiptItem[]
}

export interface WarehouseReceiptRequest {
  type: ReceiptType
  reason: ReceiptReason
  projectId?: number | null
  supplierOrRecipient?: string
  receiptDate: string
  note?: string
  items: {
    itemId: number
    quantity: number
    unitPrice?: number
    note?: string
  }[]
  syncToProjectMaterials?: boolean
}

export interface WarehouseSummary {
  totalItems: number
  totalStockValue: number
  lowStockItemsCount: number
  totalImportsThisMonth: number
  totalImportValueThisMonth: number
  totalExportsThisMonth: number
  totalExportValueThisMonth: number
}

export interface WarehouseTransaction {
  id: number
  itemId: number
  itemCode: string
  itemName: string
  itemUnit: string
  receiptId?: number | null
  receiptCode?: string | null
  type: string
  quantity: number
  stockBefore: number
  stockAfter: number
  transactionDate: string
  note?: string
}

export const warehouseApi = {
  getItems: (params?: { keyword?: string; category?: ItemCategory; lowStockOnly?: boolean }) =>
    httpClient.get<WarehouseItem[]>('/warehouse/items', { params }).then((r) => r.data),

  getItemById: (id: number) =>
    httpClient.get<WarehouseItem>(`/warehouse/items/${id}`).then((r) => r.data),

  createItem: (data: WarehouseItemRequest) =>
    httpClient.post<WarehouseItem>('/warehouse/items', data).then((r) => r.data),

  updateItem: (id: number, data: WarehouseItemRequest) =>
    httpClient.put<WarehouseItem>(`/warehouse/items/${id}`, data).then((r) => r.data),

  deleteItem: (id: number) =>
    httpClient.delete(`/warehouse/items/${id}`),

  getReceipts: (params?: { type?: ReceiptType; startDate?: string; endDate?: string; projectId?: number }) =>
    httpClient.get<WarehouseReceipt[]>('/warehouse/receipts', { params }).then((r) => r.data),

  getReceiptById: (id: number) =>
    httpClient.get<WarehouseReceipt>(`/warehouse/receipts/${id}`).then((r) => r.data),

  createReceipt: (data: WarehouseReceiptRequest) =>
    httpClient.post<WarehouseReceipt>('/warehouse/receipts', data).then((r) => r.data),

  getTransactions: (itemId?: number) =>
    httpClient.get<WarehouseTransaction[]>('/warehouse/transactions', { params: { itemId } }).then((r) => r.data),

  getSummary: () =>
    httpClient.get<WarehouseSummary>('/warehouse/summary').then((r) => r.data),
}
