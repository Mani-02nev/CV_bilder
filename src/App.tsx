import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/LandingPage'
import AuthLayout from '@/features/auth/AuthLayout'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ResumeBuilderPage from '@/features/resume-builder/ResumeBuilderPage'
import { CreateResumePage } from '@/features/resume/CreateResumePage'
import AdminLoginPage from '@/features/admin/AdminLoginPage'
import AdminDashboardPage from '@/features/admin/AdminDashboardPage'
import { RequireAdmin } from '@/features/admin/components/RequireAdmin'

import ProfilePage from '@/features/profile/ProfilePage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-resume" element={<CreateResumePage />} />
        <Route path="/builder/:id" element={<ResumeBuilderPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          }
        />
      </Routes>
    </>
  )
}

export default App
