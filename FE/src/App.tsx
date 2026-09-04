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
import PortalPage from '@/features/portal/PortalPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Corporate Portal (SEO & Lead Generation) */}
        <Route path="/" element={<PortalPage />} />
        <Route path="/dich-vu" element={<PortalPage />} />
        <Route path="/san-pham" element={<PortalPage />} />
        <Route path="/du-an" element={<PortalPage />} />
        <Route path="/quy-trinh" element={<PortalPage />} />
        <Route path="/lien-he" element={<PortalPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Internal ERP & Workshop Management */}
        <Route
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        >
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
      </Routes>
    </BrowserRouter>
  )
}
