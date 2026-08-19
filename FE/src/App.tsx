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
import ReminderListPage from '@/features/reminders/ReminderListPage'
import WarrantyListPage from '@/features/warranties/WarrantyListPage'
import BackupRestorePage from '@/features/settings/BackupRestorePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="workers" element={<WorkerListPage />} />
          <Route path="attendance" element={<AttendanceSheetPage />} />
          <Route path="payroll" element={<PayrollReportPage />} />
          <Route path="schedule" element={<ReminderListPage />} />
          <Route path="warranty" element={<WarrantyListPage />} />
          <Route path="settings" element={<BackupRestorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
