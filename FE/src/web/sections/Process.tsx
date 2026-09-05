import { PhoneCall, Ruler, FileSpreadsheet, Cog, Truck, Award } from 'lucide-react'
import useIntersection from '../hooks/useIntersection'

export default function Process() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1, once: true })

  const steps = [
    {
      num: '01',
      icon: PhoneCall,
      title: 'Tiếp Nhận & Tư Vấn',
      desc: 'Tư vấn sơ bộ quy cách sắt, inox, nhôm kính qua hotline/Zalo 24/7. Lên lịch hẹn khảo sát thực tế.',
    },
    {
      num: '02',
      icon: Ruler,
      title: 'Khảo Sát & Đo Đạc',
      desc: 'Kỹ sư mang thiết bị thước đo laser điện tử đến tận công trình đo đạc chính xác tuyệt đối.',
    },
    {
      num: '03',
      icon: FileSpreadsheet,
      title: 'Thiết Kế & Báo Giá',
      desc: 'Lên bản vẽ kỹ thuật 2D/3D chi tiết, bóc tách vật tư minh bạch và gửi báo giá tận xưởng tốt nhất.',
    },
    {
      num: '04',
      icon: Cog,
      title: 'Gia Công Trực Tiếp',
      desc: 'Sản xuất tại xưởng Mạnh Nghĩa Window 2 bằng máy cắt Laser Fiber, chấn CNC và quy trình sơn tĩnh điện.',
    },
    {
      num: '05',
      icon: Truck,
      title: 'Vận Chuyển & Lắp Đặt',
      desc: 'Xe chuyên dụng giao hàng tận nơi. Đội ngũ thợ lắp đặt căn chỉnh chuẩn xác từng khe hở, bản lề.',
    },
    {
      num: '06',
      icon: Award,
      title: 'Nghiệm Thu & Bảo Hành',
      desc: 'Chủ nhà cùng nghiệm thu vận hành êm ái. Bàn giao phiếu bảo hành chính hãng từ 2 đến 10 năm.',
    },
  ]

  return (
    <section
      ref={ref}
      id="quy-trinh-lam-viec"
      aria-labelledby="process-heading"
      className="py-20 lg:py-28 bg-[#171A1D] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`max-w-3xl mb-16 fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E2124] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Cog className="w-3.5 h-3.5" />
            <span>TIÊU CHUẨN THI CÔNG KHÉP KÍN</span>
          </div>

          <h2
            id="process-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
          >
            QUY TRÌNH 6 BƯỚC CHUẨN XÁC <br />
            <span className="text-[#F28C28]">TỪ BẢN VẼ ĐẾN BÀN GIAO THỰC TẾ</span>
          </h2>
        </div>

        {/* Timeline Grid: 6 steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="industrial-card p-6 sm:p-8 space-y-4 relative group hover:border-[#F28C28] transition-all"
              >
                {/* Step Number Top Right */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-[#171A1D] border border-[#F28C28]/40 text-[#F28C28] flex items-center justify-center rounded-sm group-hover:bg-[#F28C28] group-hover:text-coal transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-3xl text-gray-700 group-hover:text-[#F28C28] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white tracking-wide uppercase group-hover:text-[#F28C28] transition-colors">
                  {step.title}
                </h3>

                <p className="font-body text-sm text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
