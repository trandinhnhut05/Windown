import { useEffect, useState, useMemo } from 'react'
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { Calendar, Plus, Trash2, DollarSign, Wallet, Percent, FileText, ArrowRightLeft } from 'lucide-react'
import { financeApi, expenseCategoryMap } from '@/shared/api/financeApi'
import type { Expense, FinancialReport, ExpenseCategory } from '@/shared/api/financeApi'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import ExpenseFormModal from './ExpenseFormModal'
import dayjs from 'dayjs'

export default function FinanceReportPage() {
  const [activeTab, setActiveTab] = useState<'charts' | 'expenses'>('charts')

  // Chart States
  const [year, setYear] = useState(new Date().getFullYear())
  const [reportData, setReportData] = useState<FinancialReport[]>([])
  const [loadingReport, setLoadingReport] = useState(true)

  // Expense States
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'))
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  // Load Financial Report
  const loadReport = async () => {
    setLoadingReport(true)
    try {
      const data = await financeApi.getReport(year)
      setReportData(data)
    } catch (err) {
      console.error('Không thể tải báo cáo tài chính', err)
    } finally {
      setLoadingReport(false)
    }
  }

  // Load Expenses
  const loadExpenses = async () => {
    setLoadingExpenses(true)
    try {
      const data = await financeApi.getExpenses(startDate, endDate)
      setExpenses(data)
    } catch (err) {
      console.error('Không thể tải chi phí chung', err)
    } finally {
      setLoadingExpenses(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'charts') {
      loadReport()
    } else {
      loadExpenses()
    }
  }, [activeTab, year, startDate, endDate])

  // Summaries for the selected year
  const yearSummaries = useMemo(() => {
    return reportData.reduce(
      (acc, r) => {
        const totalCost = r.materialCost + r.laborCost + r.generalExpense
        acc.revenue += r.revenue
        acc.cost += totalCost
        acc.netProfit += r.netProfit
        return acc
      },
      { revenue: 0, cost: 0, netProfit: 0 }
    )
  }, [reportData])

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chi phí này?')) return
    try {
      await financeApi.deleteExpense(id)
      loadExpenses()
    } catch (err) {
      alert('Không thể xóa chi phí!')
    }
  }

  // Formatting chart values
  const chartData = useMemo(() => {
    return reportData.map((r) => ({
      name: `Tháng ${r.month}`,
      'Doanh thu': r.revenue,
      'Chi phí': r.materialCost + r.laborCost + r.generalExpense,
      'Lợi nhuận ròng': r.netProfit,
    }))
  }, [reportData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>📊 Báo cáo Tài chính</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Theo dõi chi tiết Doanh thu, Chi phí (Vật tư, Nhân công, Mặt bằng, Điện nước...) và Lợi nhuận ròng của xưởng.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--color-bg-light)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('charts')}
            className={`btn btn-sm ${activeTab === 'charts' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, fontWeight: 700, border: 'none' }}
          >
            📉 Biểu đồ Lợi nhuận
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`btn btn-sm ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, fontWeight: 700, border: 'none' }}
          >
            💸 Chi phí chung xưởng
          </button>
        </div>
      </div>

      {activeTab === 'charts' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Year and Print Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)' }}>Chọn năm báo cáo:</span>
            <select className="form-input" style={{ width: 120, margin: 0 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>

          {/* Cards summaries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <SummaryCard title="Tổng doanh thu năm" value={formatCurrency(yearSummaries.revenue)} color="var(--color-primary)" icon={<Wallet size={20} />} />
            <SummaryCard title="Tổng chi phí sản xuất" value={formatCurrency(yearSummaries.cost)} color="var(--color-warning)" icon={<ArrowRightLeft size={20} />} />
            <SummaryCard title="Lợi nhuận ròng thực nhận" value={formatCurrency(yearSummaries.netProfit)} color="var(--color-success)" icon={<DollarSign size={20} />} highlight />
          </div>

          {/* Chart Section */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>📉 Sơ đồ tài chính xưởng năm {year} (VND)</h3>
            {loadingReport ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <span className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}M` : `${v}`)}
                    />
                    <Tooltip
                      formatter={(v) => [formatCurrency(Number(v)), '']}
                      contentStyle={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Doanh thu" fill="#4f6edb" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Chi phí" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line type="monotone" dataKey="Lợi nhuận ròng" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Detailed Monthly Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>📊 Bảng kê tài chính chi tiết theo tháng</h3>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th style={{ textAlign: 'right' }}>Doanh thu</th>
                    <th style={{ textAlign: 'right' }}>Chi phí Vật tư</th>
                    <th style={{ textAlign: 'right' }}>Chi phí Nhân công</th>
                    <th style={{ textAlign: 'right' }}>Chi phí chung xưởng</th>
                    <th style={{ textAlign: 'right' }}>Tổng chi phí</th>
                    <th style={{ textAlign: 'right' }}>Lợi nhuận ròng</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((r) => {
                    const totalCost = r.materialCost + r.laborCost + r.generalExpense
                    const isProfit = r.netProfit >= 0
                    return (
                      <tr key={r.month}>
                        <td style={{ fontWeight: 700 }}>Tháng {r.month}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(r.revenue)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(r.materialCost)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(r.laborCost)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>{formatCurrency(r.generalExpense)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatCurrency(totalCost)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: isProfit ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {formatCurrency(r.netProfit)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Filters Bar */}
          <div className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="date" className="form-input" style={{ width: 150, margin: 0 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>đến</span>
              <input type="date" className="form-input" style={{ width: 150, margin: 0 }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} />
              Ghi nhận Chi phí mới
            </button>
          </div>

          {/* Expenses Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loadingExpenses ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <span className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : expenses.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 0' }}>
                <DollarSign size={44} color="var(--color-text-muted)" />
                <h3>Chưa ghi nhận chi phí chung nào</h3>
                <p>Nhấn nút "Ghi nhận Chi phí mới" để nhập tiền điện nước, mặt bằng xưởng hoặc tiền vận tải.</p>
              </div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 20 }}>Ngày chi</th>
                      <th>Danh mục</th>
                      <th>Mô tả chi tiết</th>
                      <th style={{ textAlign: 'right' }}>Số tiền</th>
                      <th style={{ textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => {
                      const badge = expenseCategoryMap[e.category] || { label: e.category, className: 'badge-secondary' }
                      return (
                        <tr key={e.id}>
                          <td style={{ paddingLeft: 20, fontWeight: 600 }}>{formatDate(e.expenseDate)}</td>
                          <td>
                            <span className={`badge ${badge.className}`}>{badge.label}</span>
                          </td>
                          <td style={{ color: 'var(--color-text-secondary)' }}>{e.description || '—'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-danger)', fontSize: 14 }}>
                            -{formatCurrency(e.amount)}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button
                                className="btn btn-secondary btn-sm btn-icon"
                                onClick={() => handleDeleteExpense(e.id)}
                                style={{ padding: 6 }}
                              >
                                <Trash2 size={14} color="var(--color-danger)" />
                              </button>
                            </div>
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
      )}

      {showExpenseModal && (
        <ExpenseFormModal
          onSuccess={() => { setShowExpenseModal(false); loadExpenses(); loadReport() }}
          onClose={() => setShowExpenseModal(false)}
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
