import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone, Menu, X, ArrowRight, ShieldCheck, Hammer } from 'lucide-react'
import { BUSINESS_INFO } from '../data/mockData'

interface HeaderProps {
  onOpenQuoteModal?: () => void
}

export default function Header({ onOpenQuoteModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'DỊCH VỤ', path: '/dich-vu' },
    { label: 'SẢN PHẨM', path: '/san-pham' },
    { label: 'DỰ ÁN', path: '/du-an' },
    { label: 'TIN TỨC', path: '/tin-tuc' },
    { label: 'LIÊN HỆ', path: '/lien-he' },
  ]

  const handleQuoteClick = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal()
    } else {
      const quoteSection = document.getElementById('bao-gia')
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = '/#bao-gia'
      }
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D0F11]/98 backdrop-blur-md shadow-2xl border-b border-[#F28C28]/40 py-2.5'
            : 'bg-[#0D0F11]/90 backdrop-blur-md border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="relative rounded-sm overflow-hidden bg-white p-1 border-2 border-[#F28C28] shrink-0 shadow-md group-hover:scale-105 transition-transform"
                style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt="Mạnh Nghĩa Window 2"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg sm:text-xl md:text-2xl text-white tracking-wide leading-none group-hover:text-[#F28C28] transition-colors">
                  MẠNH NGHĨA WINDOW 2
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] text-[#F28C28] tracking-widest uppercase font-semibold mt-1">
                  Cơ Khí Tổng Hợp: Sắt · Inox · Nhôm Kính
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-display text-sm tracking-wider px-3 py-2 font-semibold transition-all relative ${
                      isActive
                        ? 'text-[#F28C28]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F28C28]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Action & Hotline */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:0704682789"
                className="flex items-center gap-2 text-left group/hotline"
              >
                <div className="w-9 h-9 rounded-sm bg-[#1E2124] border border-[#F28C28]/40 flex items-center justify-center text-[#F28C28] group-hover/hotline:bg-[#F28C28] group-hover/hotline:text-coal transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                    Hotline Xưởng 24/7
                  </span>
                  <span className="font-mono font-bold text-sm text-white group-hover/hotline:text-[#F28C28] transition-colors">
                    0704 682 789
                  </span>
                </div>
              </a>

              <button
                onClick={handleQuoteClick}
                className="btn-accent text-xs sm:text-sm py-2 px-4 shadow-sm"
              >
                <span>BÁO GIÁ NHANH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={handleQuoteClick}
                className="btn-accent text-xs py-1.5 px-3 md:hidden"
              >
                Báo Giá
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#F28C28] rounded-sm bg-[#1E2124] border border-white/10"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#F28C28]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation (Slide-in từ phải) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#171A1D] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Sidebar Top */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt="Mạnh Nghĩa Window 2"
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                  className="bg-white rounded-sm p-0.5"
                />
                <div>
                  <h2 className="font-display font-bold text-white text-base leading-tight">
                    MẠNH NGHĨA
                  </h2>
                  <span className="font-mono text-[10px] text-[#F28C28]">
                    WINDOW 2
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-display text-base font-bold tracking-wide px-4 py-3 rounded-sm flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#F28C28]/10 text-[#F28C28] border-l-4 border-[#F28C28]'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
              <div className="bg-[#1E2124] p-3 border border-white/5">
                <p className="font-mono text-xs text-gray-400 uppercase">Hotline liên hệ:</p>
                <a
                  href="tel:0704682789"
                  className="font-mono font-bold text-lg text-[#F28C28] block mt-1"
                >
                  0704 682 789
                </a>
                <a
                  href="tel:0899082777"
                  className="font-mono font-bold text-sm text-gray-200 block"
                >
                  0899 082 777
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Action */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleQuoteClick()
              }}
              className="btn-accent w-full justify-center"
            >
              YÊU CẦU BÁO GIÁ NGAY
            </button>
            <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
              <span>Xưởng Dĩ An & Thủ Đức</span>
              <Link to="/admin/dashboard" className="hover:text-gray-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quản trị</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
