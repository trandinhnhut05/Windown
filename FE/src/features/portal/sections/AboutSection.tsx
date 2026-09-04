import { CheckCircle2, ShieldCheck, Factory, Award } from 'lucide-react'
import { STATS_DATA, CORE_COMMITMENTS } from '../data/portalData'

interface Props {
  onOpenQuote: () => void
}

export default function AboutSection({ onOpenQuote }: Props) {
  return (
    <section id="gioi-thieu" className="portal-section" style={{ background: '#1B1F23' }}>
      <div className="portal-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 50,
            alignItems: 'center',
          }}
          className="portal-grid-2"
        >
          {/* Left Column: Workshop & Team Imagery */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--portal-border)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                height: 480,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                alt="Đội ngũ kỹ sư và công nhân gia công cơ khí"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(23, 26, 29, 0.9) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: 24,
                  right: 24,
                  background: 'rgba(31, 35, 39, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(242, 140, 40, 0.3)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    background: 'rgba(242, 140, 40, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--portal-orange)',
                    flexShrink: 0,
                  }}
                >
                  <Factory size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                    Quy Mô Xưởng Sản Xuất 2.500m²
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--portal-text-muted)', marginTop: 2 }}>
                    Trang bị máy cắt Fiber Laser 6000W, máy chấn bẻ CNC & máy hàn laser
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                background: 'linear-gradient(135deg, #F28C28 0%, #E67710 100%)',
                color: '#171A1D',
                padding: '14px 20px',
                borderRadius: 16,
                fontWeight: 800,
                boxShadow: '0 12px 28px -4px var(--portal-orange-glow)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
              className="portal-floating-badge"
            >
              <Award size={24} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>10+ NĂM</div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Kinh Nghiệm Cơ Khí
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div>
            <div className="portal-badge">
              <ShieldCheck size={14} />
              <span>Năng Lực & Uy Tín Doanh Nghiệp</span>
            </div>

            <h2 className="portal-section-title">
              CƠ KHÍ TỔNG HỢP – <br />
              <span style={{ color: 'var(--portal-orange)' }}>GIẢI PHÁP CHO MỌI CÔNG TRÌNH</span>
            </h2>

            <p style={{ fontSize: 15.5, color: 'var(--portal-text-secondary)', lineHeight: 1.7, marginTop: 16 }}>
              Với hơn 10 năm kinh nghiệm trong ngành chế tạo và thi công kim loại kiến trúc, chúng tôi tự hào là đối tác tin cậy của hàng trăm nhà thầu, kiến trúc sư và gia chủ. Chúng tôi làm chủ công nghệ gia công CNC sắt, inox chống ăn mòn và nhôm kính cao cấp, biến mọi ý tưởng thiết kế phức tạp thành hiện thực vững chắc.
            </p>

            {/* 6 Commitments List */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px 20px',
                marginTop: 26,
              }}
              className="portal-commitments-grid"
            >
              {CORE_COMMITMENTS.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ color: 'var(--portal-orange)', marginTop: 2, flexShrink: 0 }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--portal-text-muted)', lineHeight: 1.5, marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <button onClick={onOpenQuote} className="btn-portal-primary">
                <span>Khảo Sát & Nhận Tư Vấn Miễn Phí</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Counter Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            marginTop: 64,
            padding: '30px 24px',
            background: 'linear-gradient(135deg, #22272C 0%, #1A1D20 100%)',
            border: '1px solid var(--portal-border)',
            borderRadius: 18,
          }}
          className="portal-stats-grid"
        >
          {STATS_DATA.map((st, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '0 12px',
                borderRight: i < 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              }}
              className="portal-stat-col"
            >
              <div
                style={{
                  fontSize: 'clamp(32px, 3.5vw, 44px)',
                  fontWeight: 900,
                  color: 'var(--portal-orange)',
                  letterSpacing: '-1px',
                  lineHeight: 1,
                }}
              >
                {st.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginTop: 8 }}>
                {st.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--portal-text-muted)', marginTop: 4 }}>
                {st.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portal-commitments-grid {
            grid-template-columns: 1fr !important;
          }
          .portal-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .portal-stat-col {
            border-right: none !important;
            margin-bottom: 16px;
          }
          .portal-floating-badge {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
