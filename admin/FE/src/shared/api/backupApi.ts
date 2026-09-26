import httpClient from '@/shared/api/httpClient'

export const backupApi = {
  exportBackup: () =>
    httpClient.get<any>('/backup-restore/export').then((r) => r.data),

  importRestore: (data: any) =>
    httpClient.post<void>('/backup-restore/import', data).then((r) => r.data),
}
