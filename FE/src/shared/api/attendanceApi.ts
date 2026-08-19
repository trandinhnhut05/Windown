import httpClient from '@/shared/api/httpClient'

export interface Attendance {
  id?: number
  workerId: number
  workerName: string
  workDate: string
  isPresent: boolean
  note: string
}

export interface AttendanceRequest {
  workerId: number
  isPresent: boolean
  note?: string
}

export interface BulkAttendanceRequest {
  workDate: string
  checkIns: AttendanceRequest[]
}

export const attendanceApi = {
  getBetween: (start: string, end: string) =>
    httpClient.get<Attendance[]>('/attendance', { params: { start, end } }).then((r) => r.data),

  getByDate: (date: string) =>
    httpClient.get<Attendance[]>('/attendance/day', { params: { date } }).then((r) => r.data),

  saveBulk: (data: BulkAttendanceRequest) =>
    httpClient.post<Attendance[]>('/attendance/bulk', data).then((r) => r.data),
}
