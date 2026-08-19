import httpClient from '@/shared/api/httpClient'

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface Worker {
  id: number
  name: string
  phone: string
  dailyWage: number
  isActive: boolean
  note: string
  createdAt: string
}

export const workerApi = {
  getAll: (params?: { isActive?: boolean; keyword?: string; page?: number; size?: number }) =>
    httpClient.get<Page<Worker>>('/workers', { params }).then((r) => r.data),

  getActive: () =>
    httpClient.get<Worker[]>('/workers/active').then((r) => r.data),

  getById: (id: number) =>
    httpClient.get<Worker>(`/workers/${id}`).then((r) => r.data),

  create: (data: { name: string; phone?: string; dailyWage: number; isActive?: boolean; note?: string }) =>
    httpClient.post<Worker>('/workers', data).then((r) => r.data),

  update: (id: number, data: { name: string; phone?: string; dailyWage: number; isActive?: boolean; note?: string }) =>
    httpClient.put<Worker>(`/workers/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    httpClient.delete(`/workers/${id}`),
}
