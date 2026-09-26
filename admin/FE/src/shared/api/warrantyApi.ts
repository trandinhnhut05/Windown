import httpClient from '@/shared/api/httpClient'

export interface Warranty {
  id?: number
  projectId: number
  projectName?: string
  warrantyDate: string
  issue: string
  isResolved: boolean
  resolvedAt?: string | null
  note?: string
  createdAt?: string
}

export const warrantyApi = {
  getAll: () =>
    httpClient.get<Warranty[]>('/warranties').then((r) => r.data),

  getByProject: (projectId: number) =>
    httpClient.get<Warranty[]>(`/projects/${projectId}/warranties`).then((r) => r.data),

  create: (projectId: number, data: { warrantyDate: string; issue: string; isResolved?: boolean; resolvedAt?: string | null; note?: string }) =>
    httpClient.post<Warranty>(`/projects/${projectId}/warranties`, data).then((r) => r.data),

  update: (id: number, data: { warrantyDate: string; issue: string; isResolved?: boolean; resolvedAt?: string | null; note?: string }) =>
    httpClient.put<Warranty>(`/warranties/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    httpClient.delete(`/warranties/${id}`),
}
