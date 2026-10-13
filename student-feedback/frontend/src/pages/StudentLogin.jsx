import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { studentLogin } from '../services/api'
import { AlertCircle, LogIn, ArrowLeft, GraduationCap, Lock, Hash } from 'lucide-react'

export const StudentLogin = () => {
  const [registerNo, setRegisterNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginStudent } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!registerNo || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    try {
      const { data } = await studentLogin(registerNo, password)
      loginStudent(data.access_token, { id: data.student_id, name: data.student_name, registerNo })
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="w-full max-w-md animate-fadeIn">
        <button
          onClick={() => navigate('/')}
          className="neu-icon-btn mb-6"
          aria-label="Back to landing page"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="card p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#1e1107] text-[#D4621A] mb-4 shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6),inset_-2px_-2px_4px_rgba(212,98,26,0.15)] border border-[#D4621A]/30">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FEF3E2] tracking-tight">Student Portal</h1>
            <p className="text-[#d8c2ad] text-sm mt-1">Sign in with your register number</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 neu-sunken border border-red-500/30 rounded-xl flex items-center gap-3 bg-red-950/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hash size={14} className="text-[#D4621A]" />
                Register Number
              </label>
              <input
                type="text"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
                placeholder="e.g., 71502424..."
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={14} className="text-[#D4621A]" />
                Password (DOB: DD-MM-YYYY)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g., 15-04-2005"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="landing-button landing-button-student w-full mt-4 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
