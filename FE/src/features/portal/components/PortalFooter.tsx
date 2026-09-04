import { Hammer, Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { COMPANY_INFO, SERVICES_DATA } from '../data/portalData'

interface Props {
  onOpenQuote: () => void
}

export default function PortalFooter({ onOpenQuote }: Props) {
  return (
    <footer
      style={{
        background: '#121417',
        borderTop: '1px solid var(--portal-border)',
        color: 'var(--portal-text-secondary)',
        paddingTop: 80,
        paddingBottom: 40,
        position: 'relative',
      }}
    >
      <div className="portal-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
            gap: 40,
            paddingBottom: 60,
            borderBottom: '1px solid var(--portal-border)',
          }}
          className="portal-footer-grid"
        >
          {/* Col 1: About company */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #272C31 0%, #171A1D 100%)',
                  border: '1.5px solid var(--portal-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--portal-orange)',
                }}
              >
                <Hammer size={20} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                CƠ KHÍ <span style={{ color: 'var(--portal-orange)' }}>LUXURY</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--portal-text-muted)', marginBottom: 20 }}>
              Xưởng chuyên gia công cơ khí tổng hợp, sản xuất và lắp dựng trực tiếp các hạng mục{' '}
              <strong style={{ color: 'var(--portal-text)' }}>SẮT • INOX • NHÔM KÍNH KIẾN TRÚC</strong> cho nhà ở, biệt thự, dự án và nhà xưởng công nghiệp quy mô lớn.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontSize: 13, fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>Cam kết chất lượng • Bảo hành dài hạn đến 5 năm</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 18, textTransform: 'uppercase' }}>
              Hạng Mục Dịch Vụ
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SERVICES_DATA.map((srv) => (
                <li key={srv.id}>
                  <a
                    href="#dich-vu"
                    style={{
                      color: 'var(--portal-text-secondary)',
                      textDecoration: 'none',
                      fontSize: 14,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--portal-orange)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}
                  >
                    {srv.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#quy-trinh"
                  style={{
                    color: 'var(--portal-text-secondary)',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--portal-orange)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}
                >
                  Quy trình 6 bước gia công
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 18, textTransform: 'uppercase' }}>
              Liên Kết Nhanh
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <a href="#gioi-thieu" style={{ color: 'var(--portal-text-secondary)', textDecoration: 'none', fontSize: 14 }}>
                  Về chúng tôi (Năng lực xưởng)
                </a>
              </li>
              <li>
                <a href="#san-pham" style={{ color: 'var(--portal-text-secondary)', textDecoration: 'none', fontSize: 14 }}>
                  Mẫu sản phẩm thực tế
                </a>
              </li>
              <li>
                <a href="#du-an" style={{ color: 'var(--portal-text-secondary)', textDecoration: 'none', fontSize: 14 }}>
                  Dự án & Công trình đã bàn giao
                </a>
              </li>
              <li>
                <a href="#uu-the" style={{ color: 'var(--portal-text-secondary)', textDecoration: 'none', fontSize: 14 }}>
                  Vì sao khách hàng tin chọn
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenQuote}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--portal-orange)',
                    fontWeight: 700,
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>Báo giá dự toán nhanh</span>
                  <ArrowUpRight size={14} />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Workshop Location */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 18, textTransform: 'uppercase' }}>
              Thông Tin Liên Hệ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--portal-orange)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>
                  <strong>Trụ sở & Xưởng Hà Nội:</strong> {COMPANY_INFO.address}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--portal-orange)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>
                  <strong>Chi nhánh TP.HCM:</strong> {COMPANY_INFO.addressHcm}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Phone size={18} color="var(--portal-orange)" style={{ flexShrink: 0 }} />
                <span>
                  Hotline / Zalo: <strong style={{ color: '#ffffff' }}>{COMPANY_INFO.hotlineDisplay}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Mail size={18} color="var(--portal-orange)" style={{ flexShrink: 0 }} />
                <span>{COMPANY_INFO.email}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Clock size={18} color="var(--portal-orange)" style={{ flexShrink: 0 }} />
                <span>{COMPANY_INFO.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 13,
            color: 'var(--portal-text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Mã số thuế: {COMPANY_INFO.taxCode}. Bảo lưu mọi quyền.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Phong cách: Industrial Premium</span>
            <span>Chuẩn SEO Schema.org LocalBusiness</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .portal-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .portal-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
