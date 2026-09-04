import React, { useState } from 'react'
import {
  Send,
  Upload,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { COMPANY_INFO } from '../data/portalData'

export default function QuoteSection() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('SẮT')
  const [dimensions, setDimensions] = useState('')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  return (
    <section id="lien-he" className="portal-section" style={{ background: '#121417' }}>
      <div className="portal-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 40,
            alignItems: 'center',
          }}
          className="portal-grid-2"
        >
          {/* Left Column: Form Nhận Báo Giá Nổi Bật */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1F2328 0%, #171A1D 100%)',
              border: '1.5px solid rgba(242, 140, 40, 0.4)',
              borderRadius: 22,
              padding: '36px 32px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 25px -8px var(--portal-orange-glow)',
            }}
          >
            <div className="portal-badge" style={{ marginBottom: 12 }}>
              <Sparkles size={14} />
              <span>Dự Toán Nhanh Miễn Phí</span>
            </div>

            <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 32px)', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
              NHẬN TƯ VẤN & BÁO GIÁ NHANH
            </h2>
            <p style={{ fontSize: 14, color: 'var(--portal-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              Để lại thông tin và quy cách công trình, kỹ sư của xưởng sẽ tính toán bóc tách khối lượng và phản hồi bảng giá chi tiết trong vòng <strong>15 phút</strong>.
            </p>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                  Yêu Cầu Của Bạn Đã Được Tiếp Nhận!
                </h4>
                <p style={{ fontSize: 14, color: 'var(--portal-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Kỹ sư phụ trách sẽ gọi lại số <strong style={{ color: 'var(--portal-orange)' }}>{phone}</strong> ngay để tư vấn phương án kỹ thuật và gửi báo giá.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-portal-secondary"
                  style={{ fontSize: 13.5 }}
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Họ tên + SĐT */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                        Họ và tên <span style={{ color: 'var(--portal-orange)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Họ tên của bạn..."
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#252B31',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 8,
                          padding: '11px 12px',
                          color: '#ffffff',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                        Số điện thoại / Zalo <span style={{ color: 'var(--portal-orange)' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#252B31',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 8,
                          padding: '11px 12px',
                          color: '#ffffff',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Email + Hạng mục */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                        Email nhận bảng dự toán
                      </label>
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#252B31',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 8,
                          padding: '11px 12px',
                          color: '#ffffff',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                        Hạng mục cần gia công <span style={{ color: 'var(--portal-orange)' }}>*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#252B31',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 8,
                          padding: '11px 12px',
                          color: '#ffffff',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      >
                        <option value="SẮT">Gia công Sắt (Cổng, Cửa, Mái, Cầu thang)</option>
                        <option value="INOX">Gia công Inox (Lan can, Cầu thang, Kệ)</option>
                        <option value="NHÔM KÍNH">Nhôm kính (Cửa Xingfa, Slim, Vách, Mặt dựng)</option>
                        <option value="CƠ KHÍ CNC">Cơ khí chính xác theo bản vẽ CAD</option>
                      </select>
                    </div>
                  </div>

                  {/* Kích thước dự kiến */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                      Kích thước dự kiến / Khối lượng thi công
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cổng 3.5m x 2.8m, Lan can 25 mét dài, hoặc 8 bộ cửa..."
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#252B31',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 8,
                        padding: '11px 12px',
                        color: '#ffffff',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Upload File */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                      Tải lên hình ảnh hiện trạng hoặc file bản vẽ
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
                          'Chọn file ảnh (.jpg, .png) hoặc tài liệu (.pdf, .dwg)'
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

                  {/* Ghi chú */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--portal-text)', display: 'block', marginBottom: 6 }}>
                      Nội dung yêu cầu chi tiết
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Yêu cầu cụ thể về chủng loại vật tư, màu sơn, tiến độ cần giao..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#252B31',
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

                  {/* CTA Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-portal-primary"
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: 15.5,
                      marginTop: 6,
                    }}
                  >
                    {isSubmitting ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <span>GỬI YÊU CẦU BÁO GIÁ</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Hotline, Map & Direct Service Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div className="portal-badge" style={{ marginBottom: 12 }}>
                <ShieldCheck size={14} />
                <span>Trực Tiếp Xưởng Sản Xuất</span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>
                SẴN SÀNG KHẢO SÁT & ĐO ĐẠC TẬN NƠI HÔM NAY
              </h3>
              <p style={{ fontSize: 15, color: 'var(--portal-text-secondary)', lineHeight: 1.7 }}>
                Quý khách có thể gửi yêu cầu trực tuyến hoặc liên hệ trực tiếp đến hotline kỹ thuật để được khảo sát thực tế công trình ngay trong ngày.
              </p>
            </div>

            {/* Direct hotline callout card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(242, 140, 40, 0.15) 0%, rgba(242, 140, 40, 0.04) 100%)',
                border: '1.5px solid var(--portal-orange)',
                borderRadius: 16,
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--portal-orange)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ĐƯỜNG DÂY NÓNG KỸ THUẬT (24/7)
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
                  {COMPANY_INFO.hotlineDisplay}
                </div>
              </div>
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="btn-portal-primary"
                style={{ padding: '12px 22px', fontSize: 14 }}
              >
                <Phone size={16} />
                <span>Gọi Trực Tiếp</span>
              </a>
            </div>

            {/* Key Service Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Khảo sát hiện trạng bằng máy đo laser hoàn toàn miễn phí',
                'Báo giá chi tiết theo từng hạng mục vật tư, không phát sinh',
                'Có hợp đồng pháp lý, hóa đơn VAT và bảo hành chính hãng',
                'Đội ngũ thợ có chứng chỉ an toàn lao động, thi công sạch sẽ',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--portal-text-secondary)' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={13} />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Location Address Details */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--portal-border)',
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: 13.5,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--portal-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Clock size={18} color="var(--portal-orange)" style={{ flexShrink: 0 }} />
                <span>{COMPANY_INFO.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
