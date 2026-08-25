import { useEffect, useState, useMemo } from 'react'
import { Calendar, ArrowLeft, ArrowRight, UserCheck, X } from 'lucide-react'
import dayjs from 'dayjs'
import { workerApi } from '@/shared/api/workerApi'
import type { Worker } from '@/shared/api/workerApi'
import { attendanceApi } from '@/shared/api/attendanceApi'
import type { Attendance, AttendanceRequest } from '@/shared/api/attendanceApi'

export default function AttendanceSheetPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState<{ worker: Worker; day: number; attendance?: Attendance } | null>(null)

  // Month & Year state
  const [currentDate, setCurrentDate] = useState(dayjs())

  const year = currentDate.year()
  const month = currentDate.month() + 1 // 0-indexed to 1-indexed

  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    return currentDate.daysInMonth()
  }, [currentDate])

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }, [daysInMonth])

  const loadData = async () => {
    setLoading(true)
    try {
      const startStr = currentDate.startOf('month').format('YYYY-MM-DD')
      const endStr = currentDate.endOf('month').format('YYYY-MM-DD')

      const [wList, attList] = await Promise.all([
        workerApi.getActive(),
        attendanceApi.getBetween(startStr, endStr),
      ])
      setWorkers(wList)
      setAttendances(attList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentDate])

  // Attendance lookup map: "workerId-dateStr" -> Attendance
  const attendanceMap = useMemo(() => {
    const map = new Map<string, Attendance>()
    attendances.forEach((att) => {
      map.set(`${att.workerId}-${att.workDate}`, att)
    })
    return map
  }, [attendances])

  // Calculate stats for each worker
  const getWorkerStats = (workerId: number) => {
    let totalDays = 0
    let totalOt = 0
    daysArray.forEach((d) => {
      const dateStr = currentDate.date(d).format('YYYY-MM-DD')
      const att = attendanceMap.get(`${workerId}-${dateStr}`)
      if (att && att.isPresent) {
        totalDays += (att.hoursWorked ?? 8.0) / 8.0
        totalOt += att.otHours ?? 0.0
      }
    })
    return { totalDays, totalOt }
  }

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))
  const selectToday = () => setCurrentDate(dayjs())

  const getCellLabel = (att?: Attendance) => {
    if (!att || !att.isPresent) return null
    const hours = att.hoursWorked ?? 8.0
    const ot = att.otHours ?? 0.0
    if (ot > 0) return `${hours}+${ot}`
    if (hours !== 8.0) return `${hours}h`
    return '✓'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🗓️ Bảng Chấm Công</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Nhấp chuột vào ô để mở bảng chấm công chi tiết (Xanh lá: Có đi làm • Số hiển thị: Giờ làm việc + Giờ OT).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={prevMonth}>
            <ArrowLeft size={14} />
          </button>
          <div style={{
            background: 'var(--color-bg)', border: '1.5px solid var(--color-border)',
            padding: '6px 16px', borderRadius: 'var(--radius-sm)',
            fontWeight: 800, fontSize: 14, minWidth: 160, textAlign: 'center',
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
          }}>
            <Calendar size={15} color="var(--color-primary)" />
            Tháng {month} / {year}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={nextMonth} disabled={currentDate.isSame(dayjs(), 'month')}>
            <ArrowRight size={14} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={selectToday}>
            Hôm nay
          </button>
        </div>
      </div>

      {/* Grid Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && workers.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : workers.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <UserCheck size={44} color="var(--color-text-muted)" />
            <h3>Không có thợ đang làm việc</h3>
            <p>Vui lòng kích hoạt/thêm thợ trong trang "Quản lý Thợ" trước.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="attendance-grid-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)' }}>
                  <th style={{
                    padding: '14px 20px', textAlign: 'left', fontWeight: 800, fontSize: 13,
                    position: 'sticky', left: 0, background: 'var(--color-bg)', zIndex: 10,
                    borderRight: '1.5px solid var(--color-border)', width: 180,
                  }}>
                    Tên thợ
                  </th>
                  {daysArray.map((day) => {
                    const isToday = currentDate.date(day).isSame(dayjs(), 'day')
                    const isWeekend = [0, 6].includes(currentDate.date(day).day())
                    return (
                      <th
                        key={day}
                        style={{
                          padding: 8, textAlign: 'center', fontWeight: 800, fontSize: 11,
                          minWidth: 36,
                          background: isToday ? 'var(--color-primary-light)' : 'transparent',
                          color: isToday ? 'var(--color-primary)' : (isWeekend ? 'var(--color-danger)' : 'var(--color-text-primary)'),
                          borderRight: '1px solid var(--color-border-light)',
                        }}
                      >
                        {day}
                      </th>
                    )
                  })}
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, fontSize: 13, minWidth: 100, background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    Tổng công tháng
                  </th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => {
                  const { totalDays, totalOt } = getWorkerStats(w.id)
                  return (
                    <tr key={w.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{
                        padding: '14px 20px', fontWeight: 700, fontSize: 13,
                        position: 'sticky', left: 0, background: 'var(--color-bg)', zIndex: 9,
                        borderRight: '1.5px solid var(--color-border)',
                      }}>
                        {w.name}
                      </td>
                      {daysArray.map((day) => {
                        const dateStr = currentDate.date(day).format('YYYY-MM-DD')
                        const cellKey = `${w.id}-${dateStr}`
                        const att = attendanceMap.get(cellKey)
                        const isPresent = att ? att.isPresent : false
                        const isFuture = currentDate.date(day).isAfter(dayjs(), 'day')
                        const isToday = currentDate.date(day).isSame(dayjs(), 'day')
                        const label = getCellLabel(att)

                        return (
                          <td
                            key={day}
                            style={{
                              padding: 4, textAlign: 'center',
                              borderRight: '1px solid var(--color-border-light)',
                              background: isToday ? 'var(--color-bg-light)' : 'transparent',
                            }}
                          >
                            <button
                              disabled={isFuture}
                              onClick={() => setSelectedCell({ worker: w, day, attendance: att })}
                              style={{
                                minWidth: 26, height: 22, border: 'none', borderRadius: 4,
                                cursor: isFuture ? 'not-allowed' : 'pointer',
                                background: isPresent ? 'var(--color-success)' : (isFuture ? '#f1f5f9' : '#e2e8f0'),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s ease', margin: '0 auto',
                                outline: 'none',
                                opacity: isFuture ? 0.4 : 1,
                                color: isPresent ? '#fff' : 'var(--color-text-secondary)',
                                fontSize: 10, fontWeight: 800, padding: '0 4px',
                              }}
                              title={att?.note ? `Ghi chú: ${att.note}` : undefined}
                            >
                              {label || (isPresent ? '✓' : null)}
                            </button>
                          </td>
                        )
                      })}
                      <td style={{
                        padding: '14px 16px', textAlign: 'center', fontWeight: 800, fontSize: 13,
                        color: 'var(--color-primary)', background: 'var(--color-primary-light)',
                      }}>
                        {totalDays} công {totalOt > 0 ? `(+${totalOt}h OT)` : ''}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCell && (
        <AttendanceModal
          worker={selectedCell.worker}
          day={selectedCell.day}
          currentDate={currentDate}
          attendance={selectedCell.attendance}
          onClose={() => setSelectedCell(null)}
          onSave={async (data) => {
            const dateStr = currentDate.date(selectedCell.day).format('YYYY-MM-DD')
            await attendanceApi.saveBulk({
              workDate: dateStr,
              checkIns: [data],
            })
            setSelectedCell(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

interface AttendanceModalProps {
  worker: Worker
  day: number
  currentDate: dayjs.Dayjs
  attendance?: Attendance
  onClose: () => void
  onSave: (data: AttendanceRequest) => Promise<void>
}

function AttendanceModal({ worker, day, currentDate, attendance, onClose, onSave }: AttendanceModalProps) {
  const dateStr = currentDate.date(day).format('DD/MM/YYYY')

  const [isPresent, setIsPresent] = useState(attendance ? attendance.isPresent : false)
  const [hoursWorked, setHoursWorked] = useState(attendance?.hoursWorked ?? 8.0)
  const [otHours, setOtHours] = useState(attendance?.otHours ?? 0.0)
  const [otCoefficient, setOtCoefficient] = useState(attendance?.otCoefficient ?? 1.5)
  const [note, setNote] = useState(attendance?.note ?? '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSave({
        workerId: worker.id,
        isPresent,
        hoursWorked: isPresent ? hoursWorked : 0,
        otHours: isPresent ? otHours : 0,
        otCoefficient: isPresent ? otCoefficient : 1.5,
        note,
      })
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu chấm công!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">📝 Chấm công thợ</h2>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Tên thợ</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: 'var(--color-primary)' }}>{worker.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Ngày chấm công</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{dateStr}</div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <input
                type="checkbox"
                id="isPresent"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <label htmlFor="isPresent" style={{ fontWeight: 700, cursor: 'pointer', margin: 0 }}>
                Có đi làm (Present)
              </label>
            </div>

            {isPresent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 14px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                {/* Giờ làm việc tiêu chuẩn */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Số giờ làm việc tiêu chuẩn</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <button type="button" className={`btn btn-sm ${hoursWorked === 8.0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setHoursWorked(8.0)} style={{ flex: 1, padding: '4px 0' }}>
                      Cả ngày (8h)
                    </button>
                    <button type="button" className={`btn btn-sm ${hoursWorked === 4.0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setHoursWorked(4.0)} style={{ flex: 1, padding: '4px 0' }}>
                      Nửa ngày (4h)
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(Number(e.target.value))}
                    className="form-input"
                    placeholder="Nhập số giờ"
                  />
                </div>

                {/* Tăng ca OT */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Số giờ tăng ca (OT)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={otHours}
                    onChange={(e) => setOtHours(Number(e.target.value))}
                    className="form-input"
                    placeholder="Ví dụ: 2.0"
                  />
                </div>

                {/* Hệ số tăng ca */}
                {otHours > 0 && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Hệ số tăng ca (OT)</label>
                    <select
                      value={otCoefficient}
                      onChange={(e) => setOtCoefficient(Number(e.target.value))}
                      className="form-input"
                    >
                      <option value={1.5}>x1.5 (Ngày thường)</option>
                      <option value={2.0}>x2.0 (Chủ nhật / Lễ)</option>
                      <option value={2.5}>x2.5</option>
                      <option value={3.0}>x3.0</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ghi chú</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-input"
                placeholder="Ví dụ: Tăng ca tối ráp Xingfa"
              />
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {submitting ? 'Đang lưu...' : 'Lưu chấm công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
