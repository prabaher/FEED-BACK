import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [studentAuth, setStudentAuth] = useState(null)
  const [adminAuth, setAdminAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedStudent = localStorage.getItem('studentToken')
    const studentInfo = localStorage.getItem('studentInfo')
    const storedAdmin = localStorage.getItem('adminToken')

    if (storedStudent && studentInfo) setStudentAuth({ token: storedStudent, info: JSON.parse(studentInfo) })
    if (storedAdmin) setAdminAuth({ token: storedAdmin })
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{studentAuth, adminAuth, loading, loginStudent: (token, info) => { localStorage.setItem('studentToken', token); localStorage.setItem('studentInfo', JSON.stringify(info)); setStudentAuth({ token, info }) }, loginAdmin: (token) => { localStorage.setItem('adminToken', token); setAdminAuth({ token }) }, logoutStudent: () => { localStorage.removeItem('studentToken'); localStorage.removeItem('studentInfo'); setStudentAuth(null) }, logoutAdmin: () => { localStorage.removeItem('adminToken'); setAdminAuth(null) }}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
