import httpClient from '@/shared/api/httpClient'

export interface Material {
  id: number
  projectId: number
  name: string
  unit: string
  quantity: number
  unitPrice: number
  total: number
  note: string
  createdAt: string
}

export interface MaterialTemplate {
  id: number
  name: string
  unit: string
  defaultPrice: number
}

export interface FinancialChartData {
  month: string
  revenue: number
  materialCost: number
  profit: number
}

export const materialApi = {
  getByProject: (projectId: number) =>
    httpClient.get<Material[]>(`/projects/${projectId}/materials`).then((r) => r.data),

  create: (projectId: number, data: { name: string; unit: string; quantity: number; unitPrice: number; note?: string }) =>
    httpClient.post<Material>(`/projects/${projectId}/materials`, data).then((r) => r.data),

  update: (id: number, data: { name: string; unit: string; quantity: number; unitPrice: number; note?: string }) =>
    httpClient.put<Material>(`/materials/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    httpClient.delete(`/materials/${id}`),

  getTemplates: (keyword?: string) =>
    httpClient.get<MaterialTemplate[]>('/materials/templates', { params: { keyword } }).then((r) => r.data),

  getFinancialChart: (year?: number) =>
    httpClient.get<FinancialChartData[]>('/projects/reports/financial-chart', { params: { year } }).then((r) => r.data),
}
