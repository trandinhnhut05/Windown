import httpClient from '@/shared/api/httpClient'

export interface Payroll {
  workerId: number
  workerName: string
  dailyWage: number
  presentDays: number
  totalOtHours: number
  totalEarnedFromAttendance: number
  totalPieceworkAmount: number
  totalEarned: number
  totalAdvanced: number
  remainingSalary: number
}

export interface SalaryAdvance {
  id: number
  workerId: number
  workerName: string
  amount: number
  advanceDate: string
  note: string
  createdAt: string
}

export interface Piecework {
  id: number
  workerId: number
  workerName: string
  projectId?: number
  projectCode?: string
  projectName?: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  workDate: string
}

export const payrollApi = {
  getMonthly: (params: { year: number; month: number }) =>
    httpClient.get<Payroll[]>('/payroll', { params }).then((r) => r.data),

  getAdvances: (workerId: number) =>
    httpClient.get<SalaryAdvance[]>(`/workers/${workerId}/advances`).then((r) => r.data),

  addAdvance: (workerId: number, data: { amount: number; advanceDate: string; note?: string }) =>
    httpClient.post<SalaryAdvance>(`/workers/${workerId}/advances`, data).then((r) => r.data),

  deleteAdvance: (id: number) =>
    httpClient.delete(`/salary-advances/${id}`),

  getPiecework: (workerId: number) =>
    httpClient.get<Piecework[]>(`/workers/${workerId}/piecework`).then((r) => r.data),

  addPiecework: (workerId: number, data: { projectId?: number; description: string; quantity: number; unitPrice: number; workDate: string }) =>
    httpClient.post<Piecework>(`/workers/${workerId}/piecework`, data).then((r) => r.data),

  deletePiecework: (id: number) =>
    httpClient.delete(`/piecework-compensations/${id}`),
}
