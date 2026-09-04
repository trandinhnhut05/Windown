import { useState, useEffect } from 'react'
import {
  Phone,
  ArrowRight,
  Menu,
  X,
  Hammer,
  ShieldCheck,
  ChevronRight,
  LogIn,
} from 'lucide-react'
import { COMPANY_INFO } from '../data/portalData'
import { Link } from 'react-router-dom'

interface Props {
  onOpenQuote: () => void
}

export default function PortalHeader({ onOpenQuote }: Props) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Giới thiệu', href: '#gioi-thieu' },
    { label: 'Dịch vụ', href: '#dich-vu' },
    { label: 'Sản phẩm', href: '#san-pham' },
    { label: 'Công trình', href: '#du-an' },
    { label: 'Quy trình', href: '#quy-trinh' },
    { label: 'Vì sao chọn', href: '#uu-the' },
    { label: 'Liên hệ', href: '#lien-he' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const elem = document.querySelector(href)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className="portal-header"
        style={{
          borderBottom: isScrolled
            ? '1px solid rgba(242, 140, 40, 0.2)'
            : '1px solid var(--portal-border)',
          boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.7)' : 'none',
        }}
      >
        <div
          className="portal-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 78,
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #272C31 0%, #171A1D 100%)',
                border: '1.5px solid var(--portal-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--portal-orange)',
                boxShadow: '0 0 16px -2px var(--portal-orange-glow)',
              }}
            >
              <Hammer size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                CƠ KHÍ <span style={{ color: 'var(--portal-orange)' }}>LUXURY</span>
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--portal-text-muted)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                Sắt • Inox • Nhôm Kính
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
            }}
            className="portal-desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: 'var(--portal-text-secondary)',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  padding: '6px 2px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--portal-orange)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--portal-text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions: Hotline, Quote Button, Admin Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Hotline */}
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                color: 'var(--portal-text)',
                fontSize: 14,
                fontWeight: 700,
              }}
              className="portal-hotline-btn"
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(242, 140, 40, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--portal-orange)',
                }}
              >
                <Phone size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--portal-text-muted)', fontWeight: 500 }}>
                  HOTLINE 24/7
                </div>
                <div style={{ color: 'var(--portal-orange)', letterSpacing: '0.3px' }}>
                  {COMPANY_INFO.hotlineDisplay}
                </div>
              </div>
            </a>

            {/* CTA Button */}
            <button
              onClick={onOpenQuote}
              className="btn-portal-primary"
              style={{
                padding: '10px 18px',
                fontSize: 13.5,
              }}
            >
              <span>NHẬN BÁO GIÁ</span>
              <ArrowRight size={15} />
            </button>

            {/* Link to Admin ERP Portal */}
            <Link
              to="/dashboard"
              title="Cổng Quản Trị Xưởng"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--portal-text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.borderColor = 'var(--portal-orange)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--portal-text-secondary)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <LogIn size={18} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="portal-mobile-menu-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'var(--portal-text)',
                cursor: 'pointer',
                padding: 6,
              }}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: 320,
              height: '100%',
              background: '#1F2327',
              borderLeft: '1px solid var(--portal-border)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--portal-border)',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                  MENU ĐIỀU HƯỚNG
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--portal-text-muted)',
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 18 }}>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 8,
                      color: 'var(--portal-text)',
                      textDecoration: 'none',
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} color="var(--portal-orange)" />
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenQuote()
                }}
                className="btn-portal-primary"
                style={{ width: '100%' }}
              >
                <span>NHẬN BÁO GIÁ NGAY</span>
              </button>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-portal-secondary"
                style={{ width: '100%', fontSize: 13.5 }}
              >
                <ShieldCheck size={16} />
                <span>Cổng Quản Trị Nội Bộ</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CSS Rules specifically for Header responsiveness */}
      <style>{`
        @media (max-width: 1024px) {
          .portal-desktop-nav { display: none !important; }
          .portal-mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .portal-hotline-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
