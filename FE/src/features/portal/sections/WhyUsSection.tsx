import { Users, Cpu, Factory, Clock, ShieldCheck, Wrench, Sparkles } from 'lucide-react'
import { WHY_CHOOSE_US } from '../data/portalData'

const ICON_MAP: Record<string, any> = {
  Users,
  Cpu,
  Factory,
  Clock,
  ShieldCheck,
  Wrench,
}

export default function WhyUsSection() {
  return (
    <section id="uu-the" className="portal-section" style={{ background: '#171A1D' }}>
      <div className="portal-container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
          <div className="portal-badge">
            <Sparkles size={14} />
            <span>Cam Kết Vàng Từ Nhà Sản Xuất</span>
          </div>
          <h2 className="portal-section-title">
            VÌ SAO KHÁCH HÀNG TIN CHỌN CHÚNG TÔI
          </h2>
          <p className="portal-section-desc" style={{ margin: '12px auto 0' }}>
            Kết hợp giữa năng lực cơ khí chính xác, sự tận tâm của đội ngũ kỹ sư và uy tín thương hiệu đã được khẳng định qua hơn 500 công trình thực tế.
          </p>
        </div>

        {/* 6 Advantage Cards Grid */}
        <div className="portal-grid-3">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || ShieldCheck
            return (
              <div
                key={idx}
                className="portal-card"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(242, 140, 40, 0.2) 0%, rgba(242, 140, 40, 0.05) 100%)',
                    border: '1px solid rgba(242, 140, 40, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--portal-orange)',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px -2px var(--portal-orange-glow)',
                  }}
                >
                  <IconComponent size={24} />
                </div>

                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--portal-text-muted)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
