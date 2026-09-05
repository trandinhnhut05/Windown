import { ArrowRight, CheckCircle, Wrench } from 'lucide-react'
import { SERVICES_LIST } from '../data/mockData'
import useIntersection from '../hooks/useIntersection'

interface ServicesProps {
  onSelectService?: (serviceId: string) => void
}

export default function Services({ onSelectService }: ServicesProps) {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const handleServiceClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId)
    } else {
      const quoteEl = document.getElementById('bao-gia')
      if (quoteEl) {
        quoteEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = `/dich-vu#${serviceId}`
      }
    }
  }

  return (
    <section
      ref={ref}
      id="dich-vu-chinh"
      aria-labelledby="services-heading"
      className="py-20 lg:py-28 bg-[#1E2124] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171A1D] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>LĨNH VỰC HOẠT ĐỘNG CHÍNH</span>
          </div>

          <h2
            id="services-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
          >
            4 HẠNG MỤC DỊCH VỤ CƠ KHÍ <br />
            <span className="text-[#F28C28]">TIÊU CHUẨN KỸ THUẬT CAO</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base mt-4 font-body leading-relaxed">
            Mỗi sản phẩm xuất xưởng tại <strong className="text-white">Mạnh Nghĩa Window 2</strong> đều trải qua quy trình kiểm tra dung sai nghiêm ngặt, xử lý bề mặt kỹ lưỡng trước khi vận chuyển đến lắp đặt hoàn thiện tại công trình.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_LIST.map((service, index) => (
            <article
              key={service.id}
              className="industrial-card group overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-60 sm:h-72 overflow-hidden bg-black">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E2124] via-transparent to-black/40" />

                  {/* Number Badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 bg-[#171A1D] border border-[#F28C28] flex items-center justify-center font-display font-black text-lg text-[#F28C28]">
                    0{index + 1}
                  </div>

                  {/* Tagline on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="font-mono text-xs text-[#F28C28] uppercase font-bold tracking-wider bg-[#171A1D]/90 px-2.5 py-1 border border-white/10">
                      {service.tagline}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="font-display font-extrabold text-2xl text-white tracking-wide group-hover:text-[#F28C28] transition-colors">
                    {service.title}
                  </h3>

                  <p className="font-body text-gray-300 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Items list */}
                  <div className="pt-2 space-y-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-gray-400 font-bold">
                      Các hạng mục chế tạo:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      {service.items.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2">
                <button
                  onClick={() => handleServiceClick(service.id)}
                  className="w-full py-3 px-4 bg-[#171A1D] hover:bg-[#F28C28] text-gray-200 hover:text-coal border border-white/10 hover:border-[#F28C28] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-between transition-all group/btn"
                >
                  <span>YÊU CẦU TƯ VẤN & BÁO GIÁ HẠNG MỤC NÀY</span>
                  <ArrowRight className="w-4 h-4 text-[#F28C28] group-hover/btn:text-coal transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
