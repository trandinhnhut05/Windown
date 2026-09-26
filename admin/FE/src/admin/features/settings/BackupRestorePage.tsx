import { useState } from 'react'
import { Download, Upload, ShieldAlert, CheckCircle, Database } from 'lucide-react'
import { backupApi } from '@/shared/api/backupApi'
import ConfirmModal from '@/shared/components/ConfirmModal'

export default function BackupRestorePage() {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Dialog confirmation states
  const [showConfirmRestore, setShowConfirmRestore] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' })

  const handleExport = async () => {
    setExporting(true)
    setStatusMessage({ text: '', type: '' })
    try {
      const data = await backupApi.exportBackup()
      
      // Create and download file
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').substring(0, 19)
      link.href = url
      link.download = `windown_backup_${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setStatusMessage({ text: 'Tải file sao lưu cơ sở dữ liệu thành công!', type: 'success' })
    } catch (err: any) {
      console.error(err)
      setStatusMessage({ text: 'Lỗi xuất sao lưu dữ liệu!', type: 'error' })
    } finally {
      setExporting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const triggerRestorePrompt = () => {
    if (!selectedFile) {
      alert('Vui lòng chọn tệp tin JSON trước!')
      return
    }
    setShowConfirmRestore(true)
  }

  const handleRestore = async () => {
    if (!selectedFile) return
    setImporting(true)
    setShowConfirmRestore(false)
    setStatusMessage({ text: '', type: '' })

    try {
      const fileText = await selectedFile.text()
      const parsedData = JSON.parse(fileText)

      // Basic validation checks
      if (!parsedData.users || !parsedData.projects || !parsedData.workers) {
        throw new Error('Tệp sao lưu không hợp lệ. Phải chứa danh sách users, projects và workers.')
      }

      await backupApi.importRestore(parsedData)
      setStatusMessage({ text: 'Khôi phục toàn bộ cơ sở dữ liệu thành công! Trình duyệt sẽ tải lại trang.', type: 'success' })
      
      // Auto-reload window after 3 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } catch (err: any) {
      console.error(err)
      setStatusMessage({ text: err.message || 'Lỗi khôi phục tệp dữ liệu!', type: 'error' })
    } finally {
      setImporting(false)
      setSelectedFile(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>⚙️ Thiết lập & Sao lưu</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
          Sao lưu toàn bộ cơ sở dữ liệu hệ thống ra tệp JSON dự phòng hoặc khôi phục lại dữ liệu trước đó.
        </p>
      </div>

      {/* Backup Card */}
      <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Database size={24} color="var(--color-primary)" />
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Tải bản Sao lưu Hệ thống</h3>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          Hệ thống sẽ tổng hợp mọi thông tin bao gồm: danh sách tài khoản, công trình, vật tư chi tiết, nhật ký thanh toán, thông tin thợ xưởng, ngày chấm công, tạm ứng lương, lịch bảo hành và nhắc nhở thành một tệp tin nén JSON.
        </p>
        <button
          className="btn btn-primary"
          style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Download size={16} />}
          {exporting ? 'Đang kết xuất dữ liệu...' : 'Tải file Sao lưu (JSON)'}
        </button>
      </div>

      {/* Restore Card */}
      <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Upload size={24} color="var(--color-warning)" />
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Khôi phục Dữ liệu</h3>
        </div>
        
        {/* Warning banner */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '14px 16px',
          background: '#fff7ed',
          border: '1.5px solid #ffedd5',
          borderRadius: 'var(--radius-sm)',
          alignItems: 'flex-start',
        }}>
          <ShieldAlert size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 13, color: '#9a3412', fontWeight: 600 }}>
            CẢNH BÁO NGUY HIỂM: Quá trình khôi phục sẽ ghi đè và XÓA SẠCH toàn bộ cơ sở dữ liệu hiện tại trong hệ thống. Hãy chắc chắn bạn đã tải tệp sao lưu dự phòng trước khi khôi phục.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
            <Upload size={16} />
            Chọn file sao lưu (.json)
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {selectedFile ? `📂 ${selectedFile.name}` : 'Chưa chọn tệp'}
          </span>
        </div>

        <button
          className="btn btn-danger"
          style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
          onClick={triggerRestorePrompt}
          disabled={importing || !selectedFile}
        >
          {importing ? <span className="spinner" style={{ width: 14, height: 14, borderColor: '#fff' }} /> : null}
          Nạp & Khôi phục ngay
        </button>
      </div>

      {/* Status banner */}
      {statusMessage.text && (
        <div className={`card`} style={{
          padding: '14px 20px',
          background: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: statusMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
          fontWeight: 700,
          fontSize: 14,
          textAlign: 'center',
        }}>
          {statusMessage.text}
        </div>
      )}

      {showConfirmRestore && (
        <ConfirmModal
          title="Xác nhận Khôi phục Cơ sở Dữ liệu"
          message="Bạn có chắc chắn muốn tiến hành Ghi Đè Khôi Phục? Mọi dữ liệu hiện có sẽ biến mất vĩnh viễn và thay thế bằng dữ liệu trong tệp tin sao lưu."
          confirmLabel="Tôi đồng ý, tiếp tục"
          variant="danger"
          loading={importing}
          onConfirm={handleRestore}
          onCancel={() => { setShowConfirmRestore(false); setSelectedFile(null) }}
        />
      )}
    </div>
  )
}
