import { useState, useEffect } from 'react'
import PortalHeader from './components/PortalHeader'
import PortalFooter from './components/PortalFooter'
import MobileBottomBar from './components/MobileBottomBar'
import QuoteModal from './components/QuoteModal'
import ProductDetailModal from './components/ProductDetailModal'
import ProjectDetailModal from './components/ProjectDetailModal'

import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import ProductsSection from './sections/ProductsSection'
import ProjectsSection from './sections/ProjectsSection'
import ProcessSection from './sections/ProcessSection'
import WhyUsSection from './sections/WhyUsSection'
import QuoteSection from './sections/QuoteSection'

import type { ProductItem, ProjectItem } from './data/portalData'
import { COMPANY_INFO } from './data/portalData'
import './portal.css'

export default function PortalPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [quoteCategory, setQuoteCategory] = useState<string | undefined>()

  // Set Page Title & Meta tags for SEO
  useEffect(() => {
    document.title = 'Xưởng Cơ Khí Sắt • Inox • Nhôm Kính Cao Cấp | Thi Công Trọn Gói'
    
    // Add Meta description if missing
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      'Xưởng chuyên gia công cơ khí tổng hợp: Sắt mỹ thuật, Inox 304, Cửa nhôm Xingfa cao cấp, vách kính, mặt dựng tòa nhà và cắt laser CNC chính xác theo yêu cầu. Báo giá nhanh 24/7.'
    )

    // Add Schema.org JSON-LD
    const schemaScriptId = 'portal-json-ld'
    let scriptElem = document.getElementById(schemaScriptId)
    if (!scriptElem) {
      scriptElem = document.createElement('script')
      scriptElem.id = schemaScriptId
      scriptElem.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptElem)
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HomeAndConstructionBusiness',
          '@id': 'https://cokhixaydung.vn/#organization',
          name: COMPANY_INFO.name,
          alternateName: COMPANY_INFO.shortName,
          description: COMPANY_INFO.slogan,
          url: window.location.origin,
          telephone: COMPANY_INFO.hotline,
          email: COMPANY_INFO.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'KCN Nam Thăng Long',
            addressLocality: 'Bắc Từ Liêm',
            addressRegion: 'Hà Nội',
            addressCountry: 'VN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 21.0718,
            longitude: 105.7621,
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '07:30',
            closes: '18:30',
          },
          priceRange: '$$',
        },
        {
          '@type': 'Service',
          name: 'Gia công Sắt nghệ thuật & Kết cấu thép',
          provider: { '@id': 'https://cokhixaydung.vn/#organization' },
          areaServed: 'Việt Nam',
        },
        {
          '@type': 'Service',
          name: 'Gia công Inox 304/316 cao cấp',
          provider: { '@id': 'https://cokhixaydung.vn/#organization' },
          areaServed: 'Việt Nam',
        },
        {
          '@type': 'Service',
          name: 'Thi công Cửa nhôm kính & Mặt dựng kính kiến trúc',
          provider: { '@id': 'https://cokhixaydung.vn/#organization' },
          areaServed: 'Việt Nam',
        },
      ],
    }

    scriptElem.textContent = JSON.stringify(schemaData)
  }, [])

  const handleOpenQuote = (category?: string) => {
    setQuoteCategory(category)
    setIsQuoteOpen(true)
  }

  return (
    <div className="portal-wrapper">
      {/* Header */}
      <PortalHeader onOpenQuote={() => handleOpenQuote()} />

      {/* Main Content with Semantic Sections */}
      <main>
        <HeroSection onOpenQuote={() => handleOpenQuote()} />
        <AboutSection onOpenQuote={() => handleOpenQuote()} />
        <ServicesSection onOpenQuote={handleOpenQuote} />
        <ProductsSection
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onOpenQuote={handleOpenQuote}
        />
        <ProjectsSection
          onSelectProject={(proj) => setSelectedProject(proj)}
          onOpenQuote={() => handleOpenQuote()}
        />
        <ProcessSection />
        <WhyUsSection />
        <QuoteSection />
      </main>

      {/* Footer */}
      <PortalFooter onOpenQuote={() => handleOpenQuote()} />

      {/* Sticky Bottom Bar on Mobile */}
      <MobileBottomBar onOpenQuote={() => handleOpenQuote()} />

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialCategory={quoteCategory}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={handleOpenQuote}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenQuote={() => handleOpenQuote()}
      />
    </div>
  )
}
