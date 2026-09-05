import { Factory, Cpu, Users, ShieldCheck, Clock, HeartHandshake } from 'lucide-react'
import useIntersection from '../hooks/useIntersection'

export default function WhyUs() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const reasons = [
    {
      icon: Factory,
      title: 'Sản Xuất Trực Tiếp Tại Xưởng',
      desc: 'Quy mô xưởng hơn 2.000m² tại Dĩ An & Thủ Đức. Khách hàng tiết kiệm ngay 15% - 25% chi phí so với các đại lý trung gian.',
    },
    {
      icon: Cpu,
      title: 'Công Nghệ CNC Laser Tối Tân',
      desc: 'Trang bị máy cắt Laser Fiber 6000W, máy chấn CNC 160 tấn, máy cắt nhôm 2 đầu kỹ thuật số đảm bảo mối ghép kín khít 100%.',
    },
    {
      icon: Users,
      title: 'Đội Thợ & Kỹ Sư Lành Nghề',
      desc: 'Đội ngũ hơn 35 kỹ sư thiết kế kết cấu và thợ hàn cơ khí tay nghề cao, tỉ mỉ trong từng đường hàn và góc bo sản phẩm.',
    },
    {
      icon: ShieldCheck,
      title: 'Vật Tư Nhập Khẩu Chính Hãng',
      desc: 'Cam kết 100% Inox 304 chuẩn CO/CQ, Nhôm Xingfa tem đỏ nhập khẩu, phụ kiện đồng bộ Kinlong/Cmech. Bồi thường gấp đôi nếu phát hiện hàng giả.',
    },
    {
      icon: Clock,
      title: 'Tiến Độ Chuẩn Xác 100%',
      desc: 'Lập tiến độ thi công chi tiết từng ngày. Cam kết chịu phạt vi phạm tiến độ nếu chậm trễ thời gian bàn giao đã cam kết trong hợp đồng.',
    },
    {
      icon: HeartHandshake,
      title: 'Bảo Hành Dài Hạn 2 - 10 Năm',
      desc: 'Bàn giao phiếu bảo hành chính thức cho mỗi công trình. Đội ngũ kỹ thuật hỗ trợ khắc phục sự cố tại chỗ trong vòng 24h.',
    },
  ]

  return (
    <section
      ref={ref}
      id="vi-sao-chon-chung-toi"
      aria-labelledby="why-us-heading"
      className="py-20 lg:py-28 bg-[#1E2124] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171A1D] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CAM KẾT THƯƠNG HIỆU MẠNH NGHĨA</span>
            </div>

            <h2
              id="why-us-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
            >
              VÌ SAO 1.000+ KHÁCH HÀNG & NHÀ THẦU <br />
              <span className="text-[#F28C28]">TIN TƯỞNG LỰA CHỌN CHÚNG TÔI?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="industrial-card p-6 sm:p-8 space-y-4 group hover:border-[#F28C28] transition-all"
                >
                  <div className="w-12 h-12 bg-[#171A1D] border border-white/10 group-hover:border-[#F28C28] flex items-center justify-center rounded-sm text-[#F28C28] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white tracking-wide uppercase group-hover:text-[#F28C28] transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-body text-sm text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
