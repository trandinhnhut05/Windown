import httpClient from '@/shared/api/httpClient'

export type ReminderType = 'DELIVERY' | 'PAYMENT' | 'WARRANTY' | 'OTHER'

export interface Reminder {
  id: number
  title: string
  remindAt: string
  type: ReminderType
  isDone: boolean
  projectId?: number | null
  projectName?: string | null
  note?: string
  createdAt?: string
}

export interface ReminderRequest {
  title: string
  remindAt: string
  type?: ReminderType
  isDone?: boolean
  projectId?: number | null
  note?: string
}

export const reminderApi = {
  getAll: () =>
    httpClient.get<Reminder[]>('/reminders').then((r) => r.data),

  getPending: () =>
    httpClient.get<Reminder[]>('/reminders/pending').then((r) => r.data),

  create: (data: ReminderRequest) =>
    httpClient.post<Reminder>('/reminders', data).then((r) => r.data),

  update: (id: number, data: ReminderRequest) =>
    httpClient.put<Reminder>(`/reminders/${id}`, data).then((r) => r.data),

  toggleDone: (id: number) =>
    httpClient.patch<Reminder>(`/reminders/${id}/toggle`).then((r) => r.data),

  delete: (id: number) =>
    httpClient.delete(`/reminders/${id}`),
}
