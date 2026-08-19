import { useEffect, useState } from 'react'
import {
  Briefcase, CheckCircle2, Clock, TrendingUp,
  AlertTriangle, ArrowUpRight, CalendarClock
} from 'lucide-react'
import { projectApi } from '@/shared/api/projectApi'
import { materialApi } from '@/shared/api/materialApi'
import { formatCurrency, formatShortCurrency, formatDate, projectStatusMap } from '@/shared/utils/format'
import {
  ResponsiveContainer, BarChart, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, Bar
} from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface DashboardStats {
  totalProjects: number
  inProgressProjects: number
  completedProjects: number
  waitingPaymentProjects: number
  totalRevenue: number
  totalDebt: number
  totalPaid: number
}

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

interface FinancialChartData {
  month: string
  revenue: number
  materialCost: number
  profit: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [chartData, setChartData] = useState<FinancialChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, c] = await Promise.all([
          projectApi.getDashboard(),
          projectApi.getAll({ size: 5 }),
          materialApi.getFinancialChart(),
        ])
        setStats(s)
        setRecentProjects(p.content)
        setChartData(c)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
      </div>
    )
  }

  const exportPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('BAO CAO TAI CHINH - XUONG NHOM KINH WINDOWN', 20, 20)

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    doc.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 20, 28)

    // Summary Section
    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('TONG QUAN TAI CHINH:', 20, 42)

    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`- Tong Doanh thu: ${formatCurrency(stats?.totalRevenue ?? 0)}`, 20, 50)
    doc.text(`- Tong Con no: ${formatCurrency(stats?.totalDebt ?? 0)}`, 20, 58)
    doc.text(`- Tong Da thu: ${formatCurrency(stats?.totalPaid ?? 0)}`, 20, 66)

    // Table Section
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('CHI TIET THEO THANG:', 20, 80)

    const headers = [['Thang', 'Doanh thu', 'Chi phi vat tu', 'Loi nhuan uoc tinh']]
    const rows = chartData.map((row) => [
      row.month,
      formatCurrency(row.revenue),
      formatCurrency(row.materialCost),
      formatCurrency(row.profit)
    ])

    autoTable(doc, {
      startY: 85,
      head: headers,
      body: rows,
      theme: 'grid',
      styles: { font: 'Helvetica', fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] }, // Indigo header color
    })

    doc.save(`Bao_cao_tai_chinh_${new Date().getFullYear()}.pdf`)
  }

  const kpis = [
    {
      label: 'Tổng công trình',
      value: stats?.totalProjects ?? 0,
      icon: <Briefcase size={22} />,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
      suffix: ' CT',
    },
    {
      label: 'Đang thi công',
      value: stats?.inProgressProjects ?? 0,
      icon: <Clock size={22} />,
      color: '#3b82f6',
      bg: '#eff6ff',
      suffix: ' CT',
    },
    {
      label: 'Hoàn thành',
      value: stats?.completedProjects ?? 0,
      icon: <CheckCircle2 size={22} />,
      color: 'var(--color-success)',
      bg: '#f0fdf4',
      suffix: ' CT',
    },
    {
      label: 'Còn nợ',
      value: formatShortCurrency(stats?.totalDebt ?? 0),
      icon: <AlertTriangle size={22} />,
      color: 'var(--color-warning)',
      bg: '#fffbeb',
      suffix: '',
      isText: true,
    },
  ]

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="kpi-card"
            style={{ '--kpi-color': kpi.color, '--kpi-bg': kpi.bg } as React.CSSProperties}
          >
            <div className="kpi-icon">{kpi.icon}</div>
            <div className="kpi-value">
              {kpi.isText ? kpi.value : `${kpi.value}${kpi.suffix}`}
            </div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <TrendingUp size={20} color="var(--color-success)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Tổng doanh thu</h3>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-success)' }}>
            {formatShortCurrency(stats?.totalRevenue ?? 0)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {formatCurrency(stats?.totalRevenue ?? 0)}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={20} color="var(--color-danger)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Tổng còn nợ</h3>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-danger)' }}>
            {formatShortCurrency(stats?.totalDebt ?? 0)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {formatCurrency(stats?.totalDebt ?? 0)}
          </div>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Doanh thu & Chi phí vật tư</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            🖨️ Xuất báo cáo PDF
          </button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 500 }} />
              <YAxis tickFormatter={(val) => `${val / 1_000_000}M`} tick={{ fontSize: 12, fontWeight: 500 }} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="materialCost" name="Chi phí vật tư" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarClock size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Công trình gần đây</h3>
          </div>
          <a href="/projects" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Xem tất cả <ArrowUpRight size={14} />
          </a>
        </div>

        {recentProjects.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} />
            <h3>Chưa có công trình nào</h3>
            <p>Thêm công trình đầu tiên để bắt đầu</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã CT</th>
                  <th>Khách hàng</th>
                  <th>Tên công trình</th>
                  <th>Thành tiền</th>
                  <th>Còn nợ</th>
                  <th>Trạng thái</th>
                  <th>Giao hàng</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => {
                  const status = projectStatusMap[p.status]
                  return (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/projects/${p.id}`}>
                      <td>
                        <code style={{ fontSize: 12, color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '2px 6px', borderRadius: 4 }}>
                          {p.projectCode}
                        </code>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.customerName}</div>
                        {p.customerPhone && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.customerPhone}</div>}
                      </td>
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {formatCurrency(p.totalAmount)}
                      </td>
                      <td style={{ fontWeight: 600, color: p.remainingDebt > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {p.remainingDebt > 0 ? formatCurrency(p.remainingDebt) : '✓ Xong'}
                      </td>
                      <td><span className={status.className}>{status.label}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {formatDate(p.deliveryDate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
