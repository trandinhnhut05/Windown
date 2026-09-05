import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react'
import { BUSINESS_INFO, SERVICES_LIST } from '../data/mockData'

export default function Footer() {
  return (
    <footer className="bg-[#0D0F11] border-t border-white/10 text-gray-400 font-body relative pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-white rounded-sm p-1 border border-[#F28C28] shrink-0"
                style={{ width: 48, height: 48, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt={BUSINESS_INFO.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-white text-lg leading-tight tracking-wide">
                  MẠNH NGHĨA WINDOW 2
                </h3>
                <p className="font-mono text-[10px] text-[#F28C28] tracking-widest font-semibold uppercase">
                  Cơ Khí Tổng Hợp Cao Cấp
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Xưởng sản xuất trực tiếp quy mô lớn chuyên gia công Sắt nghệ thuật, Inox 304, Hệ cửa nhôm kính cao cấp và Mái kính kiến trúc. Chuẩn kỹ thuật, giá xưởng minh bạch.
            </p>

            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Mã số thuế: {BUSINESS_INFO.taxCode}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Hoạt động uy tín từ năm {BUSINESS_INFO.foundingYear}</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Dịch Vụ Cơ Khí */}
          <div>
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase mb-5 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Dịch Vụ Trọng Tâm</span>
              <span className="w-2 h-2 bg-[#F28C28]" />
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_LIST.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/dich-vu"
                    className="hover:text-[#F28C28] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-[#F28C28] transition-colors" />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/dich-vu"
                  className="hover:text-[#F28C28] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-[#F28C28] transition-colors" />
                  <span>Cắt Laser CNC Thép Tấm Theo Bản Vẽ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dich-vu"
                  className="hover:text-[#F28C28] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-[#F28C28] transition-colors" />
                  <span>Hàn Laser & Đánh Bóng Gương Inox</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Sản Phẩm Tiêu Biểu */}
          <div>
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase mb-5 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Sản Phẩm & Dự Án</span>
              <span className="w-2 h-2 bg-[#F28C28]" />
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/san-pham" className="hover:text-[#F28C28] transition-colors">
                  Cổng Sắt CNC Trống Đồng Biệt Thự
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-[#F28C28] transition-colors">
                  Cầu Thang Sắt Xương Cá Mặt Bậc Gỗ
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-[#F28C28] transition-colors">
                  Lan Can Ban Công Inox 304 Kẹp Kính
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-[#F28C28] transition-colors">
                  Cửa Lùa Trượt Slim Siêu Êm Không Ray
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-[#F28C28] transition-colors">
                  Cửa Nhôm Xingfa Tem Đỏ Nhập Khẩu
                </Link>
              </li>
              <li>
                <Link to="/du-an" className="hover:text-[#F28C28] transition-colors flex items-center gap-1 font-semibold text-gray-300">
                  <span>Xem 50+ Công Trình Thực Tế</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F28C28]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Nhà xưởng */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase mb-5 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Liên Hệ Xưởng</span>
              <span className="w-2 h-2 bg-[#F28C28]" />
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.addressHcm}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                <div className="font-mono">
                  <a href="tel:0704682789" className="text-white hover:text-[#F28C28] font-bold">
                    0704 682 789
                  </a>
                  {' · '}
                  <a href="tel:0899082777" className="text-white hover:text-[#F28C28] font-bold">
                    0899 082 777
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white truncate">
                  {BUSINESS_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span>{BUSINESS_INFO.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© 2026 CƠ KHÍ TỔNG HỢP MẠNH NGHĨA WINDOW 2. Đã đăng ký bản quyền sản xuất.</p>

          <div className="flex items-center gap-6">
            <Link to="/lien-he" className="hover:text-gray-300 transition-colors">
              Chính Sách Bảo Hành
            </Link>
            <Link to="/lien-he" className="hover:text-gray-300 transition-colors">
              Quy Trình Nghiệm Thu
            </Link>
            {/* Hidden admin routing as requested in S4-12 */}
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-gray-400 transition-colors flex items-center gap-1"
              title="Quản trị hệ thống nội bộ"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản trị viên</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
