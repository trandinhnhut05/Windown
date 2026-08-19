import httpClient from '@/shared/api/httpClient'

export interface Payroll {
  workerId: number
  workerName: string
  dailyWage: number
  presentDays: number
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

export const payrollApi = {
  getMonthly: (params: { year: number; month: number }) =>
    httpClient.get<Payroll[]>('/payroll', { params }).then((r) => r.data),

  getAdvances: (workerId: number) =>
    httpClient.get<SalaryAdvance[]>(`/workers/${workerId}/advances`).then((r) => r.data),

  addAdvance: (workerId: number, data: { amount: number; advanceDate: string; note?: string }) =>
    httpClient.post<SalaryAdvance>(`/workers/${workerId}/advances`, data).then((r) => r.data),

  deleteAdvance: (id: number) =>
    httpClient.delete(`/salary-advances/${id}`),
}
