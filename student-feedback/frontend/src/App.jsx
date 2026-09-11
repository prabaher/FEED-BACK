import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { StudentLogin } from './pages/StudentLogin'
import { StudentDashboard } from './pages/StudentDashboard'
import { GeneralFeedback } from './pages/GeneralFeedback'
import { Events } from './pages/Events'
import { EventFeedback } from './pages/EventFeedback'
import { MyFeedback } from './pages/MyFeedback'
import { Profile } from './pages/Profile'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { StudentManagement } from './pages/StudentManagement'
import { EventManagement } from './pages/EventManagement'
import { AdminGeneralFeedback } from './pages/AdminGeneralFeedback'
import { AdminEventFeedback } from './pages/AdminEventFeedback'
import { Landing } from './pages/Landing'

const ProtectedStudentRoute = ({ children }) => {
  const { studentAuth, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!studentAuth) return <Navigate to="/student/login" />
  return children
}

const ProtectedAdminRoute = ({ children }) => {
  const { adminAuth, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!adminAuth) return <Navigate to="/admin/login" />
  return children
}

const StudentRoutes = () => (
  <Routes>
    <Route path="login" element={<StudentLogin />} />
    <Route path="dashboard" element={<ProtectedStudentRoute><StudentDashboard /></ProtectedStudentRoute>} />
    <Route path="feedback/general" element={<ProtectedStudentRoute><GeneralFeedback /></ProtectedStudentRoute>} />
    <Route path="events" element={<ProtectedStudentRoute><Events /></ProtectedStudentRoute>} />
    <Route path="events/:eventId/feedback" element={<ProtectedStudentRoute><EventFeedback /></ProtectedStudentRoute>} />
    <Route path="my-feedback" element={<ProtectedStudentRoute><MyFeedback /></ProtectedStudentRoute>} />
    <Route path="profile" element={<ProtectedStudentRoute><Profile /></ProtectedStudentRoute>} />
    <Route path="" element={<Navigate to="login" />} />
  </Routes>
)

const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route path="dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
    <Route path="students" element={<ProtectedAdminRoute><StudentManagement /></ProtectedAdminRoute>} />
    <Route path="events" element={<ProtectedAdminRoute><EventManagement /></ProtectedAdminRoute>} />
    <Route path="feedback/general" element={<ProtectedAdminRoute><AdminGeneralFeedback /></ProtectedAdminRoute>} />
    <Route path="feedback/events" element={<ProtectedAdminRoute><AdminEventFeedback /></ProtectedAdminRoute>} />
    <Route path="" element={<Navigate to="login" />} />
  </Routes>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
