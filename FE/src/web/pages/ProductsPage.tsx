import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import Products from '../sections/Products'
import QuoteForm from '../sections/QuoteForm'
import { applySeo, getBreadcrumbSchema } from '../utils/seo'

export default function ProductsPage() {
  useEffect(() => {
    applySeo({
      title: 'Sản Phẩm Cơ Khí Cao Cấp: Cổng Sắt CNC, Inox 304, Cửa Nhôm Xingfa — Mạnh Nghĩa',
      description: 'Khám phá các mẫu cổng sắt mỹ thuật cắt laser, cầu thang xương cá, lan can inox 304 kính, cửa nhôm Xingfa tem đỏ, cửa lùa Slim sản xuất tại xưởng Mạnh Nghĩa Window 2.',
      canonical: window.location.origin + '/san-pham',
      schemaJson: getBreadcrumbSchema([
        { name: 'Trang chủ', url: window.location.origin + '/' },
        { name: 'Sản phẩm', url: window.location.origin + '/san-pham' },
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
              CATALOGUE SẢN XUẤT 2026
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mt-2 uppercase">
              SẢN PHẨM CƠ KHÍ & NHÔM KÍNH
            </h1>
            <p className="font-body text-gray-300 text-base max-w-3xl mt-3">
              Toàn bộ sản phẩm được gia công trực tiếp tại xưởng với thép tấm cắt Fiber Laser, Inox 304 chuẩn CO/CQ và profile nhôm Xingfa chính hãng.
            </p>
          </div>
        </section>

        {/* Product Component */}
        <Products />

        {/* Quote Form */}
        <QuoteForm />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
