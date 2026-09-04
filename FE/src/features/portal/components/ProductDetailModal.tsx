import { X, ShieldCheck, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import type { ProductItem } from '../data/portalData'
import { COMPANY_INFO } from '../data/portalData'

interface Props {
  product: ProductItem | null
  onClose: () => void
  onOpenQuote: (category?: string) => void
}

export default function ProductDetailModal({ product, onClose, onOpenQuote }: Props) {
  if (!product) return null

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 1100,
        background: 'rgba(15, 18, 22, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal modal-lg"
        style={{
          maxWidth: 860,
          background: '#1A1E23',
          border: '1px solid rgba(242, 140, 40, 0.3)',
          borderRadius: 20,
          color: '#F5F5F5',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={onClose}
            className="btn-close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 24,
            padding: 24,
          }}
          className="portal-modal-grid"
        >
          {/* Image */}
          <div style={{ borderRadius: 14, overflow: 'hidden', height: 380 }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--portal-orange)',
                  letterSpacing: '1px',
                }}
              >
                {product.categoryName}
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '6px 0 14px' }}>
                {product.title}
              </h3>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 13, color: 'var(--portal-text-muted)', marginBottom: 4 }}>
                  VẬT LIỆU CHÍNH:
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>
                  {product.material}
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'var(--portal-text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {product.description}
              </p>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                  ĐẶC ĐIỂM NỔI BẬT:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {product.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                      <CheckCircle size={15} color="#22c55e" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Bảo hành chính hãng: {product.warranty}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => {
                  onClose()
                  onOpenQuote(product.categoryName)
                }}
                className="btn-portal-primary"
                style={{ flex: 1 }}
              >
                <span>Nhận Báo Giá Mẫu Này</span>
                <ArrowRight size={16} />
              </button>
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="btn-portal-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Phone size={16} />
                <span>Tư Vấn</span>
              </a>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .portal-modal-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
