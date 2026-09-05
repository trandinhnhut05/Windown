import { Phone, MessageCircle } from 'lucide-react'
import { BUSINESS_INFO } from '../data/mockData'

export default function FloatingContact() {
  const primaryPhone = BUSINESS_INFO.hotlines[0].replace(/\s+/g, '')

  return (
    <aside
      aria-label="Liên hệ nhanh xưởng Mạnh Nghĩa Window 2"
      className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-center gap-3"
    >
      {/* Nút Zalo Chat */}
      <a
        href={`https://zalo.me/${BUSINESS_INFO.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo ngay với Mạnh Nghĩa Window 2"
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#0068FF] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      >
        <span className="absolute right-full mr-3 px-3 py-1 bg-[#171A1D] text-white text-xs font-semibold rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo: {BUSINESS_INFO.zalo}
        </span>
        <span className="font-extrabold text-sm tracking-tighter">Zalo</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0068FF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
      </a>

      {/* Nút Gọi Điện Hotline */}
      <a
        href={`tel:${primaryPhone}`}
        title={`Gọi ngay hotline ${BUSINESS_INFO.hotlines[0]}`}
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#F28C28] text-[#0D0F11] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse"
      >
        <span className="absolute right-full mr-3 px-3 py-1 bg-[#171A1D] text-white text-xs font-semibold rounded shadow-md border border-[#F28C28]/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Hotline: {BUSINESS_INFO.hotlines[0]}
        </span>
        <Phone className="w-6 h-6 fill-current" />
        <span className="sr-only">Gọi hotline {BUSINESS_INFO.hotlines[0]}</span>
      </a>
    </aside>
  )
}
