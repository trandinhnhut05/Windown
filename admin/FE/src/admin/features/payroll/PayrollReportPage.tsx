import { useEffect, useState, useMemo } from 'react'
import { Calendar, Printer, DollarSign, Wallet, PiggyBank, HandCoins, Wrench } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { payrollApi } from '@/shared/api/payrollApi'
import type { Payroll } from '@/shared/api/payrollApi'
import { formatCurrency } from '@/shared/utils/format'
import AdvanceModal from './AdvanceModal'
import PieceworkModal from './PieceworkModal'
import PayrollPrintModal from './PayrollPrintModal'

export default function PayrollReportPage() {
  const [payrollList, setPayrollList] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)

  // Date State
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  // Modal State
  const [advanceTarget, setAdvanceTarget] = useState<Payroll | null>(null)
  const [pieceworkTarget, setPieceworkTarget] = useState<Payroll | null>(null)
  const [showPrintModal, setShowPrintModal] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await payrollApi.getMonthly({ year, month })
      setPayrollList(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [year, month])

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

  // Export Payroll PDF (Unaccented Vietnamese for clean Helvetica font rendering)
  const exportPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(`BANG LUONG NHAN VIEN - THANG ${month}/${year}`, 20, 20)

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    doc.text(`Ngay lap bang: ${new Date().toLocaleDateString('vi-VN')}`, 20, 28)

    // Summary Section
    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('TONG HOP QUY LUONG:', 20, 42)

    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`- Tong Quy luong: ${formatCurrency(totals.earned)}`, 20, 50)
    doc.text(`- Tong Da ung: ${formatCurrency(totals.advanced)}`, 20, 58)
    doc.text(`- Con lai thuc linh: ${formatCurrency(totals.remaining)}`, 20, 66)

    // Table
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('CHI TIET BANG LUONG THO:', 20, 80)

    const headers = [['Ten tho', 'Cong ngay', 'Tang ca', 'Luong cong', 'Luong khoan', 'Da ung', 'Thuc linh']]
    const rows = payrollList.map((p) => [
      stripVietnameseAccents(p.workerName),
      `${p.presentDays} cong`,
      `${p.totalOtHours}h OT`,
      formatCurrency(p.totalEarnedFromAttendance),
      formatCurrency(p.totalPieceworkAmount),
      formatCurrency(p.totalAdvanced),
      formatCurrency(p.remainingSalary),
    ])

    autoTable(doc, {
      startY: 85,
      head: headers,
      body: rows,
      theme: 'grid',
      styles: { font: 'Helvetica', fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] }, // indigo
    })

    doc.save(`Bang_luong_thang_${month}_${year}.pdf`)
  }

  // Helper to strip diacritics for safe PDF print
  const stripVietnameseAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>💵 Tính lương thợ xưởng</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Tự động tổng hợp ngày công, giờ tăng ca (OT), đối chiếu lương khoán sản phẩm và tiền tạm ứng của thợ.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="form-input" style={{ width: 100, margin: 0 }} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
          <select className="form-input" style={{ width: 120, margin: 0 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => setShowPrintModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Printer size={16} />
            In bảng lương PDF
          </button>
        </div>
      </div>

      {/* KPI summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <SummaryCard title="Tổng quỹ lương" value={formatCurrency(totals.earned)} color="var(--color-primary)" icon={<Wallet size={20} />} />
        <SummaryCard title="Tổng đã ứng" value={formatCurrency(totals.advanced)} color="var(--color-warning)" icon={<PiggyBank size={20} />} />
        <SummaryCard title="Cần thanh toán (Thực lĩnh)" value={formatCurrency(totals.remaining)} color="var(--color-success)" icon={<HandCoins size={20} />} highlight />
      </div>

      {/* Payroll Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : payrollList.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <DollarSign size={44} color="var(--color-text-muted)" />
            <h3>Bảng lương trống</h3>
            <p>Không có ghi nhận công ngày hoặc thợ hoạt động trong tháng này.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Tên thợ</th>
                  <th style={{ textAlign: 'right' }}>Lương ngày</th>
                  <th style={{ textAlign: 'center' }}>Công ngày</th>
                  <th style={{ textAlign: 'center' }}>Tăng ca</th>
                  <th style={{ textAlign: 'right' }}>Lương công nhật</th>
                  <th style={{ textAlign: 'right' }}>Lương khoán</th>
                  <th style={{ textAlign: 'right' }}>Tổng lương</th>
                  <th style={{ textAlign: 'right' }}>Đã ứng</th>
                  <th style={{ textAlign: 'right' }}>Thực lĩnh còn lại</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {payrollList.map((p) => (
                  <tr key={p.workerId}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{p.workerName}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(p.dailyWage)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.presentDays} công</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.totalOtHours > 0 ? `${p.totalOtHours}h` : '0h'}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(p.totalEarnedFromAttendance)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: 600 }}>{formatCurrency(p.totalPieceworkAmount)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(p.totalEarned)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-warning)', fontWeight: 600 }}>{p.totalAdvanced > 0 ? `-${formatCurrency(p.totalAdvanced)}` : '0 ₫'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: p.remainingSalary >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {formatCurrency(p.remainingSalary)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setAdvanceTarget(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, fontWeight: 700 }}
                        >
                          💸 Ghi ứng
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setPieceworkTarget(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, fontWeight: 700, borderColor: '#a7f3d0', color: '#047857', background: '#ecfdf5' }}
                        >
                          <Wrench size={12} />
                          Ghi khoán
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {advanceTarget && (
        <AdvanceModal
          worker={advanceTarget}
          onSuccess={() => { setAdvanceTarget(null); loadData() }}
          onClose={() => setAdvanceTarget(null)}
        />
      )}

      {pieceworkTarget && (
        <PieceworkModal
          worker={pieceworkTarget}
          onSuccess={() => { setPieceworkTarget(null); loadData() }}
          onClose={() => setPieceworkTarget(null)}
        />
      )}

      {showPrintModal && (
        <PayrollPrintModal
          payrollList={payrollList}
          month={month}
          year={year}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  )
}

function SummaryCard({ title, value, color, icon, highlight }: { title: string; value: string; color: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      padding: '20px 24px',
      background: highlight ? '#f0fdf4' : 'var(--color-bg)',
      border: `1.5px solid ${highlight ? '#bbf7d0' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    }}>
      <div style={{
        padding: 12,
        borderRadius: 100,
        background: highlight ? '#dcfce7' : 'var(--color-bg-light)',
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  )
}
