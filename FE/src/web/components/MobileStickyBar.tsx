import { Phone, MessageSquare, FileText } from 'lucide-react'
import { BUSINESS_INFO } from '../data/mockData'

interface MobileStickyBarProps {
  onOpenQuoteModal?: () => void
}

export default function MobileStickyBar({ onOpenQuoteModal }: MobileStickyBarProps) {
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
    <aside aria-label="Thanh liên hệ nhanh di động" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#171A1D]/95 backdrop-blur-md border-t border-[#F28C28]/30 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Nút 1: Gọi điện */}
        <a
          href={`tel:${BUSINESS_INFO.hotlines[0].replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center min-h-[44px] py-1.5 px-2 bg-[#1E2124] border border-white/10 rounded-sm text-gray-200 active:scale-95 transition-transform"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-0.5">
            <Phone className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-display font-bold text-[11px] uppercase tracking-wider text-white">
            Gọi Điện
          </span>
        </a>

        {/* Nút 2: Chat Zalo */}
        <a
          href={`https://zalo.me/${BUSINESS_INFO.zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[44px] py-1.5 px-2 bg-[#0068FF]/20 border border-[#0068FF]/50 rounded-sm text-[#0068FF] active:scale-95 transition-transform"
        >
          <div className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center mb-0.5 font-bold text-[10px]">
            Z
          </div>
          <span className="font-display font-bold text-[11px] uppercase tracking-wider text-white">
            Chat Zalo
          </span>
        </a>

        {/* Nút 3: Báo Giá Nhanh */}
        <button
          onClick={handleQuoteClick}
          className="flex flex-col items-center justify-center min-h-[44px] py-1.5 px-2 bg-[#F28C28] text-coal rounded-sm active:scale-95 transition-transform shadow-md"
        >
          <FileText className="w-4 h-4 text-[#171A1D] mb-0.5" />
          <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-[#171A1D]">
            Báo Giá
          </span>
        </button>
      </div>
    </aside>
  )
}
