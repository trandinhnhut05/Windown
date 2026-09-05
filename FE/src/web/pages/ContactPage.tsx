import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import QuoteForm from '../sections/QuoteForm'
import { BUSINESS_INFO } from '../data/mockData'
import { applySeo, getBreadcrumbSchema } from '../utils/seo'
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, Factory } from 'lucide-react'

export default function ContactPage() {
  useEffect(() => {
    applySeo({
      title: 'Liên Hệ Xưởng Cơ Khí Mạnh Nghĩa Window 2 — Hotline 0704 682 789',
      description: 'Địa chỉ xưởng sản xuất cơ khí Mạnh Nghĩa Window 2 tại Bình Dương và TP. Thủ Đức, TP.HCM. Hotline 24/7: 0704 682 789 — 0899 082 777. Tư vấn đo đạc miễn phí.',
      canonical: window.location.origin + '/lien-he',
      schemaJson: getBreadcrumbSchema([
        { name: 'Trang chủ', url: window.location.origin + '/' },
        { name: 'Liên hệ', url: window.location.origin + '/lien-he' },
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
              TRỰC TIẾP TẬN XƯỞNG
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-2 uppercase">
              LIÊN HỆ XƯỞNG MẠNH NGHĨA WINDOW 2
            </h1>
            <p className="font-body text-gray-300 text-base max-w-3xl mt-3">
              Quý khách có thể đến trực tiếp xưởng sản xuất để tham quan quy trình cắt Laser CNC, máy chấn và kiểm tra chất lượng nhôm kính, inox trước khi đặt hàng.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1: Địa chỉ xưởng */}
            <div className="industrial-card p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 bg-[#171A1D] border border-[#F28C28] text-[#F28C28] flex items-center justify-center rounded-sm">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase">
                Xưởng Sản Xuất
              </h3>
              <div className="space-y-2 text-sm text-gray-300 font-body">
                <p>
                  <strong className="text-white">Xưởng chính:</strong> {BUSINESS_INFO.address}
                </p>
                <p>
                  <strong className="text-white">Cơ sở TP.HCM:</strong> {BUSINESS_INFO.addressHcm}
                </p>
              </div>
            </div>

            {/* Card 2: Hotline & Zalo */}
            <div className="industrial-card p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 bg-[#171A1D] border border-[#F28C28] text-[#F28C28] flex items-center justify-center rounded-sm">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase">
                Đường Dây Nóng
              </h3>
              <div className="space-y-2 text-sm font-mono text-gray-300">
                <p>
                  <span className="text-gray-400 block text-xs">Hotline tư vấn kỹ thuật:</span>
                  <a href="tel:0704682789" className="text-xl font-bold text-[#F28C28] hover:underline block">
                    0704 682 789
                  </a>
                </p>
                <p>
                  <span className="text-gray-400 block text-xs">Hotline quản lý xưởng:</span>
                  <a href="tel:0899082777" className="text-lg font-bold text-white hover:underline block">
                    0899 082 777
                  </a>
                </p>
              </div>
            </div>

            {/* Card 3: Thời gian làm việc */}
            <div className="industrial-card p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 bg-[#171A1D] border border-[#F28C28] text-[#F28C28] flex items-center justify-center rounded-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase">
                Giờ Hoạt Động
              </h3>
              <div className="space-y-2 text-sm text-gray-300 font-body">
                <p>
                  <strong className="text-white">Xưởng sản xuất:</strong> Thứ 2 - Thứ 7 (07:30 - 18:30)
                </p>
                <p>
                  <strong className="text-[#F28C28]">Hỗ trợ kỹ thuật & Khảo sát tận nơi:</strong> 24/7 kể cả Chủ Nhật và ngày lễ.
                </p>
              </div>
            </div>
          </div>

          {/* Map Embed Card */}
          <div className="industrial-card p-4 sm:p-6 overflow-hidden space-y-4 mb-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F28C28]" />
                <h3 className="font-display font-bold text-lg text-white uppercase">
                  Vị Trí Xưởng Mạnh Nghĩa Window 2 Trên Bản Đồ
                </h3>
              </div>
              <span className="font-mono text-xs text-gray-400">Dĩ An, Bình Dương — Giáp TP. Thủ Đức</span>
            </div>

            <div className="w-full h-80 sm:h-96 bg-[#171A1D] border border-white/10 relative flex items-center justify-center overflow-hidden">
              <iframe
                title="Bản đồ chỉ đường đến xưởng cơ khí Mạnh Nghĩa Window 2"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.423984577884!2d106.758414!3d10.875245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUyJzMwLjkiTiAxMDbCsDQ1JzMwLjMiRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </section>

        {/* Direct Quote Form */}
        <QuoteForm />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
