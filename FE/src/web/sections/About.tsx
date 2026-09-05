import { CheckCircle2, Factory, Cpu, ShieldCheck, PhoneCall, Award } from 'lucide-react'
import useIntersection from '../hooks/useIntersection'
import { BUSINESS_INFO } from '../data/mockData'

export default function About() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.15, once: true })

  const highlights = [
    'Xưởng gia công trực tiếp diện tích hơn 2.000m² tại Dĩ An & Thủ Đức',
    'Máy cắt Laser Fiber 6000W tốc độ cao, cắt sắt tấm dày tới 25mm sắc mịn',
    'Máy chấn CNC thủy lực 160 tấn độ chính xác từng góc bẻ độ',
    'Máy cắt nhôm 2 đầu kỹ thuật số thước điện tử không sai số',
    'Máy hàn Laser cầm tay & hàn Tig/Mig chuyên dụng Inox 304 không để lại xỉ',
    'Quy trình sơn tĩnh điện 4 lớp & sơn sấy hấp nhiệt chống oxy hóa muối biển',
  ]

  return (
    <section
      ref={ref}
      id="gioi-thieu"
      aria-labelledby="about-heading"
      className="py-20 lg:py-28 bg-[#171A1D] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center fade-up-element ${isVisible ? 'is-visible' : ''}`}>
          {/* Left Column: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E2124] border border-[#F28C28]/40 text-[#F28C28] text-xs font-mono font-bold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5" />
              <span>NĂNG LỰC SẢN XUẤT XƯỞNG CƠ KHÍ</span>
            </div>

            <h2
              id="about-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-wide uppercase leading-tight"
            >
              CHẤT LƯỢNG TẠO DỰNG NIỀM TIN <br />
              <span className="text-[#F28C28]">CHUẨN XÁC TỪNG MILIMET</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-body">
              Khởi nguồn từ niềm đam mê chế tác kim khí và kỹ thuật cơ khí chính xác, <strong className="text-white font-semibold">MẠNH NGHĨA WINDOW 2</strong> đã phát triển thành xưởng cơ khí tổng hợp quy mô hàng đầu khu vực Bình Dương và TP. Hồ Chí Minh.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-body">
              Chúng tôi sở hữu dây chuyền trang thiết bị máy móc gia công tự động hóa hiện đại kết hợp cùng đội ngũ kỹ sư thiết kế bản vẽ kết cấu và thợ lành nghề trên 10 năm kinh nghiệm. Cam kết không qua trung gian, mang đến sản phẩm với chất lượng tinh xảo nhất cùng giá thành xuất xưởng tối ưu nhất.
            </p>

            {/* Highlights Grid */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C28] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-gray-200 font-body leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="tel:0704682789"
                className="btn-accent text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>HOTLINE XƯỞNG: 0704 682 789</span>
              </a>
              <a
                href="#bao-gia"
                className="btn-outline text-sm"
              >
                <span>ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accent Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Background Accent glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F28C28] to-amber-600 rounded-sm blur opacity-25" />

              {/* Main Accent Card */}
              <div className="relative bg-[#1E2124] border-2 border-[#F28C28]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Header of accent box */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-white rounded-sm p-1 border border-[#F28C28] shrink-0"
                      style={{ width: 48, height: 48, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img
                        src={BUSINESS_INFO.logoUrl}
                        alt="Mạnh Nghĩa Window 2"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-base">
                        MẠNH NGHĨA WINDOW 2
                      </h3>
                      <p className="font-mono text-xs text-[#F28C28]">
                        ISO 9001:2015 TIÊU CHUẨN XƯỞNG
                      </p>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-[#F28C28]" />
                </div>

                {/* 3 Key Pillars */}
                <div className="space-y-4 font-body">
                  <div className="p-3 bg-[#171A1D] border-l-2 border-[#F28C28]">
                    <h4 className="font-display font-bold text-white text-sm uppercase">
                      1. BÁO GIÁ TẬN GỐC TẠI XƯỞNG
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Tiết kiệm 15% - 25% so với các đơn vị thương mại trung gian. Bóc tách khối lượng chi tiết minh bạch.
                    </p>
                  </div>

                  <div className="p-3 bg-[#171A1D] border-l-2 border-[#F28C28]">
                    <h4 className="font-display font-bold text-white text-sm uppercase">
                      2. VẬT TƯ NHẬP KHẨU CHÍNH HÃNG 100%
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Nhôm Xingfa tem đỏ nhập khẩu, Inox 304 tiêu chuẩn Posco, Thép tấm kẽm Hòa Phát, phụ kiện Kinlong/Cmech.
                    </p>
                  </div>

                  <div className="p-3 bg-[#171A1D] border-l-2 border-[#F28C28]">
                    <h4 className="font-display font-bold text-white text-sm uppercase">
                      3. BẢO HÀNH KỸ THUẬT DÀI HẠN
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Cam kết bảo hành kết cấu lên đến 10 năm. Có mặt xử lý bảo trì trong vòng 24h kể từ khi tiếp nhận thông tin.
                    </p>
                  </div>
                </div>

                {/* Contact strip in box */}
                <div className="pt-2 text-center border-t border-white/10 font-mono text-xs text-gray-400">
                  <p>Xưởng: Bình Đường, Dĩ An, Bình Dương</p>
                  <p className="text-[#F28C28] font-bold mt-1">
                    Hotline: 0704 682 789 — 0899 082 777
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
