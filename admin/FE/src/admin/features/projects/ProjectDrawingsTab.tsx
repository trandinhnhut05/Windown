import { useEffect, useState } from 'react'
import { FileText, Image as ImageIcon, Plus, Trash2, X, Download } from 'lucide-react'
import { projectDrawingApi } from '@/shared/api/projectDrawingApi'
import type { ProjectDrawing } from '@/shared/api/projectDrawingApi'
import { formatDate } from '@/shared/utils/format'

interface Props {
  projectId: number
}

export default function ProjectDrawingsTab({ projectId }: Props) {
  const [drawings, setDrawings] = useState<ProjectDrawing[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const loadDrawings = async () => {
    setLoading(true)
    try {
      const data = await projectDrawingApi.getDrawings(projectId)
      setDrawings(data)
    } catch (err) {
      console.error('Không thể tải danh sách bản vẽ', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDrawings()
  }, [projectId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)
    try {
      await projectDrawingApi.uploadDrawing(projectId, file)
      loadDrawings()
    } catch (err) {
      alert('Không thể tải bản vẽ lên máy chủ!')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bản vẽ/tài liệu này?')) return
    try {
      await projectDrawingApi.deleteDrawing(id)
      loadDrawings()
    } catch (err) {
      alert('Không thể xóa bản vẽ!')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Upload and Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>🎨 Bản vẽ & Tài liệu kỹ thuật</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
            Đính kèm các bản vẽ mặt cắt nhôm, hình ảnh khảo sát hoặc tài liệu PDF kích thước thông thủy.
          </p>
        </div>
        <div>
          <label className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: 0 }}>
            {uploading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Plus size={16} />}
            {uploading ? 'Đang tải lên...' : 'Tải lên Bản vẽ/PDF'}
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Drawings Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <span className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : drawings.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 0', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-muted)', background: 'var(--color-bg)'
        }}>
          <ImageIcon size={44} />
          <h3 style={{ marginTop: 12, fontSize: 15, fontWeight: 700 }}>Chưa có bản vẽ nào</h3>
          <p style={{ fontSize: 13, marginTop: 4 }}>Hãy tải lên bản vẽ kỹ thuật (.jpg, .png) hoặc tệp .pdf để thợ xem sản xuất.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {drawings.map((d) => {
            const isImage = d.fileType.startsWith('image/')
            const fileUrl = projectDrawingApi.getFileUrl(d.id)

            return (
              <div key={d.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 240, position: 'relative', border: '1.5px solid var(--color-border)' }}>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(d.id)}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: 100,
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  title="Xóa tệp"
                >
                  <Trash2 size={13} color="var(--color-danger)" />
                </button>

                {/* Preview block */}
                <div style={{ flex: 1, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid var(--color-border-light)' }}>
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={d.fileName}
                      onClick={() => setPreviewImage(fileUrl)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                    />
                  ) : (
                    <a href={fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--color-danger)' }}>
                      <FileText size={48} />
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Tài liệu PDF</span>
                    </a>
                  )}
                </div>

                {/* Info Footer */}
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={d.fileName}
                  >
                    {d.fileName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    <span>{formatDate(d.uploadedAt)}</span>
                    <a
                      href={fileUrl}
                      download={d.fileName}
                      style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}
                    >
                      <Download size={11} /> Tải về
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full scale image modal preview */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)} style={{ zIndex: 1000 }}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute', top: -40, right: 0,
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700
              }}
            >
              <X size={20} /> Đóng
            </button>
            <img src={previewImage} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      )}
    </div>
  )
}
