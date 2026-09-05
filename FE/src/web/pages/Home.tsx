import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileStickyBar from '../components/MobileStickyBar'
import FloatingContact from '../components/FloatingContact'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import Products from '../sections/Products'
import Projects from '../sections/Projects'
import Process from '../sections/Process'
import WhyUs from '../sections/WhyUs'
import QuoteForm from '../sections/QuoteForm'
import { applySeo, getLocalBusinessSchema } from '../utils/seo'

export default function Home() {
  useEffect(() => {
    applySeo({
      title: 'Xưởng Cơ Khí Tổng Hợp Mạnh Nghĩa Window 2 — Sắt · Inox · Nhôm Kính',
      description: 'Chuyên gia công cửa cổng sắt mỹ thuật cắt CNC, lan can Inox 304, hệ cửa nhôm Xingfa & Slim, mái kính biệt thự tại Bình Dương & TP.HCM. Báo giá trực tiếp tận xưởng.',
      canonical: window.location.origin + '/',
      ogImage: '/logo-company.jpg',
      schemaJson: getLocalBusinessSchema(),
    })
  }, [])

  return (
    <div className="web-root portal-root">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Products />
        <Projects />
        <Process />
        <WhyUs />
        <QuoteForm />
      </main>
      <Footer />
      <MobileStickyBar />
      <FloatingContact />
    </div>
  )
}
