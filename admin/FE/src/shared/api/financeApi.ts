import httpClient from '@/shared/api/httpClient'

export type ExpenseCategory =
  | 'RENT'
  | 'ELECTRICITY'
  | 'TRANSPORT'
  | 'MACHINERY_MAINTENANCE'
  | 'OTHER'

export const expenseCategoryMap: Record<ExpenseCategory, { label: string; className: string }> = {
  RENT: { label: 'Thuê mặt bằng', className: 'badge-info' },
  ELECTRICITY: { label: 'Điện sản xuất', className: 'badge-warning' },
  TRANSPORT: { label: 'Vận chuyển', className: 'badge-primary' },
  MACHINERY_MAINTENANCE: { label: 'Bảo trì máy móc', className: 'badge-danger' },
  OTHER: { label: 'Chi phí khác', className: 'badge-secondary' },
}

export interface Expense {
  id: number
  category: ExpenseCategory
  amount: number
  expenseDate: string
  description: string
}

export interface FinancialReport {
  month: number
  revenue: number
  materialCost: number
  laborCost: number
  generalExpense: number
  netProfit: number
}

export const financeApi = {
  getReport: (year?: number) =>
    httpClient.get<FinancialReport[]>('/finance/report', { params: { year } }).then((r) => r.data),

  getExpenses: (start: string, end: string) =>
    httpClient.get<Expense[]>('/finance/expenses', { params: { start, end } }).then((r) => r.data),

  addExpense: (data: { category: ExpenseCategory; amount: number; expenseDate: string; description?: string }) =>
    httpClient.post<Expense>('/finance/expenses', data).then((r) => r.data),

  deleteExpense: (id: number) =>
    httpClient.delete(`/finance/expenses/${id}`),
}
