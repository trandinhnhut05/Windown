import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import Projects from '../sections/Projects'
import QuoteForm from '../sections/QuoteForm'
import { applySeo, getBreadcrumbSchema } from '../utils/seo'

export default function ProjectsPage() {
  useEffect(() => {
    applySeo({
      title: 'Hồ Sơ Dự Án Đã Hoàn Thiện — Cơ Khí Mạnh Nghĩa Window 2',
      description: 'Tổng hợp các công trình biệt thự, nhà phố, shophouse và nhà xưởng công nghiệp đã bàn giao tại Bình Dương, TP.HCM bởi Xưởng Mạnh Nghĩa Window 2.',
      canonical: window.location.origin + '/du-an',
      schemaJson: getBreadcrumbSchema([
        { name: 'Trang chủ', url: window.location.origin + '/' },
        { name: 'Dự án', url: window.location.origin + '/du-an' },
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
              HƠN 500+ CÔNG TRÌNH ĐÃ THI CÔNG
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-2 uppercase">
              CÔNG TRÌNH THỰC TẾ TIÊU BIỂU
            </h1>
            <p className="font-body text-gray-300 text-base max-w-3xl mt-3">
              Minh chứng rõ nét nhất cho chất lượng và uy tín của Mạnh Nghĩa Window 2 chính là sự hài lòng của hàng trăm gia chủ và nhà thầu xây dựng.
            </p>
          </div>
        </section>

        <Projects />

        <QuoteForm />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
