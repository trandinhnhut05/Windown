import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'

// ==========================================
// PHÂN HỆ QUẢN TRỊ ADMIN (ERP XƯỞNG)
// ==========================================
import AppShell from '@/admin/components/AppShell'
import LoginPage from '@/admin/features/auth/LoginPage'
import DashboardPage from '@/admin/features/dashboard/DashboardPage'
import ProjectListPage from '@/admin/features/projects/ProjectListPage'
import ProjectDetailPage from '@/admin/features/projects/ProjectDetailPage'
import WorkerListPage from '@/admin/features/workers/WorkerListPage'
import AttendanceSheetPage from '@/admin/features/attendance/AttendanceSheetPage'
import PayrollReportPage from '@/admin/features/payroll/PayrollReportPage'
import FinanceReportPage from '@/admin/features/finance/FinanceReportPage'
import ReminderListPage from '@/admin/features/reminders/ReminderListPage'
import WarrantyListPage from '@/admin/features/warranties/WarrantyListPage'
import BackupRestorePage from '@/admin/features/settings/BackupRestorePage'
import WarehousePage from '@/admin/features/warehouse/WarehousePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Chuyển hướng trang chủ vào trang Admin */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Đăng nhập */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        {/* Phân hệ Admin bảo vệ đăng nhập */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="workers" element={<WorkerListPage />} />
          <Route path="attendance" element={<AttendanceSheetPage />} />
          <Route path="payroll" element={<PayrollReportPage />} />
          <Route path="finance" element={<FinanceReportPage />} />
          <Route path="schedule" element={<ReminderListPage />} />
          <Route path="warranty" element={<WarrantyListPage />} />
          <Route path="settings" element={<BackupRestorePage />} />
        </Route>

        {/* Phím tắt điều hướng nhanh vào admin */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />
        <Route path="/warehouse" element={<Navigate to="/admin/warehouse" replace />} />
        <Route path="/workers" element={<Navigate to="/admin/workers" replace />} />
        <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
        <Route path="/payroll" element={<Navigate to="/admin/payroll" replace />} />
        <Route path="/finance" element={<Navigate to="/admin/finance" replace />} />
        <Route path="/schedule" element={<Navigate to="/admin/schedule" replace />} />
        <Route path="/warranty" element={<Navigate to="/admin/warranty" replace />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Mọi route khác đều chuyển về Admin */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
