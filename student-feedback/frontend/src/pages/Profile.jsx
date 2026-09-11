import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Hash } from 'lucide-react'

export const Profile = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <h1 className="text-3xl font-bold mb-6 neon-glow">👤 Profile</h1>
        <div className="space-y-3">
          <div className="card"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p><p className="text-xl font-semibold">{studentAuth.info.name}</p></div>
          <div className="card"><div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1"><Hash size={12} />Register Number</div><p className="text-xl font-mono font-semibold text-cyan-400">{studentAuth.info.registerNo}</p></div>
        </div>
        <div className="mt-8 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg text-sm text-gray-300"><p className="font-semibold mb-2">ℹ️ Account Info</p><p>Your initial password was your date of birth.</p></div>
      </div>
    </div>
  )
}
