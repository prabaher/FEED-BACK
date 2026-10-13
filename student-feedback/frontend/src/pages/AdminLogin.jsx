import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminLogin } from '../services/api'
import { AlertCircle, LogIn, ArrowLeft, ShieldCheck, User, Lock } from 'lucide-react'

export const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!username || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    try {
      const { data } = await adminLogin(username, password)
      loginAdmin(data.access_token)
      navigate('/admin/dashboard')
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
            <div className="inline-flex p-3 rounded-2xl bg-[#1e1107] text-[#F4AE52] mb-4 shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6),inset_-2px_-2px_4px_rgba(244,174,82,0.15)] border border-[#F4AE52]/30">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FEF3E2] tracking-tight">Admin Console</h1>
            <p className="text-[#d8c2ad] text-sm mt-1">Administrator access credentials</p>
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
                <User size={14} className="text-[#F4AE52]" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={14} className="text-[#F4AE52]" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="landing-button landing-button-admin w-full mt-4 flex items-center justify-center gap-2"
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
