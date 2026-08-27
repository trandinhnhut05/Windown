import { useEffect, useState, useMemo } from 'react'
import { X, Printer, Download } from 'lucide-react'
import { materialApi } from '@/shared/api/materialApi'
import type { Material } from '@/shared/api/materialApi'
import { formatCurrency, formatDate } from '@/shared/utils/format'

interface Project {
  id: number
  projectCode: string
  name: string
  customerName: string
  customerPhone: string
  address: string
  lengthM: number
  widthM: number
  areaM2: number
  unitPrice: number
  totalAmount: number
  deposit: number
  extraPaid: number
  remainingDebt: number
  status: string
  startDate: string | null
  deliveryDate: string | null
  note: string
  payments: any[]
  createdAt: string
  updatedAt: string
}

interface Props {
  project: Project
  onClose: () => void
}

export default function QuotationPrintModal({ project, onClose }: Props) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true)
      try {
        const data = await materialApi.getByProject(project.id)
        setMaterials(data)
      } catch (err) {
        console.error('Lỗi khi lấy vật tư dự án:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMaterials()
  }, [project.id])

  const paidTotal = project.deposit + project.extraPaid

  // Calculate totals
  const materialsTotal = useMemo(() => {
    return materials.reduce((sum, m) => sum + m.total, 0)
  }, [materials])

  // Total invoice value = main construction + materials (if materials aren't already included in totalAmount)
  // Let's check: in this app, does project.totalAmount represent the main construction cost (area * unit price)?
  // Yes, area * unit price = totalAmount. The materials are tracked separately as cost or billed separately.
  // Let's list both: main construction cost and materials cost.
  const grandTotal = project.totalAmount + materialsTotal
  const finalDebt = grandTotal - paidTotal

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
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="modal print-modal-overlay" style={{ maxWidth: 850, padding: 0, overflow: 'hidden', background: '#f8fafc' }}>
        
        {/* Action Header - Hidden during print */}
        <div className="print-actions-bar" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid var(--color-border)',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)' }}>🖨️ Bản Xem Trước Báo Giá</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Bản in được tối ưu hóa theo mẫu chuẩn A4 thương mại
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
          background: '#ffffff', padding: '40px 50px', margin: '20px auto',
          maxWidth: 800, minHeight: '1100px', boxShadow: 'var(--shadow-md)',
          borderRadius: '4px', border: '1px solid var(--color-border)',
          fontFamily: 'Times New Roman, Inter, sans-serif', color: '#000000',
          lineHeight: 1.4, fontSize: '14px'
        }}>
          
          {/* Company Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: 15, marginBottom: 20 }}>
            {/* Logo + Brand name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img 
                src="/logo-company.jpg" 
                alt="Logo Mạnh Nghĩa Window 2" 
                style={{ height: 60, objectFit: 'contain' }} 
              />
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1e3a8a', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                  MẠNH NGHĨA WINDOW 2
                </h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'Arial, sans-serif' }}>
                  GIẢI PHÁP CỬA NHÔM KÍNH CHUYÊN NGHIỆP
                </span>
              </div>
            </div>

            {/* Company Info */}
            <div style={{ textAlign: 'right', fontSize: 12, color: '#334155' }}>
              <strong style={{ fontSize: 13 }}>MẠNH NGHĨA WINDOW 2</strong><br />
              📍 Địa chỉ: Lô 51/B2 - 77, Hòa Quý, Q. Ngũ Hành Sơn<br />
              📞 Hotline/Zalo: 0704 682 789 - 0899 082 777
            </div>
          </div>

          {/* Quotation Title */}
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <h1 style={{ fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0', color: '#1e3a8a' }}>
              BẢNG BÁO GIÁ THI CÔNG & LẮP ĐẶT
            </h1>
            <span style={{ fontSize: 13, fontStyle: 'italic' }}>
              Số: BG-{project.projectCode} &bull; Ngày lập: {formatDate(new Date().toISOString())}
            </span>
          </div>

          {/* Client & Project Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, background: '#f8fafc', padding: '14px 18px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div>
              <h4 style={{ margin: '0 0 6px 0', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, textTransform: 'uppercase', color: '#1e3a8a', fontSize: 13 }}>
                Thông tin khách hàng:
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b', width: 110 }}>Tên khách hàng:</td>
                    <td style={{ padding: '2px 0', fontWeight: 'bold' }}>{project.customerName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b' }}>Số điện thoại:</td>
                    <td style={{ padding: '2px 0', fontWeight: 'bold' }}>{project.customerPhone || '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b', verticalAlign: 'top' }}>Địa chỉ công trình:</td>
                    <td style={{ padding: '2px 0', fontWeight: 'semibold', lineHeight: '1.2' }}>{project.address || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px 0', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, textTransform: 'uppercase', color: '#1e3a8a', fontSize: 13 }}>
                Thông tin dự án:
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b', width: 100 }}>Mã công trình:</td>
                    <td style={{ padding: '2px 0', fontWeight: 'bold', color: '#1e3a8a' }}>{project.projectCode}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b' }}>Hạng mục thi công:</td>
                    <td style={{ padding: '2px 0', fontWeight: 'semibold' }}>{project.name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#64748b' }}>Trạng thái:</td>
                    <td style={{ padding: '2px 0' }}>
                      <span style={{ fontSize: 11, fontWeight: 'bold', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4 }}>
                        {project.status === 'PENDING' ? 'Chờ xử lý' :
                         project.status === 'IN_PROGRESS' ? 'Đang thi công' :
                         project.status === 'WAITING_PAYMENT' ? 'Chờ thu tiền' :
                         project.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã huỷ'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Construction Item details */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>I. CHI TIẾT HẠNG MỤC THI CÔNG CHÍNH</span>
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #cbd5e1' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #94a3b8', textAlign: 'center', fontWeight: 'bold' }}>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 50 }}>STT</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Nội dung chi tiết lắp đặt</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 80 }}>Chiều dài (m)</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 85 }}>Chiều rộng (m)</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 95 }}>Diện tích (m²)</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', width: 120 }}>Đơn giá (đ/m²)</th>
                  <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', width: 130 }}>Thành tiền (VND)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                    Thi công hệ cửa kính: {project.name}<br />
                    <span style={{ fontSize: 11, color: '#475569', fontWeight: 'normal' }}>
                      (Kính cường lực, khung nhôm kính chịu lực chất lượng cao)
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{project.lengthM}</td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{project.widthM}</td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}>{Number(project.areaM2).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(project.unitPrice)}</td>
                  <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                    {formatCurrency(project.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Materials Section (dynamic list) */}
          {loading ? (
            <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 13, color: '#64748b' }}>Đang tải vật tư kèm theo...</div>
          ) : materials.length > 0 ? (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#1e3a8a' }}>
                II. PHỤ KIỆN & VẬT TƯ PHỤ KÈM THEO
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #cbd5e1' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #94a3b8', textAlign: 'center', fontWeight: 'bold' }}>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 50 }}>STT</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Tên vật tư / Phụ kiện</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 90 }}>Đơn vị tính</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', width: 95 }}>Số lượng</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', width: 120 }}>Đơn giá (đ)</th>
                    <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', width: 130 }}>Thành tiền (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, idx) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: 500 }}>{m.name}</td>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{m.unit}</td>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{m.quantity}</td>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(m.unitPrice)}</td>
                      <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'semibold' }}>{formatCurrency(m.total)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                    <td colSpan={5} style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Cộng tiền phụ kiện/vật tư phụ:</td>
                    <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#0f172a' }}>{formatCurrency(materialsTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Pricing & Financial Summaries */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 25 }}>
            <div style={{ width: 350, border: '1px solid #000', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: 13, fontWeight: 'bold' }}>1. Giá trị thi công chính:</span>
                <span style={{ fontSize: 13, fontWeight: 'bold' }}>{formatCurrency(project.totalAmount)}</span>
              </div>
              {materialsTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: 13 }}>2. Giá trị phụ kiện/vật tư:</span>
                  <span style={{ fontSize: 13 }}>{formatCurrency(materialsTotal)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#1e3a8a', color: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: 14, fontWeight: 'black' }}>TỔNG GIÁ TRỊ BÁO GIÁ:</span>
                <span style={{ fontSize: 14, fontWeight: 'black' }}>{formatCurrency(grandTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid #cbd5e1', color: 'var(--color-success)' }}>
                <span style={{ fontSize: 13, fontWeight: 'bold' }}>Đã thanh toán (Đặt cọc/Thu thêm):</span>
                <span style={{ fontSize: 13, fontWeight: 'bold' }}>-{formatCurrency(paidTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fffbeb', color: '#b45309' }}>
                <span style={{ fontSize: 14, fontWeight: 'bold' }}>CÒN LẠI CẦN THU:</span>
                <span style={{ fontSize: 14, fontWeight: 'bold' }}>{finalDebt > 0 ? formatCurrency(finalDebt) : '0 ₫ (Đã thu đủ)'}</span>
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div style={{ fontSize: 12, color: '#334155', border: '1px dashed #cbd5e1', padding: '12px 16px', borderRadius: 4, marginBottom: 35 }}>
            <h5 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#1e3a8a', textTransform: 'uppercase', fontWeight: 'bold' }}>Ghi chú & Điều khoản chung:</h5>
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              <li style={{ padding: '2px 0' }}>Báo giá trên đã bao gồm chi phí thiết kế bản vẽ kỹ thuật, vận chuyển và thi công trọn gói tại công trình.</li>
              <li style={{ padding: '2px 0' }}>Sản phẩm được bảo hành chính hãng: khung nhôm bảo hành 05 năm; phụ kiện bảo hành 02 năm kể từ ngày ký bàn giao.</li>
              <li style={{ padding: '2px 0' }}>Thời gian thi công hoàn thiện: dự kiến từ 07 - 12 ngày sau khi ký kết thống nhất bản vẽ và nhận đặt cọc.</li>
              <li style={{ padding: '2px 0' }}>Đơn giá này có hiệu lực trong vòng 30 ngày kể từ ngày lập bảng báo giá này.</li>
            </ol>
          </div>

          {/* Signature block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, textAlign: 'center', marginTop: 10 }}>
            <div>
              <span style={{ fontStyle: 'italic', fontSize: 13 }}>Đà Nẵng, ngày ..... tháng ..... năm 2026</span><br />
              <strong style={{ fontSize: 14, textTransform: 'uppercase' }}>KHÁCH HÀNG XÁC NHẬN</strong><br />
              <span style={{ fontSize: 11, color: '#64748b' }}>(Ký, ghi rõ họ tên)</span>
              <div style={{ height: 80 }}></div>
              <strong style={{ fontSize: 14 }}>{project.customerName}</strong>
            </div>
            <div>
              <span style={{ fontStyle: 'italic', fontSize: 13 }}>Đại diện Mạnh Nghĩa Window 2</span><br />
              <strong style={{ fontSize: 14, textTransform: 'uppercase', color: '#1e3a8a' }}>NGƯỜI LẬP BÁO GIÁ</strong><br />
              <span style={{ fontSize: 11, color: '#64748b' }}>(Ký, đóng dấu và ghi rõ họ tên)</span>
              <div style={{ height: 80 }}></div>
              <strong style={{ fontSize: 14 }}>Nguyễn Văn Báo Giá</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
