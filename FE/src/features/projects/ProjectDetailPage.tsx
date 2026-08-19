import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, CreditCard, CheckCircle2, Clock, MapPin, Phone, Calendar, FileText } from 'lucide-react'
import { projectApi } from '@/shared/api/projectApi'
import { formatCurrency, formatDate, formatDateTime, projectStatusMap, paymentTypeMap } from '@/shared/utils/format'

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
import ProjectFormModal from './ProjectFormModal'
import PaymentModal from './PaymentModal'
import ProjectMaterialsTab from './ProjectMaterialsTab'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ProjectWarrantyTab from './ProjectWarrantyTab'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [activeTab, setActiveTab] = useState<'payment' | 'materials' | 'warranty'>('payment')

  const exportQuotation = () => {
    if (!project) return
    const doc = new jsPDF()

    // Title
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('BAO GIA CONG TRINH - WINDOWN', 20, 20)

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    doc.text(`Ma cong trinh: ${project.projectCode}`, 20, 28)
    doc.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 20, 34)

    // Customer details
    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('THONG TIN KHACH HANG:', 20, 46)

    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`- Ten khach hang: ${stripVietnameseAccents(project.customerName)}`, 20, 54)
    doc.text(`- So dien thoai: ${project.customerPhone || '—'}`, 20, 62)
    doc.text(`- Dia chi thi cong: ${stripVietnameseAccents(project.address || '—')}`, 20, 70)

    // Dimensions and pricing
    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('KICH THUOC & CHI PHI:', 20, 84)

    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`- Chieu dai: ${project.lengthM} m`, 20, 92)
    doc.text(`- Chieu rong: ${project.widthM} m`, 20, 100)
    doc.text(`- Dien tich: ${Number(project.areaM2).toFixed(2)} m2`, 20, 108)
    doc.text(`- Don gia: ${formatCurrency(project.unitPrice)}`, 20, 116)
    doc.text(`- Tong gia tri thi cong: ${formatCurrency(project.totalAmount)}`, 20, 124)

    // Deposit and extra payments
    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('TINH TRANG THANH TOAN:', 20, 138)

    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`- Da dat coc: ${formatCurrency(project.deposit)}`, 20, 146)
    doc.text(`- Da thanh toan them: ${formatCurrency(project.extraPaid)}`, 20, 154)
    doc.text(`- Con no: ${formatCurrency(project.remainingDebt)}`, 20, 162)

    // PDF Table of payments if any
    if (project.payments && project.payments.length > 0) {
      doc.setFontSize(12)
      doc.setFont('Helvetica', 'bold')
      doc.text('CHI TIET CAC DOT THANH TOAN:', 20, 176)

      const headers = [['Dot', 'So tien', 'Phuong thuc', 'Ghi chu', 'Ngay thu']]
      const rows = project.payments.map((p, idx) => [
        `Dot ${idx + 1}`,
        formatCurrency(p.amount),
        p.type === 'DEPOSIT' ? 'Dat coc' : (p.type === 'EXTRA' ? 'Thu them' : 'Thanh toan dot cuoi'),
        stripVietnameseAccents(p.note || '—'),
        new Date(p.paidAt).toLocaleDateString('vi-VN')
      ])

      autoTable(doc, {
        startY: 182,
        head: headers,
        body: rows,
        theme: 'grid',
        styles: { font: 'Helvetica', fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] }, // indigo
      })
    }

    doc.save(`Bao_gia_${project.projectCode}.pdf`)
  }

  const stripVietnameseAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }

  const load = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await projectApi.getById(Number(id))
      setProject(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="empty-state">
        <h3>Không tìm thấy công trình</h3>
        <button className="btn btn-primary" onClick={() => navigate('/projects')} style={{ marginTop: 16 }}>
          Quay lại danh sách
        </button>
      </div>
    )
  }

  const status = projectStatusMap[project.status]
  const paidTotal = project.deposit + project.extraPaid
  const paidPercent = project.totalAmount > 0
    ? Math.min(100, Math.round((paidTotal / project.totalAmount) * 100))
    : 0

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-secondary btn-icon" onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <code style={{ fontSize: 13, color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '3px 8px', borderRadius: 5, fontWeight: 700 }}>
              {project.projectCode}
            </code>
            <span className={status.className}>{status.label}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{project.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={exportQuotation} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={15} />
            Báo giá PDF
          </button>
          <button className="btn btn-secondary" onClick={() => setShowPayment(true)}>
            <CreditCard size={15} />
            Ghi thu tiền
          </button>
          <button className="btn btn-primary" onClick={() => setShowEdit(true)}>
            <Pencil size={15} />
            Sửa thông tin
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
        <button
          className={`btn ${activeTab === 'payment' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('payment')}
          style={{ fontSize: 13, fontWeight: 700 }}
        >
          💰 Thanh toán & Tiến độ
        </button>
        <button
          className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('materials')}
          style={{ fontSize: 13, fontWeight: 700 }}
        >
          📦 Chi phí & Vật tư
        </button>
        <button
          className={`btn ${activeTab === 'warranty' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('warranty')}
          style={{ fontSize: 13, fontWeight: 700 }}
        >
          🛡️ Bảo hành
        </button>
      </div>

      {activeTab === 'payment' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Info Card */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Thông tin chung
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <InfoRow icon={<Phone size={14} />} label="Khách hàng" value={project.customerName} />
                <InfoRow icon={<Phone size={14} />} label="SĐT" value={project.customerPhone || '—'} />
                <InfoRow icon={<MapPin size={14} />} label="Địa chỉ" value={project.address || '—'} span />
                <InfoRow icon={<Calendar size={14} />} label="Bắt đầu" value={formatDate(project.startDate)} />
                <InfoRow icon={<Calendar size={14} />} label="Giao hàng" value={formatDate(project.deliveryDate)} />
                {project.note && <InfoRow icon={<FileText size={14} />} label="Ghi chú" value={project.note} span />}
              </div>
            </div>

            {/* Dimensions & Calc */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Kích thước & Tính tiền
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <CalcItem label="Chiều dài" value={`${project.lengthM} m`} />
                <CalcItem label="Chiều rộng" value={`${project.widthM} m`} />
                <CalcItem label="Diện tích" value={`${Number(project.areaM2).toFixed(2)} m²`} highlight />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <CalcItem label="Đơn giá" value={formatCurrency(project.unitPrice)} />
                <CalcItem label="Thành tiền" value={formatCurrency(project.totalAmount)} highlight big />
              </div>
            </div>

            {/* Payment history */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Lịch sử thanh toán
                </h3>
                <button className="btn btn-success btn-sm" onClick={() => setShowPayment(true)}>
                  <Plus size={14} />
                  Ghi thu tiền
                </button>
              </div>

              {project.payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
                  Chưa có lần thu nào
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {project.payments.map((pay) => (
                    <div key={pay.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--color-border-light)',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={14} color="var(--color-success)" />
                          {paymentTypeMap[pay.type]}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {formatDateTime(pay.paidAt)}
                          {pay.note && ` • ${pay.note}`}
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: 15 }}>
                        +{formatCurrency(pay.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Payment summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tình trạng thanh toán
              </h3>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Đã thanh toán</span>
                  <span style={{ fontWeight: 700 }}>{paidPercent}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--color-border)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${paidPercent}%`,
                    background: paidPercent >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
                    borderRadius: 100,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SumRow label="Thành tiền" value={formatCurrency(project.totalAmount)} color="var(--color-text-primary)" bold />
                <div style={{ height: 1, background: 'var(--color-border)' }} />
                <SumRow label="Tiền cọc" value={`- ${formatCurrency(project.deposit)}`} color="var(--color-success)" />
                <SumRow label="Đã thu thêm" value={`- ${formatCurrency(project.extraPaid)}`} color="var(--color-success)" />
                <div style={{ height: 1, background: 'var(--color-border)' }} />
                <SumRow
                  label="Còn nợ"
                  value={formatCurrency(project.remainingDebt)}
                  color={project.remainingDebt > 0 ? 'var(--color-danger)' : 'var(--color-success)'}
                  big
                  bold
                />
              </div>

              {project.remainingDebt <= 0 && (
                <div style={{
                  marginTop: 20, padding: '12px 16px',
                  background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--color-success)', fontSize: 14, fontWeight: 600,
                }}>
                  <CheckCircle2 size={16} />
                  Đã thanh toán đầy đủ
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tiến độ thời gian
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DateRow label="Tạo lúc" value={formatDateTime(project.createdAt)} icon={<Clock size={14} />} />
                <DateRow label="Bắt đầu" value={formatDate(project.startDate)} icon={<Calendar size={14} />} />
                <DateRow label="Giao hàng" value={formatDate(project.deliveryDate)} icon={<Calendar size={14} />}
                  isOverdue={!!project.deliveryDate && new Date(project.deliveryDate) < new Date() && project.status !== 'COMPLETED'}
                />
                <DateRow label="Cập nhật" value={formatDateTime(project.updatedAt)} icon={<Clock size={14} />} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <ProjectMaterialsTab projectId={project.id} totalAmount={project.totalAmount} onUpdate={load} />
      )}

      {activeTab === 'warranty' && (
        <ProjectWarrantyTab projectId={project.id} />
      )}

      {showEdit && (
        <ProjectFormModal
          project={project}
          onSuccess={() => { setShowEdit(false); load() }}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showPayment && (
        <PaymentModal
          projectId={project.id}
          remainingDebt={project.remainingDebt}
          onSuccess={() => { setShowPayment(false); load() }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}

function InfoRow({ icon, label, value, span }: { icon: React.ReactNode; label: string; value: string; span?: boolean }) {
  return (
    <div style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-text-primary)', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

function CalcItem({ label, value, highlight, big }: { label: string; value: string; highlight?: boolean; big?: boolean }) {
  return (
    <div style={{ padding: '12px 16px', background: highlight ? 'var(--color-primary-light)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: `1px solid ${highlight ? '#c7d2fe' : 'var(--color-border)'}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: big ? 18 : 15, fontWeight: 700, color: highlight ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{value}</div>
    </div>
  )
}

function SumRow({ label, value, color, bold, big }: { label: string; value: string; color?: string; bold?: boolean; big?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: big ? 18 : 14, fontWeight: bold ? 700 : 500, color: color ?? 'var(--color-text-primary)' }}>
        {value}
      </span>
    </div>
  )
}

function DateRow({ label, value, icon, isOverdue }: { label: string; value: string; icon: React.ReactNode; isOverdue?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13 }}>
        {icon} {label}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
        {isOverdue && '⚠️ '}{value}
      </span>
    </div>
  )
}
