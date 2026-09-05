import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import QuoteForm from '../sections/QuoteForm'
import { SERVICES_LIST, BUSINESS_INFO } from '../data/mockData'
import { applySeo, getBreadcrumbSchema } from '../utils/seo'
import { CheckCircle2, ArrowRight, Wrench, Shield, Phone } from 'lucide-react'

export default function ServicesPage() {
  useEffect(() => {
    applySeo({
      title: 'Dịch Vụ Gia Công Cơ Khí: Sắt, Inox, Nhôm Kính — Mạnh Nghĩa Window 2',
      description: 'Dịch vụ gia công cơ khí tổng hợp chất lượng cao: Cắt Laser Fiber thép tấm, gia công Inox 304 không gỉ, lắp đặt cửa nhôm Xingfa và mái kính kiến trúc.',
      canonical: window.location.origin + '/dich-vu',
      schemaJson: getBreadcrumbSchema([
        { name: 'Trang chủ', url: window.location.origin + '/' },
        { name: 'Dịch vụ', url: window.location.origin + '/dich-vu' },
      ]),
    })
  }, [])

  return (
    <div className="portal-root">
      <Header />
      <main className="pt-24 pb-16">
        {/* Banner */}
        <section className="bg-[#171A1D] border-b border-white/10 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#F28C28] uppercase font-bold tracking-wider">
              NĂNG LỰC SẢN XUẤT TOÀN DIỆN
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-2 uppercase">
              DỊCH VỤ GIA CÔNG CƠ KHÍ TỔNG HỢP
            </h1>
            <p className="font-body text-gray-300 text-base max-w-3xl mt-3">
              Mạnh Nghĩa Window 2 nhận gia công theo bản vẽ thiết kế 2D/3D hoặc đo đạc khảo sát thực tế tại công trình. Hệ thống máy móc CNC tự động hóa đáp ứng những yêu cầu kỹ thuật khắt khe nhất.
            </p>
          </div>
        </section>

        {/* Services Detail List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {SERVICES_LIST.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:col-start-7' : ''}`}>
                <div className="relative h-80 sm:h-96 overflow-hidden bg-black border border-white/10">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 font-display font-black text-2xl text-[#171A1D] bg-[#F28C28] px-3 py-1">
                    0{index + 1}
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-6 space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <span className="font-mono text-xs text-[#F28C28] font-bold uppercase tracking-wider bg-[#1E2124] px-2.5 py-1 border border-white/5">
                  {service.tagline}
                </span>

                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase leading-tight">
                  {service.title}
                </h2>

                <p className="font-body text-gray-300 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase font-bold text-gray-400">
                    Chi tiết các hạng mục chế tạo:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-200">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <a href="#bao-gia" className="btn-accent text-xs sm:text-sm">
                    <span>YÊU CẦU BÁO GIÁ DỊCH VỤ NÀY</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${BUSINESS_INFO.hotlines[0].replace(/\s+/g, '')}`}
                    className="btn-outline text-xs sm:text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>0704 682 789</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Quote Section embed */}
        <QuoteForm />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
