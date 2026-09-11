import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { studentLogin } from '../services/api'
import { AlertCircle, LogIn } from 'lucide-react'

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
    if (!registerNo || !password) { setError('Please fill in all fields'); setLoading(false); return }
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold neon-glow mb-2">FEEDBACK</h1>
            <p className="text-gray-400">Student Login</p>
          </div>
          {error && (<div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-400 text-sm">{error}</p></div>)}
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="text-sm text-gray-400 mb-2 block uppercase">Register Number</label><input type="text" value={registerNo} onChange={(e) => setRegisterNo(e.target.value.toUpperCase())} placeholder="e.g., 23AD001" className="input-field w-full" /></div>
            <div><label className="text-sm text-gray-400 mb-2 block uppercase">Password (DOB: DD-MM-YYYY)</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="e.g., 15-04-2005" className="input-field w-full" /></div>
            <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2 mt-6"><LogIn size={20} />{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
