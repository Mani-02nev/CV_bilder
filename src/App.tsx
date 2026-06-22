import { Routes, Route, Navigate } from 'react-router-dom'
import SEOHead from '@/components/SEOHead'
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
import { RequireAuth } from '@/components/RequireAuth'

// New page imports
import CompanyPage from '@/features/company/CompanyPage'
import ProductDetailPage from '@/features/products/ProductDetailPage'
import ProductsListPage from '@/features/products/ProductsListPage'
import BlogHomePage from '@/features/blog/BlogHomePage'
import BlogPostPage from '@/features/blog/BlogPostPage'

function App() {
  return (
    <>
      {/* Global Meta & Schema Tag Injector */}
      <SEOHead />

      <Routes>
        {/* Core Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/founder" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<CompanyPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/blog" element={<RequireAuth><BlogHomePage /></RequireAuth>} />
        <Route path="/blog/:slug" element={<RequireAuth><BlogPostPage /></RequireAuth>} />

        {/* Auth Sub-Layout */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        
        {/* Dashboard Workspaces */}
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/create-resume" element={<RequireAuth><CreateResumePage /></RequireAuth>} />
        <Route path="/builder/:id" element={<RequireAuth><ResumeBuilderPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

        {/* Admin Section */}
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
        
        {/* Fallback Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
