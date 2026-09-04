import { useState } from 'react'
import { Eye, Layers, ShieldCheck, Sparkles } from 'lucide-react'
import { PRODUCTS_DATA } from '../data/portalData'
import type { ProductItem } from '../data/portalData'

interface Props {
  onSelectProduct: (product: ProductItem) => void
  onOpenQuote: (category?: string) => void
}

export default function ProductsSection({ onSelectProduct, onOpenQuote }: Props) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sat' | 'inox' | 'nhom-kinh' | 'co-khi'>('all')

  const filterTabs = [
    { key: 'all', label: 'TẤT CẢ' },
    { key: 'sat', label: 'GIA CÔNG SẮT' },
    { key: 'inox', label: 'GIA CÔNG INOX' },
    { key: 'nhom-kinh', label: 'NHÔM KÍNH' },
    { key: 'co-khi', label: 'CƠ KHÍ CNC' },
  ]

  const filteredProducts =
    activeFilter === 'all'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.category === activeFilter)

  return (
    <section id="san-pham" className="portal-section" style={{ background: '#1B1F23' }}>
      <div className="portal-container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <div className="portal-badge">
            <Sparkles size={14} />
            <span>Sản Phẩm & Mẫu Gia Công Tiêu Biểu</span>
          </div>
          <h2 className="portal-section-title">
            DANH MỤC SẢN PHẨM HOÀN THIỆN
          </h2>
          <p className="portal-section-desc" style={{ margin: '12px auto 0' }}>
            Tổng hợp các mẫu cửa, cổng, lan can, cầu thang và sản phẩm cơ khí tinh xảo được chế tạo trực tiếp từ xưởng.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 44,
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid var(--portal-orange)' : '1px solid var(--portal-border)',
                  background: isActive
                    ? 'linear-gradient(135deg, #F28C28 0%, #E67710 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#171A1D' : 'var(--portal-text-secondary)',
                  boxShadow: isActive ? '0 4px 14px var(--portal-orange-glow)' : 'none',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="portal-grid-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="portal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                <img
                  src={p.image}
                  alt={p.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
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
                {/* Category tag */}
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(23, 26, 29, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--portal-border)',
                    color: 'var(--portal-orange)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  {p.categoryName}
                </span>

                {/* Warranty tag */}
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#4ade80',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>BH {p.warranty}</span>
                </span>
              </div>

              {/* Product Info */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.3 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--portal-text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                  {p.description}
                </p>

                {/* Material snippet */}
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--portal-text-secondary)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 18,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <strong style={{ color: 'var(--portal-orange)' }}>Vật liệu: </strong>
                  {p.material.length > 55 ? `${p.material.slice(0, 55)}...` : p.material}
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="btn-portal-secondary"
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: 13,
                    }}
                  >
                    <Eye size={15} />
                    <span>Xem Chi Tiết</span>
                  </button>

                  <button
                    onClick={() => onOpenQuote(p.title)}
                    className="btn-portal-primary"
                    style={{
                      padding: '10px 16px',
                      fontSize: 13,
                    }}
                  >
                    <span>Báo Giá</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
