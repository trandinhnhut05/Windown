import {
  FileSearch,
  Ruler,
  Calculator,
  Hammer,
  Truck,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { WORK_PROCESS } from '../data/portalData'

const STEP_ICONS = [
  FileSearch,
  Ruler,
  Calculator,
  Hammer,
  Truck,
  ShieldCheck,
]

export default function ProcessSection() {
  return (
    <section id="quy-trinh" className="portal-section" style={{ background: '#1B1F23' }}>
      <div className="portal-container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
          <div className="portal-badge">
            <Workflow size={14} />
            <span>Tiêu Chuẩn Thi Công Chuyên Nghiệp</span>
          </div>
          <h2 className="portal-section-title">
            QUY TRÌNH LÀM VIỆC 6 BƯỚC CHUẨN XÁC
          </h2>
          <p className="portal-section-desc" style={{ margin: '12px auto 0' }}>
            Quy trình chuẩn hóa từ khâu tiếp nhận ý tưởng đến nghiệm thu bàn giao, đảm bảo chất lượng kỹ thuật và tối ưu ngân sách cho khách hàng.
          </p>
        </div>

        {/* 6-step timeline cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 16,
            position: 'relative',
          }}
          className="portal-process-grid"
        >
          {WORK_PROCESS.map((item, idx) => {
            const IconComponent = STEP_ICONS[idx] || Hammer
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--portal-bg-card)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 16,
                  padding: '22px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                className="portal-process-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--portal-orange)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--portal-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Step number badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: 'var(--portal-orange)',
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'rgba(242, 140, 40, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--portal-orange)',
                    }}
                  >
                    <IconComponent size={18} />
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--portal-text-muted)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .portal-process-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .portal-process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
