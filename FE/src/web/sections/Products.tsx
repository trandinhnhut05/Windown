import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Shield, Sparkles, ArrowRight, Eye, Phone } from 'lucide-react'
import { PRODUCTS_LIST } from '../data/mockData'
import type { Product } from '../types'
import useIntersection from '../hooks/useIntersection'

interface ProductsProps {
  onSelectProduct?: (product: Product) => void
}

export default function Products({ onSelectProduct }: ProductsProps) {
  const [activeTab, setActiveTab] = useState<string>('tat-ca')
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null)
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const tabs = [
    { id: 'tat-ca', label: 'TẤT CẢ SẢN PHẨM' },
    { id: 'sat', label: 'SẮT CNC & NGHỆ THUẬT' },
    { id: 'inox', label: 'INOX 304 CAO CẤP' },
    { id: 'nhom-kinh', label: 'CỬA NHÔM XINGFA & SLIM' },
    { id: 'mai-kinh', label: 'MÁI KÍNH & MÁI CHE' },
  ]

  const filteredProducts =
    activeTab === 'tat-ca'
      ? PRODUCTS_LIST
      : PRODUCTS_LIST.filter((p) => p.category === activeTab)

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product)
    } else {
      setSelectedModalProduct(product)
    }
  }

  return (
    <section
      ref={ref}
      id="san-pham-tieu-bieu"
      aria-labelledby="products-heading"
      className="py-20 lg:py-28 bg-[#171A1D] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter Tabs */}
        <div className={`fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E2124] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>SẢN PHẨM GIA CÔNG TRỰC TIẾP</span>
              </div>
              <h2
                id="products-heading"
                className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
              >
                DANH MỤC SẢN PHẨM ĐIỂN HÌNH <br />
                <span className="text-[#F28C28]">XƯỞNG MẠNH NGHĨA WINDOW 2</span>
              </h2>
            </div>

            <Link
              to="/san-pham"
              className="btn-outline self-start md:self-auto text-xs sm:text-sm"
            >
              <span>XEM TOÀN BỘ DANH MỤC</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-display text-sm tracking-wider uppercase px-4 py-2.5 font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F28C28] text-[#171A1D] shadow-md'
                      : 'bg-[#1E2124] text-gray-300 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="industrial-card group flex flex-col justify-between overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-black">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E2124] via-transparent to-black/30" />

                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[10px] text-[#171A1D] bg-[#F28C28] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {product.categoryName}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="px-3 py-1.5 bg-[#F28C28] text-[#171A1D] font-display font-bold text-xs uppercase flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Chi Tiết</span>
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#F28C28] transition-colors line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-gray-400 font-body">
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{product.material}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>{product.warranty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#F28C28] font-bold">
                    {product.priceEstimate || 'Liên hệ xưởng'}
                  </span>
                  <span className="font-display text-xs text-gray-400 group-hover:text-white uppercase font-bold flex items-center gap-1">
                    <span>Báo Giá</span>
                    <ArrowRight className="w-3 h-3 text-[#F28C28]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1E2124] border border-[#F28C28]/40 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedModalProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center bg-[#171A1D]"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="h-64 sm:h-auto overflow-hidden bg-black">
                <img
                  src={selectedModalProduct.image}
                  alt={selectedModalProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="font-mono text-xs text-[#F28C28] font-bold uppercase">
                  {selectedModalProduct.categoryName}
                </span>

                <h3 className="font-display font-extrabold text-2xl text-white">
                  {selectedModalProduct.title}
                </h3>

                <p className="font-body text-sm text-gray-300 leading-relaxed">
                  {selectedModalProduct.description}
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 bg-[#171A1D] border-l-2 border-[#F28C28]">
                    <span className="text-gray-400 block">Quy cách & Vật tư:</span>
                    <span className="text-white font-semibold">{selectedModalProduct.material}</span>
                  </div>

                  <div className="p-2 bg-[#171A1D] border-l-2 border-emerald-500">
                    <span className="text-gray-400 block">Thời gian bảo hành:</span>
                    <span className="text-emerald-400 font-semibold">{selectedModalProduct.warranty}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block font-mono text-xs text-gray-400">Đơn giá tham khảo tại xưởng:</span>
                  <span className="font-mono text-xl font-bold text-[#F28C28]">
                    {selectedModalProduct.priceEstimate || 'Báo giá theo bản vẽ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:0704682789"
                className="btn-accent flex-1 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>GỌI 0704 682 789 TƯ VẤN NGAY</span>
              </a>
              <button
                onClick={() => {
                  setSelectedModalProduct(null)
                  const qEl = document.getElementById('bao-gia')
                  if (qEl) qEl.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-outline flex-1 text-center"
              >
                ĐẶT HÀNG / GỬI BẢN VẼ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
