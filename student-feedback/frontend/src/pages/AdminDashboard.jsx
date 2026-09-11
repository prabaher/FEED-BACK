import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminStats } from '../services/api'
import { Users, MessageSquare, Calendar, TrendingUp, LogOut } from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const AdminDashboard = () => {
  const { adminAuth, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminAuth) { navigate('/admin/login') } else { getAdminStats(adminAuth.token).then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false)) }
  }, [adminAuth, navigate])

  if (loading) return <LoadingSpinner message="Loading admin panel..." />

  const menuItems = [
    { icon: Users, title: 'Students', description: 'Manage students', path: '/admin/students' },
    { icon: Calendar, title: 'Events', description: 'Create & manage events', path: '/admin/events' },
    { icon: MessageSquare, title: 'General Feedback', description: 'View all feedback', path: '/admin/feedback/general' },
    { icon: TrendingUp, title: 'Event Feedback', description: 'Event responses', path: '/admin/feedback/events' }
  ]

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 glass border-b border-white border-opacity-10">
        <div className="max-w-2xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold neon-purple">ADMIN PANEL</h1>
          <button onClick={() => { logoutAdmin(); navigate('/admin/login') }} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"><LogOut size={20} className="text-red-400" /></button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card text-center"><p className="text-2xl font-bold text-cyan-400">{stats?.students || 0}</p><p className="text-xs text-gray-400 uppercase">Students</p></div>
          <div className="card text-center"><p className="text-2xl font-bold text-green-400">{stats?.general_feedback || 0}</p><p className="text-xs text-gray-400 uppercase">General FB</p></div>
          <div className="card text-center"><p className="text-2xl font-bold text-purple-400">{stats?.events || 0}</p><p className="text-xs text-gray-400 uppercase">Events</p></div>
          <div className="card text-center"><p className="text-2xl font-bold text-pink-400">{stats?.event_feedback || 0}</p><p className="text-xs text-gray-400 uppercase">Event FB</p></div>
        </div>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className="w-full card text-left hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"><Icon size={24} className="text-black" /></div>
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
