import { ArrowRight, Check, Wrench } from 'lucide-react'
import { SERVICES_DATA } from '../data/portalData'

interface Props {
  onOpenQuote: (serviceName?: string) => void
}

export default function ServicesSection({ onOpenQuote }: Props) {
  return (
    <section id="dich-vu" className="portal-section" style={{ background: '#171A1D' }}>
      <div className="portal-container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
          <div className="portal-badge">
            <Wrench size={14} />
            <span>Năng Lực Sản Xuất Cốt Lõi</span>
          </div>
          <h2 className="portal-section-title">
            DỊCH VỤ GIA CÔNG & THI CÔNG TRỌN GÓI
          </h2>
          <p className="portal-section-desc" style={{ margin: '12px auto 0' }}>
            Hệ thống dây chuyền máy móc hiện đại và đội ngũ kỹ thuật lành nghề đáp ứng mọi tiêu chuẩn khắt khe nhất của ngành xây dựng & kiến trúc.
          </p>
        </div>

        {/* 4 Large Service Cards */}
        <div className="portal-grid-4">
          {SERVICES_DATA.map((srv) => (
            <div
              key={srv.id}
              className="portal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              {/* Image with overlay tag */}
              <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                <img
                  src={srv.image}
                  alt={srv.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  className="portal-card-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #22272C 0%, transparent 60%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(23, 26, 29, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(242, 140, 40, 0.4)',
                    color: 'var(--portal-orange)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {srv.tagline}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
                  {srv.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--portal-orange)', fontWeight: 600, marginBottom: 12 }}>
                  {srv.subtitle}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--portal-text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {srv.description}
                </p>

                {/* Sub-items list */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
                  {srv.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--portal-text-secondary)' }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: 'rgba(242, 140, 40, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--portal-orange)',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={11} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => onOpenQuote(srv.title)}
                  className="btn-portal-secondary"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: 13.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span>Báo Giá Hạng Mục Này</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .portal-card:hover .portal-card-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  )
}
