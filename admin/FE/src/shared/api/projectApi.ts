import httpClient from '@/shared/api/httpClient'

export interface Project {
  id: number
  projectCode: string
  name: string
  customerName: string
  customerPhone: string
  address: string
  lengthM: number
  widthM: number
  areaM2: number
  unitPrice: number
  totalAmount: number
  deposit: number
  extraPaid: number
  remainingDebt: number
  status: ProjectStatus
  startDate: string | null
  deliveryDate: string | null
  note: string
  payments: Payment[]
  createdAt: string
  updatedAt: string
}

export type ProjectStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'WAITING_PAYMENT'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Payment {
  id: number
  amount: number
  type: 'DEPOSIT' | 'EXTRA' | 'FINAL'
  note: string
  paidAt: string
}

export interface ProjectRequest {
  name: string
  customerName: string
  customerPhone?: string
  address?: string
  lengthM: number
  widthM: number
  unitPrice: number
  deposit?: number
  status?: ProjectStatus
  startDate?: string
  deliveryDate?: string
  note?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface DashboardStats {
  totalProjects: number
  inProgressProjects: number
  completedProjects: number
  waitingPaymentProjects: number
  totalRevenue: number
  totalDebt: number
  totalPaid: number
}

export const projectApi = {
  getAll: (params?: { status?: string; keyword?: string; page?: number; size?: number }) =>
    httpClient.get<PageResponse<Project>>('/projects', { params }).then((r) => r.data),

  getById: (id: number) =>
    httpClient.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: ProjectRequest) =>
    httpClient.post<Project>('/projects', data).then((r) => r.data),

  update: (id: number, data: ProjectRequest) =>
    httpClient.put<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    httpClient.delete(`/projects/${id}`),

  addPayment: (id: number, data: { amount: number; type: string; note?: string }) =>
    httpClient.post<Project>(`/projects/${id}/payments`, data).then((r) => r.data),

  getDashboard: () =>
    httpClient.get<DashboardStats>('/projects/dashboard').then((r) => r.data),
}
