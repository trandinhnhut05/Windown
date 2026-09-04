import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Package, Users,
  Calendar, Shield, LogOut, ChevronRight, CheckSquare, DollarSign, Settings, TrendingUp
} from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { reminderApi } from '@/shared/api/reminderApi'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Tổng quan' },
  { to: '/projects', icon: <Briefcase size={18} />, label: 'Công trình' },
  { to: '/warehouse', icon: <Package size={18} />, label: 'Quản lý kho' },
  { to: '/workers', icon: <Users size={18} />, label: 'Danh sách thợ' },
  { to: '/attendance', icon: <CheckSquare size={18} />, label: 'Chấm công' },
  { to: '/payroll', icon: <DollarSign size={18} />, label: 'Tính lương' },
  { to: '/finance', icon: <TrendingUp size={18} />, label: 'Báo cáo tài chính' },
  { to: '/schedule', icon: <Calendar size={18} />, label: 'Lịch nhắc việc' },
  { to: '/warranty', icon: <Shield size={18} />, label: 'Bảo hành' },
  { to: '/settings', icon: <Settings size={18} />, label: 'Thiết lập' },
]

export default function AppShell() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const [pendingRemindersCount, setPendingRemindersCount] = useState(0)

  const fetchPendingCount = async () => {
    try {
      const data = await reminderApi.getPending()
      setPendingRemindersCount(data.length)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPendingCount()
    window.addEventListener('reminder-changed', fetchPendingCount)
    return () => window.removeEventListener('reminder-changed', fetchPendingCount)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    const path = window.location.pathname
    if (path.includes('dashboard')) return 'Tổng quan'
    if (path.includes('projects')) return 'Quản lý Công trình'
    if (path.includes('warehouse')) return 'Quản lý kho Vật tư'
    if (path.includes('materials')) return 'Quản lý Vật tư'
    if (path.includes('workers')) return 'Danh sách thợ'
    if (path.includes('attendance')) return 'Bảng chấm công'
    if (path.includes('payroll')) return 'Tính lương thợ'
    if (path.includes('finance')) return 'Báo cáo tài chính'
    if (path.includes('schedule')) return 'Lịch nhắc việc'
    if (path.includes('warranty')) return 'Bảo hành'
    if (path.includes('settings')) return 'Thiết lập & Sao lưu'
    return 'Windown'
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🪟 Windown</h1>
          <span>Quản lý Xưởng Nhôm Kính</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Quản lý</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.to === '/schedule' && pendingRemindersCount > 0 && (
                <span
                  style={{
                    background: 'var(--color-danger)',
                    color: '#fff',
                    borderRadius: 100,
                    padding: '2px 6px',
                    fontSize: 10,
                    fontWeight: 900,
                    marginRight: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 16,
                    height: 16,
                  }}
                >
                  {pendingRemindersCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </div>
              <div className="user-role">{user?.role === 'OWNER' ? 'Chủ xưởng' : 'Nhân viên'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-icon"
              title="Đăng xuất"
              style={{ color: '#94a3b8', background: 'transparent', border: 'none' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="top-bar">
          <h2 className="page-title">{getPageTitle()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <span>Windown</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{getPageTitle()}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
