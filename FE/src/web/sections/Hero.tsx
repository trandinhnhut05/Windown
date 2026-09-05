import { ArrowRight, ShieldCheck, CheckCircle, Flame, Phone, Sparkles, Cpu, Award } from 'lucide-react'
import { STATS_LIST, BUSINESS_INFO } from '../data/mockData'
import useIntersection from '../hooks/useIntersection'

interface HeroProps {
  onOpenQuoteModal?: () => void
}

export default function Hero({ onOpenQuoteModal }: HeroProps) {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const handleQuoteClick = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal()
    } else {
      const quoteEl = document.getElementById('bao-gia')
      if (quoteEl) quoteEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleProjectsClick = () => {
    const projEl = document.getElementById('du-an-tieu-bieu')
    if (projEl) {
      projEl.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/du-an'
    }
  }

  return (
    <section
      ref={ref}
      id="tong-quan"
      aria-labelledby="hero-heading"
      className="relative min-h-[96vh] flex flex-col justify-between pt-36 sm:pt-44 pb-20 overflow-hidden bg-[#0D0F11]"
    >
      {/* Background Image with Dark Mesh & Orange Gradient Glow */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=85"
          alt="Xưởng Cơ Khí Mạnh Nghĩa Window 2"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform transition-transform duration-1000"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F11] via-[#171A1D]/85 to-[#0D0F11]/95" />
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#F28C28]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-[#F28C28]/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Subtle engineering grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Content Area: 2-Column Luxury Industrial Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full pt-4">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Manufacturing Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-[#1E2124]/90 border border-[#F28C28]/50 shadow-[0_0_20px_rgba(242,140,40,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-ping" />
              <span className="font-mono text-xs text-[#F28C28] font-bold tracking-wider uppercase">
                TRỰC TIẾP TẠI XƯỞNG SẢN XUẤT 2.000M² • GIÁ GỐC TẬN XƯỞNG
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-[1.05]"
            >
              CƠ KHÍ TỔNG HỢP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C28] via-[#FFB366] to-[#F5F5F5]">
                MẠNH NGHĨA WINDOW 2
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl text-gray-200 mt-2 font-black tracking-normal">
                SẮT · INOX · NHÔM KÍNH
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Chuyên thiết kế & gia công trực tiếp: Cổng cửa sắt mỹ thuật cắt CNC Laser, Lan can Inox 304, Cửa nhôm Xingfa tem đỏ nhập khẩu, Hệ lùa Slim siêu êm và Giàn mái kính biệt thự. Chuẩn xác từng milimet, khảo sát tận nơi miễn phí 24/7.
            </p>

            {/* Key Quality Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
              <div className="p-2.5 bg-[#1E2124]/80 border border-white/10 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span className="text-gray-200">Laser Fiber 6000W</span>
              </div>
              <div className="p-2.5 bg-[#1E2124]/80 border border-white/10 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span className="text-gray-200">Khảo Sát Laser 24/7</span>
              </div>
              <div className="p-2.5 bg-[#1E2124]/80 border border-white/10 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span className="text-gray-200">Bảo Hành 2 - 10 Năm</span>
              </div>
            </div>

            {/* Action Buttons & Hotline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={handleQuoteClick}
                className="btn-accent text-sm sm:text-base py-3.5 px-8 shadow-[0_4px_25px_rgba(242,140,40,0.4)]"
              >
                <span>YÊU CẦU BÁO GIÁ NHANH (30 PHÚT)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleProjectsClick}
                className="btn-outline text-sm sm:text-base py-3.5 px-7 hover:border-[#F28C28]"
              >
                <span>XEM 50+ CÔNG TRÌNH</span>
              </button>
            </div>

            {/* Hotline Strip */}
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Hotline xưởng trực tiếp:</span>
              </span>
              <a href="tel:0704682789" className="text-white hover:text-[#F28C28] font-bold text-sm">
                0704 682 789
              </a>
              <span>•</span>
              <a href="tel:0899082777" className="text-white hover:text-[#F28C28] font-bold text-sm">
                0899 082 777
              </a>
            </div>
          </div>

          {/* Right Column: 5 Cols Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F28C28] via-amber-500 to-[#F28C28]/40 rounded-sm blur-md opacity-30" />

              {/* Main Visual Box */}
              <div className="relative bg-[#1E2124] border-2 border-[#F28C28]/60 p-6 sm:p-7 space-y-6 shadow-2xl">
                {/* Brand Header */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-white rounded-sm p-1 border-2 border-[#F28C28] shrink-0 shadow-md"
                      style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img
                        src={BUSINESS_INFO.logoUrl}
                        alt="Mạnh Nghĩa Window 2"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h2 className="font-display font-black text-xl text-white tracking-wide">
                        MẠNH NGHĨA WINDOW 2
                      </h2>
                      <span className="font-mono text-xs text-[#F28C28] font-bold tracking-wider">
                        ISO 9001:2015 TIÊU CHUẨN XƯỞNG
                      </span>
                    </div>
                  </div>
                  <Cpu className="w-7 h-7 text-[#F28C28] animate-pulse" />
                </div>

                {/* Machine & Quality Metrics */}
                <div className="space-y-3 font-body">
                  <div className="p-3 bg-[#171A1D] border-l-4 border-[#F28C28]">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-white text-sm uppercase">CẮT FIBER LASER 6000W</span>
                      <span className="font-mono text-[11px] text-[#F28C28] font-bold">±0.05mm</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Cắt thép tấm, sắt nghệ thuật dày tới 25mm, mạch cắt nhẵn bóng không xỉ hàn.
                    </p>
                  </div>

                  <div className="p-3 bg-[#171A1D] border-l-4 border-[#F28C28]">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-white text-sm uppercase">INOX 304 CHỐNG ĂN MÒN</span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">CO/CQ POSCO</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Hàn Tig chuyên dụng không đen vết nối, đánh bóng gương No.8 hoặc xước Hairline.
                    </p>
                  </div>

                  <div className="p-3 bg-[#171A1D] border-l-4 border-[#F28C28]">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-white text-sm uppercase">NHÔM XINGFA & SLIM</span>
                      <span className="font-mono text-[11px] text-blue-400 font-bold">NHẬP KHẨU</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Cửa nhôm tem đỏ Quảng Đông, hệ cửa trượt Slim không ray dưới mở rộng không gian.
                    </p>
                  </div>
                </div>

                {/* Bottom Workshop Address */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>Xưởng: Dĩ An & Thủ Đức (TP.HCM)</span>
                  <span className="text-[#F28C28] font-bold">Mở cửa 24/7</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* S2-04: Stats Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-14">
        <div className="bg-[#1E2124]/95 backdrop-blur-md border border-[#F28C28]/30 p-5 sm:p-7 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {STATS_LIST.map((stat, idx) => (
              <div key={idx} className={`pt-3 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''}`}>
                <div className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F28C28] tracking-tight">
                  {stat.value}
                </div>
                <div className="font-display font-bold text-sm sm:text-base text-white tracking-wider mt-1 uppercase">
                  {stat.label}
                </div>
                <p className="font-body text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
