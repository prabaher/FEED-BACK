import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, CalendarDays, History, User, LogOut, ChevronRight, Sparkles } from 'lucide-react'

export const StudentDashboard = () => {
  const { studentAuth, logoutStudent } = useAuth()
  const navigate = useNavigate()

  if (!studentAuth) {
    navigate('/student/login')
    return null
  }

  const menuItems = [
    {
      icon: MessageCircle,
      title: 'General Feedback',
      description: 'Share your overall campus experience',
      path: '/student/feedback/general',
      badgeColor: 'text-[#D4621A]',
      badgeBg: 'bg-[#D4621A]/10 border-[#D4621A]/20'
    },
    {
      icon: CalendarDays,
      title: 'Event Feedback',
      description: 'Rate and review recent campus events',
      path: '/student/events',
      badgeColor: 'text-[#F4AE52]',
      badgeBg: 'bg-[#F4AE52]/10 border-[#F4AE52]/20'
    },
    {
      icon: History,
      title: 'My Feedback',
      description: 'Review your submitted feedback history',
      path: '/student/my-feedback',
      badgeColor: 'text-[#e08b3c]',
      badgeBg: 'bg-[#e08b3c]/10 border-[#e08b3c]/20'
    },
    {
      icon: User,
      title: 'Student Profile',
      description: 'View your enrolled details & account info',
      path: '/student/profile',
      badgeColor: 'text-[#FEF3E2]',
      badgeBg: 'bg-[#FEF3E2]/10 border-[#FEF3E2]/20'
    }
  ]

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#24150b]/90 backdrop-blur-md border-b border-[#FEF3E2]/[0.06] shadow-[0_6px_20px_rgba(10,5,1,0.5)]">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4AE52] to-[#D4621A] flex items-center justify-center text-[#2A1A0E] shadow-[2px_2px_6px_rgba(10,5,1,0.5)]">
              <Sparkles size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-[#FEF3E2]">Feedback Hub</h1>
              <span className="text-[10px] text-[#F4AE52] uppercase tracking-widest font-medium">Student Area</span>
            </div>
          </div>
          <button
            onClick={() => {
              logoutStudent()
              navigate('/student/login')
            }}
            className="neu-icon-btn text-red-400 hover:text-red-300"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        {/* Welcome Neumorphic Card */}
        <section className="card text-center p-6 sm:p-8 animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1e1107] border border-[#F4AE52]/25 shadow-[inset_3px_3px_8px_rgba(10,5,1,0.7),inset_-2px_-2px_6px_rgba(244,174,82,0.08)] flex items-center justify-center text-3xl">
            👋
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F4AE52] mb-1">Welcome back</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FEF3E2] mb-2">
            {studentAuth.info.name}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-sunken border border-[#FEF3E2]/5 text-xs font-mono text-[#d8c2ad]">
            <span className="w-2 h-2 rounded-full bg-[#D4621A]"></span>
            {studentAuth.info.registerNo}
          </div>
        </section>

        {/* Menu Items List */}
        <nav className="space-y-3.5" aria-label="Student Actions">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full card text-left p-4 sm:p-5 flex items-center justify-between group transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${item.badgeBg} ${item.badgeColor} shadow-[inset_2px_2px_4px_rgba(10,5,1,0.5)]`}>
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
        </nav>
      </main>
    </div>
  )
}
