import { Phone, MessageSquare, FileText } from 'lucide-react'
import { COMPANY_INFO } from '../data/portalData'

interface Props {
  onOpenQuote: () => void
}

export default function MobileBottomBar({ onOpenQuote }: Props) {
  return (
    <div
      className="portal-mobile-bottom-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 990,
        background: 'rgba(23, 26, 29, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(242, 140, 40, 0.3)',
        display: 'none',
        gridTemplateColumns: '1fr 1fr 1.3fr',
        gap: 8,
        padding: '10px 12px 14px',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Call Hotline */}
      <a
        href={`tel:${COMPANY_INFO.hotline}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '8px 4px',
          borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <Phone size={18} color="#22c55e" />
        <span>GỌI NGAY</span>
      </a>

      {/* Chat Zalo */}
      <a
        href={`https://zalo.me/${COMPANY_INFO.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '8px 4px',
          borderRadius: 8,
          background: 'rgba(0, 136, 255, 0.12)',
          border: '1px solid rgba(0, 136, 255, 0.25)',
          color: '#38bdf8',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <MessageSquare size={18} />
        <span>CHAT ZALO</span>
      </a>

      {/* Nhận báo giá */}
      <button
        onClick={onOpenQuote}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '8px 8px',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #F28C28 0%, #E67710 100%)',
          color: '#171A1D',
          border: 'none',
          fontSize: 12.5,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 12px var(--portal-orange-glow)',
        }}
      >
        <FileText size={17} />
        <span>BÁO GIÁ</span>
      </button>

      <style>{`
        @media (max-width: 768px) {
          .portal-mobile-bottom-bar {
            display: grid !important;
          }
        }
      `}</style>
    </div>
  )
}
