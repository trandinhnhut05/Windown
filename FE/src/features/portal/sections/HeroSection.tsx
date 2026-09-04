import { ArrowRight, ShieldCheck, CheckCircle, Sparkles, Award } from 'lucide-react'

interface Props {
  onOpenQuote: () => void
}

export default function HeroSection({ onOpenQuote }: Props) {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '100px 0 80px',
      }}
    >
      {/* Background Industrial Image with Dark Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85"
          alt="Xưởng cơ khí sắt inox nhôm kính cao cấp"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.28) contrast(1.15)',
          }}
        />
        {/* Radial Dark Gradient Overlay for optimal readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 30% 40%, rgba(23, 26, 29, 0.4) 0%, rgba(23, 26, 29, 0.95) 75%), linear-gradient(to top, #171A1D 0%, transparent 60%)',
          }}
        />
        {/* Subtle Orange Arc Light Flare */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: 320,
            height: 320,
            background: 'radial-gradient(circle, rgba(242, 140, 40, 0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="portal-container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ maxWidth: 860 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 100,
              background: 'rgba(242, 140, 40, 0.14)',
              border: '1px solid rgba(242, 140, 40, 0.4)',
              color: 'var(--portal-orange)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            <Sparkles size={15} />
            <span>XƯỞNG CƠ KHÍ CHẾ TẠO & THI CÔNG TRỰC TIẾP</span>
          </div>

          {/* Headline Lớn */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              margin: '0 0 16px',
              textTransform: 'uppercase',
            }}
          >
            GIẢI PHÁP CƠ KHÍ <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #F28C28 0%, #ffb169 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TỔNG HỢP CAO CẤP
            </span>
          </h1>

          {/* Headline Phụ */}
          <div
            style={{
              fontSize: 'clamp(20px, 3vw, 32px)',
              fontWeight: 800,
              color: 'var(--portal-text-secondary)',
              letterSpacing: '3px',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            SẮT <span style={{ color: 'var(--portal-orange)' }}>•</span> INOX{' '}
            <span style={{ color: 'var(--portal-orange)' }}>•</span> NHÔM KÍNH
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: 'var(--portal-text-secondary)',
              lineHeight: 1.7,
              maxWidth: 680,
              marginBottom: 36,
            }}
          >
            Chuyên gia công, sản xuất và thi công các sản phẩm cơ khí theo yêu cầu cho nhà ở,
            doanh nghiệp và công trình xây dựng. Năng lực gia công laser CNC chính xác cao,
            đo đạc tận nơi và cam kết tiến độ.
          </p>

          {/* Dual CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={onOpenQuote}
              className="btn-portal-primary"
              style={{
                fontSize: 16,
                padding: '16px 36px',
                letterSpacing: '0.5px',
              }}
            >
              <span>NHẬN BÁO GIÁ</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handleScrollTo('du-an')}
              className="btn-portal-secondary"
              style={{
                fontSize: 16,
                padding: '16px 32px',
              }}
            >
              <span>XEM CÔNG TRÌNH</span>
            </button>
          </div>

          {/* 3 Core Trust Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              marginTop: 54,
              paddingTop: 30,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#ffffff', fontWeight: 600 }}>
              <div style={{ color: 'var(--portal-orange)' }}>
                <CheckCircle size={18} />
              </div>
              <span>Sản xuất trực tiếp tại xưởng</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#ffffff', fontWeight: 600 }}>
              <div style={{ color: 'var(--portal-orange)' }}>
                <ShieldCheck size={18} />
              </div>
              <span>Đo đạc laser & khảo sát tận nơi</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#ffffff', fontWeight: 600 }}>
              <div style={{ color: 'var(--portal-orange)' }}>
                <Award size={18} />
              </div>
              <span>Bảo hành kết cấu đến 5 năm</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
