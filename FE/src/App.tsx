import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'
import AppShell from '@/shared/components/AppShell'
import LoginPage from '@/features/auth/LoginPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ProjectListPage from '@/features/projects/ProjectListPage'
import ProjectDetailPage from '@/features/projects/ProjectDetailPage'
import WorkerListPage from '@/features/workers/WorkerListPage'
import AttendanceSheetPage from '@/features/attendance/AttendanceSheetPage'
import PayrollReportPage from '@/features/payroll/PayrollReportPage'
import FinanceReportPage from '@/features/finance/FinanceReportPage'
import ReminderListPage from '@/features/reminders/ReminderListPage'
import WarrantyListPage from '@/features/warranties/WarrantyListPage'
import BackupRestorePage from '@/features/settings/BackupRestorePage'
import WarehousePage from '@/features/warehouse/WarehousePage'

// ==========================================
// 1. PHÂN HỆ KHÁCH HÀNG (CUSTOMER PORTAL)
// ==========================================
import './web/styles/web.css'
import Home from './web/pages/Home'
import ServicesPage from './web/pages/ServicesPage'
import ProductsPage from './web/pages/ProductsPage'
import ProjectsPage from './web/pages/ProjectsPage'
import BlogPage from './web/pages/BlogPage'
import ContactPage from './web/pages/ContactPage'
import AdminDashboard from './web/pages/AdminDashboard'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================================
            1. ĐƯỜNG LINK DÀNH CHO KHÁCH HÀNG (Website Doanh Nghiệp)
           ============================================================ */}
        <Route path="/" element={<Home />} />
        <Route path="/dich-vu" element={<ServicesPage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/du-an" element={<ProjectsPage />} />
        <Route path="/quy-trinh" element={<Home />} />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/lien-he" element={<ContactPage />} />

        {/* Quản trị nhanh yêu cầu báo giá web */}
        <Route path="/portal-admin" element={<AdminDashboard />} />

        {/* ============================================================
            2. ĐƯỜNG LINK DÀNH CHO ADMIN (Cổng Quản trị Xưởng Cơ Khí)
           ============================================================ */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        {/* Phân hệ Admin được bảo vệ */}
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
          <Route path="quotes" element={<AdminDashboard />} />
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

        {/* Tự động chuyển hướng các link tắt cũ về /admin/... */}
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
      </Routes>
    </BrowserRouter>
  )
}
