import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminStats } from '../services/api'
import { Users, MessageSquare, Calendar, TrendingUp, LogOut, ShieldCheck, ChevronRight } from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const AdminDashboard = () => {
  const { adminAuth, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminAuth) {
      navigate('/admin/login')
    } else {
      getAdminStats(adminAuth.token)
        .then(({ data }) => setStats(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [adminAuth, navigate])

  if (loading) return <LoadingSpinner message="Loading administrator dashboard..." />

  const menuItems = [
    {
      icon: Users,
      title: 'Students Management',
      description: 'Add and bulk import student records',
      path: '/admin/students',
      color: 'text-[#F4AE52]',
      bg: 'bg-[#F4AE52]/10 border-[#F4AE52]/20'
    },
    {
      icon: Calendar,
      title: 'Events Management',
      description: 'Create events, upload photos & set questions',
      path: '/admin/events',
      color: 'text-[#D4621A]',
      bg: 'bg-[#D4621A]/10 border-[#D4621A]/20'
    },
    {
      icon: MessageSquare,
      title: 'General Feedback',
      description: 'Review overall college ratings & comments',
      path: '/admin/feedback/general',
      color: 'text-[#e08b3c]',
      bg: 'bg-[#e08b3c]/10 border-[#e08b3c]/20'
    },
    {
      icon: TrendingUp,
      title: 'Event Feedback',
      description: 'Inspect detailed ratings by specific event',
      path: '/admin/feedback/events',
      color: 'text-[#FEF3E2]',
      bg: 'bg-[#FEF3E2]/10 border-[#FEF3E2]/20'
    }
  ]

  return (
    <div className="dashboard-shell min-h-screen pb-20 relative">
      <div className="floating-orb floating-orb-1" aria-hidden="true" />
      <div className="floating-orb floating-orb-2" aria-hidden="true" />
      <div className="floating-orb floating-orb-3" aria-hidden="true" />

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#24150b]/90 backdrop-blur-md border-b border-[#FEF3E2]/[0.06] shadow-[0_6px_20px_rgba(10,5,1,0.5)]">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F4AE52] to-[#D4621A] text-[#2A1A0E] shadow-[2px_2px_8px_rgba(10,5,1,0.5)]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-[#FEF3E2]">Admin Console</h1>
              <span className="text-[10px] text-[#F4AE52] uppercase tracking-widest font-medium">College Operations</span>
            </div>
          </div>
          <button
            onClick={() => {
              logoutAdmin()
              navigate('/admin/login')
            }}
            className="neu-icon-btn text-red-400 hover:text-red-300"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6 relative z-10">
        {/* Overview Header Banner */}
        <section className="card p-6 animate-fadeIn">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F4AE52] block mb-1">
            System Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FEF3E2]">
            Feedback & Campus Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#d8c2ad]/80 mt-1">
            Real-time metrics and student feedback administration
          </p>
        </section>

        {/* 4 Stat Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" aria-label="Quick Statistics">
          <div className="stat-card text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#F4AE52] tracking-tight">
              {stats?.students || 0}
            </p>
            <p className="text-[10px] sm:text-xs text-[#d8c2ad] uppercase tracking-wider font-semibold mt-1">
              Students
            </p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#D4621A] tracking-tight">
              {stats?.general_feedback || 0}
            </p>
            <p className="text-[10px] sm:text-xs text-[#d8c2ad] uppercase tracking-wider font-semibold mt-1">
              General FB
            </p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#e08b3c] tracking-tight">
              {stats?.events || 0}
            </p>
            <p className="text-[10px] sm:text-xs text-[#d8c2ad] uppercase tracking-wider font-semibold mt-1">
              Events
            </p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FEF3E2] tracking-tight">
              {stats?.event_feedback || 0}
            </p>
            <p className="text-[10px] sm:text-xs text-[#d8c2ad] uppercase tracking-wider font-semibold mt-1">
              Event FB
            </p>
          </div>
        </section>

        {/* Navigation Action Cards */}
        <section className="space-y-3.5" aria-label="Management Sections">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full card text-left p-4 sm:p-5 flex items-center justify-between group transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${item.bg} ${item.color} shadow-[inset_2px_2px_4px_rgba(10,5,1,0.5)]`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#FEF3E2] group-hover:text-[#F4AE52] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#d8c2ad]/80">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8472] group-hover:text-[#F4AE52] group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </button>
            )
          })}
        </section>
      </main>
    </div>
  )
}
