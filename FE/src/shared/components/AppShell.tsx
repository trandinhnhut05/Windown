import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Package, Users,
  Calendar, Shield, LogOut, ChevronRight, CheckSquare, DollarSign, Settings, TrendingUp, Globe
} from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { reminderApi } from '@/shared/api/reminderApi'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Tổng quan' },
  { to: '/admin/quotes', icon: <Globe size={18} />, label: 'Báo giá Web' },
  { to: '/admin/projects', icon: <Briefcase size={18} />, label: 'Công trình' },
  { to: '/admin/warehouse', icon: <Package size={18} />, label: 'Quản lý kho' },
  { to: '/admin/workers', icon: <Users size={18} />, label: 'Danh sách thợ' },
  { to: '/admin/attendance', icon: <CheckSquare size={18} />, label: 'Chấm công' },
  { to: '/admin/payroll', icon: <DollarSign size={18} />, label: 'Tính lương' },
  { to: '/admin/finance', icon: <TrendingUp size={18} />, label: 'Báo cáo tài chính' },
  { to: '/admin/schedule', icon: <Calendar size={18} />, label: 'Lịch nhắc việc' },
  { to: '/admin/warranty', icon: <Shield size={18} />, label: 'Bảo hành' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Thiết lập' },
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
    navigate('/admin/login')
  }

  const getPageTitle = () => {
    const path = window.location.pathname
    if (path.includes('quotes')) return 'Quản lý Yêu cầu Báo giá Website'
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
    return 'Mạnh Nghĩa Window 2'
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 14px' }}>
          <img
            src="/logo-company.jpg"
            alt="Mạnh Nghĩa Window 2"
            style={{ width: 38, height: 38, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 2 }}
          />
          <div>
            <h1 style={{ fontSize: 14, fontWeight: 800, margin: 0, lineHeight: 1.2, color: '#fff' }}>
              MẠNH NGHĨA
            </h1>
            <span style={{ fontSize: 10, color: '#F28C28', fontWeight: 700, letterSpacing: 0.5 }}>
              WINDOW 2
            </span>
          </div>
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
              {item.to.includes('schedule') && pendingRemindersCount > 0 && (
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

        <div style={{ padding: '0 12px 14px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 12px',
              borderRadius: 8,
              background: 'rgba(242, 140, 40, 0.12)',
              border: '1px solid rgba(242, 140, 40, 0.3)',
              color: '#F28C28',
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Globe size={15} />
            <span>Xem Website Doanh Nghiệp</span>
          </a>
        </div>

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
