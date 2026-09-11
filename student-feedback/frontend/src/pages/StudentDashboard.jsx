import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, CalendarDays, History, User, LogOut } from 'lucide-react'

export const StudentDashboard = () => {
  const { studentAuth, logoutStudent } = useAuth()
  const navigate = useNavigate()

  if (!studentAuth) { navigate('/student/login'); return null }

  const menuItems = [
    { icon: MessageCircle, title: 'General Feedback', description: 'Share your overall thoughts', path: '/student/feedback/general' },
    { icon: CalendarDays, title: 'Event Feedback', description: 'Rate recent events', path: '/student/events' },
    { icon: History, title: 'My Feedback', description: 'View your submissions', path: '/student/my-feedback' },
    { icon: User, title: 'Profile', description: 'Your information', path: '/student/profile' }
  ]

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 glass border-b border-white border-opacity-10">
        <div className="max-w-md mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold neon-glow">FEEDBACK HUB</h1>
          <button onClick={() => { logoutStudent(); navigate('/student/login') }} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"><LogOut size={20} className="text-red-400" /></button>
        </div>
      </div>
      <div className="max-w-md mx-auto p-4">
        <div className="card mb-6 text-center">
          <p className="text-3xl mb-2">👋</p>
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-2xl neon-glow">{studentAuth.info.name}</p>
          <p className="text-sm text-gray-400 mt-2">{studentAuth.info.registerNo}</p>
        </div>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className="w-full card text-left hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg"><Icon size={24} className="text-black" /></div>
                  <div className="flex-1"><h3 className="font-semibold text-lg">{item.title}</h3><p className="text-sm text-gray-400">{item.description}</p></div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
