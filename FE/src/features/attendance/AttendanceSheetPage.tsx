import { useEffect, useState, useMemo } from 'react'
import { Calendar, Save, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react'
import dayjs from 'dayjs'
import { workerApi } from '@/shared/api/workerApi'
import type { Worker } from '@/shared/api/workerApi'
import { attendanceApi } from '@/shared/api/attendanceApi'
import type { Attendance } from '@/shared/api/attendanceApi'

export default function AttendanceSheetPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null) // tracker for cell level save status

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

  // Handle cell click (toggle attendance)
  const handleToggle = async (workerId: number, day: number) => {
    const dateStr = currentDate.date(day).format('YYYY-MM-DD')
    
    // Guard: Prevent ticking future days
    if (currentDate.date(day).isAfter(dayjs(), 'day')) {
      alert('Không thể chấm công cho các ngày trong tương lai!')
      return
    }

    const cellKey = `${workerId}-${dateStr}`
    const existing = attendanceMap.get(cellKey)
    const newIsPresent = existing ? !existing.isPresent : true

    // Optimistic UI update
    setSavingId(cellKey)
    const updatedLocal = [...attendances]
    const idx = updatedLocal.findIndex((a) => a.workerId === workerId && a.workDate === dateStr)
    
    const newRecord: Attendance = {
      workerId,
      workerName: '',
      workDate: dateStr,
      isPresent: newIsPresent,
      note: '',
    }

    if (idx >= 0) {
      updatedLocal[idx] = { ...updatedLocal[idx], isPresent: newIsPresent }
    } else {
      updatedLocal.push(newRecord)
    }
    setAttendances(updatedLocal)

    try {
      // Call API in the background
      await attendanceApi.saveBulk({
        workDate: dateStr,
        checkIns: [{ workerId, isPresent: newIsPresent, note: '' }],
      })
    } catch (err) {
      console.error(err)
      // Rollback on error
      loadData()
    } finally {
      setSavingId(null)
    }
  }

  // Calculate stats for each worker
  const getWorkerStats = (workerId: number) => {
    let presentCount = 0
    daysArray.forEach((d) => {
      const dateStr = currentDate.date(d).format('YYYY-MM-DD')
      const att = attendanceMap.get(`${workerId}-${dateStr}`)
      if (att && att.isPresent) {
        presentCount++
      }
    })
    return presentCount
  }

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))
  const selectToday = () => setCurrentDate(dayjs())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🗓️ Bảng Chấm Công</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Nhấp chuột vào ô để chấm công ngày cho thợ (Màu xanh: Đi làm • Trống: Nghỉ).
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
                          minWidth: 32,
                          background: isToday ? 'var(--color-primary-light)' : 'transparent',
                          color: isToday ? 'var(--color-primary)' : (isWeekend ? 'var(--color-danger)' : 'var(--color-text-primary)'),
                          borderRight: '1px solid var(--color-border-light)',
                        }}
                      >
                        {day}
                      </th>
                    )
                  })}
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, fontSize: 13, minWidth: 80, background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    Công tháng
                  </th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => {
                  const presentCount = getWorkerStats(w.id)
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
                              onClick={() => handleToggle(w.id, day)}
                              style={{
                                width: 22, height: 22, border: 'none', borderRadius: 4,
                                cursor: isFuture ? 'not-allowed' : 'pointer',
                                background: isPresent ? 'var(--color-success)' : (isFuture ? '#f1f5f9' : '#e2e8f0'),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s ease', margin: '0 auto',
                                outline: 'none',
                                opacity: isFuture ? 0.4 : 1,
                              }}
                              className="attendance-checkbox"
                            >
                              {savingId === cellKey ? (
                                <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5, borderColor: '#fff' }} />
                              ) : isPresent ? (
                                <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>
                              ) : null}
                            </button>
                          </td>
                        )
                      })}
                      <td style={{
                        padding: '14px 16px', textAlign: 'center', fontWeight: 800, fontSize: 14,
                        color: 'var(--color-primary)', background: 'var(--color-primary-light)',
                      }}>
                        {presentCount} công
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
