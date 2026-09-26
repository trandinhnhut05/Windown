import httpClient from '@/shared/api/httpClient'

export interface ProjectDrawing {
  id: number
  projectId: number
  fileName: string
  fileType: string
  uploadedAt: string
}

export const projectDrawingApi = {
  getDrawings: (projectId: number) =>
    httpClient.get<ProjectDrawing[]>(`/projects/${projectId}/drawings`).then((r) => r.data),

  uploadDrawing: (projectId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post<ProjectDrawing>(`/projects/${projectId}/drawings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((r) => r.data)
  },

  deleteDrawing: (id: number) =>
    httpClient.delete(`/projects/drawings/${id}`),

  getFileUrl: (id: number) => `/api/projects/drawings/${id}/file`,
}
