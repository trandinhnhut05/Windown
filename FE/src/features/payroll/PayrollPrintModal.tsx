import { useMemo } from 'react'
import { X, Printer } from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import type { Payroll } from '@/shared/api/payrollApi'

interface Props {
  payrollList: Payroll[]
  month: number
  year: number
  onClose: () => void
}

export default function PayrollPrintModal({ payrollList, month, year, onClose }: Props) {
  // Summaries
  const totals = useMemo(() => {
    return payrollList.reduce(
      (sum, p) => {
        sum.earned += p.totalEarned
        sum.advanced += p.totalAdvanced
        sum.remaining += p.remainingSalary
        return sum
      },
      { earned: 0, advanced: 0, remaining: 0 }
    )
  }, [payrollList])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Dynamic CSS styles to handle printing nicely */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          /* Hide app layout structure components */
          .sidebar,
          .top-bar,
          .print-actions-bar,
          header,
          aside,
          button,
          .btn {
            display: none !important;
          }
          /* Reset container styles to not constrain print output */
          .app-layout,
          .main-content,
          .page-content {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            background: none !important;
            box-shadow: none !important;
          }
          /* Backdrop overlay of the modal */
          .modal-overlay {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: auto !important;
            background: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            z-index: 9999 !important;
          }
          /* Modal container itself */
          .print-modal-overlay {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            overflow: visible !important;
            display: block !important;
          }
          /* The printable A4 sheet paper */
          .print-modal-content {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
          }
          @page {
            size: A4 landscape; /* Landscape is usually better for wide payroll tables! */
            margin: 15mm;
          }
        }
      `}</style>

      <div className="modal print-modal-overlay" style={{ maxWidth: 1000, padding: 0, overflow: 'hidden', background: '#f8fafc' }}>
        
        {/* Action Header - Hidden during print */}
        <div className="print-actions-bar" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid var(--color-border)',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)' }}>🖨️ Bản Xem Trước Bảng Lương</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Bản in được tối ưu hóa theo mẫu khổ A4 ngang chuyên nghiệp
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <Printer size={16} /> In / Lưu PDF
            </button>
            <button className="btn btn-secondary" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={16} /> Đóng
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="print-modal-content" style={{
          background: '#ffffff', padding: '40px 45px', margin: '20px auto',
          maxWidth: 950, minHeight: '680px', boxShadow: 'var(--shadow-md)',
          borderRadius: '4px', border: '1px solid var(--color-border)',
          fontFamily: 'Times New Roman, Inter, sans-serif', color: '#000000',
          lineHeight: 1.4, fontSize: '13px'
        }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: 15, marginBottom: 20 }}>
            {/* Logo + Brand name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src="/logo-company.jpg" 
                alt="Logo Mạnh Nghĩa Window 2" 
                style={{ height: 50, objectFit: 'contain' }} 
              />
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1e3a8a', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                  MẠNH NGHĨA WINDOW 2
                </h2>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'Arial, sans-serif' }}>
                  GIẢI PHÁP CỬA NHÔM KÍNH CHUYÊN NGHIỆP
                </span>
              </div>
            </div>

            {/* Company Info */}
            <div style={{ textAlign: 'right', fontSize: 11, color: '#334155' }}>
              <strong>MẠNH NGHĨA WINDOW 2</strong><br />
              📍 Xưởng SX: Lô 51/B2 - 77, Hòa Quý, Q. Ngũ Hành Sơn<br />
              📞 Hotline/Zalo: 0704 682 789 - 0899 082 777
            </div>
          </div>

          {/* Payroll Title */}
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <h1 style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0', color: '#1e3a8a' }}>
              BẢNG TỔNG HỢP LƯƠNG NHÂN VIÊN THỢ XƯỞNG
            </h1>
            <span style={{ fontSize: 13, fontStyle: 'italic', fontWeight: 600 }}>
              Tháng {month} / Năm {year}
            </span>
          </div>

          {/* Summaries Block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, background: '#f8fafc', padding: '12px 18px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>1. Tổng quỹ lương tháng:</span>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginTop: 3 }}>{formatCurrency(totals.earned)}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>2. Tổng tiền tạm ứng:</span>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#b45309', marginTop: 3 }}>-{formatCurrency(totals.advanced)}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>3. Thực lĩnh còn lại cần chi trả:</span>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#15803d', marginTop: 3 }}>{formatCurrency(totals.remaining)}</div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ marginBottom: 25 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, border: '1px solid #cbd5e1' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #94a3b8', textAlign: 'center', fontWeight: 'bold' }}>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', width: 40 }}>STT</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'left', width: 140 }}>Tên nhân viên thợ</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 90 }}>Mức lương/ngày</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', width: 75 }}>Công chuẩn</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', width: 65 }}>Tăng ca</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 110 }}>Lương công nhật</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 110 }}>Lương khoán</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 110 }}>Tổng thu nhập</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 110 }}>Đã tạm ứng</th>
                  <th style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', width: 120 }}>Thực lĩnh nhận</th>
                </tr>
              </thead>
              <tbody>
                {payrollList.map((p, idx) => (
                  <tr key={p.workerId} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{p.workerName}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(p.dailyWage)}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{p.presentDays} công</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{p.totalOtHours > 0 ? `${p.totalOtHours}h` : '0h'}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(p.totalEarnedFromAttendance)}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#15803d' }}>{formatCurrency(p.totalPieceworkAmount)}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(p.totalEarned)}</td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#b45309' }}>
                      {p.totalAdvanced > 0 ? `-${formatCurrency(p.totalAdvanced)}` : '0 ₫'}
                    </td>
                    <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold', color: '#1e3a8a', background: '#f8fafc' }}>
                      {formatCurrency(p.remainingSalary)}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: '#f1f5f9', fontWeight: 'bold', borderTop: '2px solid #94a3b8' }}>
                  <td colSpan={2} style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'center' }}>TỔNG CỘNG QUỸ LƯƠNG</td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1' }}></td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1' }}></td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1' }}></td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1' }}></td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1' }}></td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(totals.earned)}</td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#b45309' }}>-{formatCurrency(totals.advanced)}</td>
                  <td style={{ padding: '8px 4px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#15803d', fontSize: 12 }}>
                    {formatCurrency(totals.remaining)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div style={{ fontSize: 11, color: '#475569', border: '1.5px dashed #e2e8f0', padding: '10px 14px', borderRadius: 4, marginBottom: 35 }}>
            <strong>* Ghi chú:</strong> Số liệu công nhật được tổng hợp tự động từ phần chấm công vân tay/nhật ký công ngày tại xưởng. Mọi thắc mắc đối chiếu vui lòng liên hệ bộ phận Kế toán hành chính trước ngày thanh toán chính thức.
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, textAlign: 'center' }}>
            <div>
              <strong style={{ fontSize: 13, textTransform: 'uppercase' }}>NGƯỜI LẬP BIỂU</strong><br />
              <span style={{ fontSize: 11, color: '#64748b' }}>(Ký, ghi rõ họ tên)</span>
              <div style={{ height: 60 }}></div>
              <strong style={{ fontSize: 13 }}>Hành chính Nhân sự</strong>
            </div>
            <div>
              <strong style={{ fontSize: 13, textTransform: 'uppercase' }}>KẾ TOÁN TRƯỞNG</strong><br />
              <span style={{ fontSize: 11, color: '#64748b' }}>(Ký, ghi rõ họ tên)</span>
              <div style={{ height: 60 }}></div>
              <strong style={{ fontSize: 13 }}>Nguyễn Thị Kế Toán</strong>
            </div>
            <div>
              <strong style={{ fontSize: 13, textTransform: 'uppercase', color: '#1e3a8a' }}>CHỦ XƯỞNG DUYỆT</strong><br />
              <span style={{ fontSize: 11, color: '#64748b' }}>(Ký, đóng dấu và ghi rõ họ tên)</span>
              <div style={{ height: 60 }}></div>
              <strong style={{ fontSize: 13 }}>Giám Đốc Mạnh Nghĩa Window 2</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
