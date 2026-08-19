import { useEffect, useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Calendar, CheckSquare, Square, Bell, CheckCircle } from 'lucide-react'
import dayjs from 'dayjs'
import { reminderApi } from '@/shared/api/reminderApi'
import type { Reminder, ReminderType } from '@/shared/api/reminderApi'
import ReminderFormModal from './ReminderFormModal'
import ConfirmModal from '@/shared/components/ConfirmModal'
import { Link } from 'react-router-dom'

export default function ReminderListPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL')

  // Modals state
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await reminderApi.getAll()
      setReminders(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (id: number) => {
    // Optimistic UI update
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDone: !r.isDone } : r))
    )
    try {
      await reminderApi.toggleDone(id)
      window.dispatchEvent(new CustomEvent('reminder-changed'))
    } catch (err) {
      console.error(err)
      loadData()
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await reminderApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      window.dispatchEvent(new CustomEvent('reminder-changed'))
      loadData()
    } catch (err) {
      console.error(err)
      alert('Không thể xóa nhắc nhở!')
    } finally {
      setDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingReminder(null)
    window.dispatchEvent(new CustomEvent('reminder-changed'))
    loadData()
  }

  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      if (filter === 'PENDING') return !r.isDone
      if (filter === 'DONE') return r.isDone
      return true
    })
  }, [reminders, filter])

  const stats = useMemo(() => {
    const total = reminders.length
    const pending = reminders.filter((r) => !r.isDone).length
    const done = total - pending
    return { total, pending, done }
  }, [reminders])

  const getBadgeClass = (type: ReminderType) => {
    switch (type) {
      case 'DELIVERY':
        return 'badge-info'
      case 'PAYMENT':
        return 'badge-success'
      case 'WARRANTY':
        return 'badge-warning'
      default:
        return 'badge-secondary'
    }
  }

  const getBadgeLabel = (type: ReminderType) => {
    switch (type) {
      case 'DELIVERY':
        return '🚚 Giao hàng / Thi công'
      case 'PAYMENT':
        return '💰 Thu tiền'
      case 'WARRANTY':
        return '🛡️ Bảo hành'
      default:
        return '☕ Việc khác'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>⏰ Lịch nhắc việc</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Theo dõi tiến độ, đo đạc kính, lắp đặt nhôm và thời gian liên hệ thu tiền khách hàng.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingReminder(null); setShowForm(true) }}>
          <Plus size={16} />
          Thêm nhắc việc
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 10, borderRadius: 100, background: 'var(--color-bg-light)', color: 'var(--color-text-primary)' }}>
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Tổng nhắc việc</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)' }}>{stats.total} công việc</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ padding: 10, borderRadius: 100, background: '#fef3c7', color: 'var(--color-warning)' }}>
            <Bell size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Chưa hoàn thành</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-warning)' }}>{stats.pending} công việc</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ padding: 10, borderRadius: 100, background: '#dcfce7', color: 'var(--color-success)' }}>
            <CheckCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Đã hoàn thành</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-success)' }}>{stats.done} công việc</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ padding: 12, display: 'flex', gap: 8 }}>
        <button
          className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('ALL')}
        >
          Tất cả ({stats.total})
        </button>
        <button
          className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('PENDING')}
        >
          Chưa làm ({stats.pending})
        </button>
        <button
          className={`btn btn-sm ${filter === 'DONE' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('DONE')}
        >
          Đã xong ({stats.done})
        </button>
      </div>

      {/* Reminders List Agenda */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && reminders.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <Bell size={44} color="var(--color-text-muted)" />
            <h3>Không có nhắc nhở nào</h3>
            <p>Tuyệt vời! Không có nhắc nhở nào chưa xử lý trong bộ lọc này.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredReminders.map((r, idx) => {
              const isToday = dayjs(r.remindAt).isSame(dayjs(), 'day')
              const isOverdue = dayjs(r.remindAt).isBefore(dayjs()) && !r.isDone

              return (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderBottom: idx === filteredReminders.length - 1 ? 'none' : '1px solid var(--color-border-light)',
                    background: r.isDone ? 'var(--color-bg-light)' : (isToday ? '#eff6ff' : 'transparent'),
                    opacity: r.isDone ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Complete checkbox button */}
                  <button
                    onClick={() => handleToggle(r.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: r.isDone ? 'var(--color-success)' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    {r.isDone ? <CheckSquare size={22} /> : <Square size={22} />}
                  </button>

                  {/* Title & Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: r.isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                          textDecoration: r.isDone ? 'line-through' : 'none',
                        }}
                      >
                        {r.title}
                      </span>
                      <span className={`badge ${getBadgeClass(r.type)}`} style={{ fontSize: 10, padding: '2px 6px' }}>
                        {getBadgeLabel(r.type)}
                      </span>
                      {isOverdue && (
                        <span className="badge badge-danger" style={{ fontSize: 10, padding: '2px 6px' }}>
                          Trễ hạn ⚠️
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--color-text-muted)', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: isOverdue ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                        🕒 {dayjs(r.remindAt).format('HH:mm - DD/MM/YYYY')}
                      </span>
                      {r.projectName && (
                        <>
                          <span>•</span>
                          <span style={{ fontWeight: 700 }}>
                            🏗️ Công trình:{' '}
                            <Link to={`/projects/${r.projectId}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                              {r.projectName}
                            </Link>
                          </span>
                        </>
                      )}
                    </div>

                    {r.note && (
                      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, background: '#f8fafc', padding: '6px 12px', borderRadius: 4, borderLeft: '2.5px solid #cbd5e1' }}>
                        {r.note}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Sửa nhắc nhở"
                      onClick={() => { setEditingReminder(r); setShowForm(true) }}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      title="Xóa nhắc việc"
                      onClick={() => setDeleteTarget(r)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <ReminderFormModal
          reminder={editingReminder}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingReminder(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Xóa nhắc việc"
          message={`Bạn có muốn xóa lịch nhắc việc "${deleteTarget.title}" không?`}
          confirmLabel="Xóa"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
