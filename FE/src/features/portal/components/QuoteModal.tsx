import React, { useState } from 'react'
import { X, Send, CheckCircle2, Upload, Phone, ShieldAlert, Sparkles } from 'lucide-react'
import { COMPANY_INFO } from '../data/portalData'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
}

export default function QuoteModal({ isOpen, onClose, initialCategory }: Props) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState(initialCategory || 'SẮT')
  const [dimensions, setDimensions] = useState('')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 800)
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setFullName('')
    setPhone('')
    setEmail('')
    setDimensions('')
    setNotes('')
    setFileName('')
    onClose()
  }

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 1100,
        background: 'rgba(15, 18, 22, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={(e) => e.target === e.currentTarget && handleResetAndClose()}
    >
      <div
        className="modal"
        style={{
          maxWidth: 640,
          background: '#1A1E23',
          border: '1px solid rgba(242, 140, 40, 0.4)',
          borderRadius: 20,
          color: '#F5F5F5',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 25px -5px var(--portal-orange-glow)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #22272D 0%, #1A1E23 100%)',
            borderBottom: '1px solid var(--portal-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--portal-orange)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 4,
              }}
            >
              <Sparkles size={14} />
              <span>Báo Giá Nhanh Trong 15 Phút</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
              NHẬN TƯ VẤN & BÁO GIÁ NHANH
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="btn-close"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
              Gửi Yêu Cầu Báo Giá Thành Công!
            </h4>
            <p style={{ fontSize: 14, color: 'var(--portal-text-secondary)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 24px' }}>
              Cảm ơn quý khách <strong>{fullName}</strong>. Kỹ sư xưởng cơ khí sẽ phân tích kích thước/bản vẽ và liên hệ số điện thoại{' '}
              <strong style={{ color: 'var(--portal-orange)' }}>{phone}</strong> trong vòng <strong>15 phút</strong> để gửi bảng dự toán chi tiết.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="btn-portal-primary"
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                <Phone size={16} />
                <span>Gọi kỹ sư: {COMPANY_INFO.hotlineDisplay}</span>
              </a>
              <button
                onClick={handleResetAndClose}
                className="btn-portal-secondary"
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Row 1: Họ tên + SĐT */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                    Họ và tên <span style={{ color: 'var(--portal-orange)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Anh Tuấn, Chị Mai..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      background: '#22272D',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                    Số điện thoại / Zalo <span style={{ color: 'var(--portal-orange)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      background: '#22272D',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Email + Hạng mục */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                    Email nhận báo giá
                  </label>
                  <input
                    type="email"
                    placeholder="khachhang@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: '#22272D',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                    Hạng mục cần gia công <span style={{ color: 'var(--portal-orange)' }}>*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      background: '#22272D',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  >
                    <option value="SẮT">Cơ khí Sắt (Cổng, Cửa, Cầu thang, Mái)</option>
                    <option value="INOX">Gia công Inox 304 (Lan can, Cầu thang, Kệ)</option>
                    <option value="NHÔM KÍNH">Nhôm Kính (Xingfa, Slim, Vách kính, Mặt dựng)</option>
                    <option value="CƠ KHÍ CNC">Gia công cắt Laser, Chấn bẻ theo bản vẽ</option>
                    <option value="TRỌN GÓI">Thi công trọn gói công trình</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Kích thước dự kiến */}
              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                  Kích thước / Khối lượng dự kiến
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Rộng 3.6m x Cao 2.8m, hoặc khoảng 45m²..."
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  style={{
                    background: '#22272D',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Row 4: Upload file bản vẽ / hình ảnh */}
              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                  Đính kèm bản vẽ hoặc hình ảnh hiện trạng (nếu có)
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '12px',
                    border: '1.5px dashed rgba(242, 140, 40, 0.4)',
                    borderRadius: 8,
                    background: 'rgba(242, 140, 40, 0.04)',
                    cursor: 'pointer',
                    color: 'var(--portal-text-secondary)',
                    fontSize: 13,
                  }}
                >
                  <Upload size={18} color="var(--portal-orange)" />
                  <span>
                    {fileName ? (
                      <strong style={{ color: 'var(--portal-orange)' }}>{fileName}</strong>
                    ) : (
                      'Bấm để tải lên ảnh mặt bằng, bản vẽ PDF/DWG hoặc ảnh mẫu'
                    )}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.dwg,.dxf"
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Row 5: Nội dung yêu cầu */}
              <div className="form-group">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)' }}>
                  Nội dung mô tả yêu cầu kỹ thuật
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả cụ thể độ dày vật tư, màu sơn, vị trí lắp đặt, tiến độ mong muốn..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    background: '#22272D',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: 13.5,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Security guarantee note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: 'var(--portal-text-muted)',
                }}
              >
                <ShieldAlert size={14} color="#22c55e" />
                <span>Cam kết bảo mật thông tin 100% • Khảo sát & Báo giá hoàn toàn miễn phí</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-portal-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 15,
                  marginTop: 6,
                }}
              >
                {isSubmitting ? (
                  <span>Đang xử lý yêu cầu...</span>
                ) : (
                  <>
                    <span>GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
