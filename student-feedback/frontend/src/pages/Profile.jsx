import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Hash, User, Info, GraduationCap } from 'lucide-react'

export const Profile = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="neu-icon-btn"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">Student Profile</h1>
            <p className="text-xs text-[#d8c2ad]">Account and enrollment details</p>
          </div>
        </div>

        <div className="space-y-4 animate-fadeIn">
          {/* Main Profile Card */}
          <div className="card text-center p-6 sm:p-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[#1e1107] border border-[#D4621A]/30 shadow-[inset_4px_4px_10px_rgba(10,5,1,0.7),inset_-3px_-3px_8px_rgba(212,98,26,0.12)] flex items-center justify-center text-[#D4621A]">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#FEF3E2]">{studentAuth.info.name}</h2>
            <p className="text-xs text-[#d8c2ad] uppercase tracking-widest mt-1">Verified Student</p>
          </div>

          {/* Details Cards */}
          <div className="card p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4621A]/10 text-[#D4621A] border border-[#D4621A]/20">
                <User size={18} />
              </div>
              <div>
                <p className="text-[11px] text-[#9c8472] uppercase tracking-wider font-semibold">Student Name</p>
                <p className="text-base font-bold text-[#FEF3E2] mt-0.5">{studentAuth.info.name}</p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F4AE52]/10 text-[#F4AE52] border border-[#F4AE52]/20">
                <Hash size={18} />
              </div>
              <div>
                <p className="text-[11px] text-[#9c8472] uppercase tracking-wider font-semibold">Register Number</p>
                <p className="text-base font-mono font-bold text-[#F4AE52] mt-0.5">{studentAuth.info.registerNo}</p>
              </div>
            </div>
          </div>

          {/* Account info card */}
          <div className="neu-sunken p-4 rounded-xl border border-[#F4AE52]/20 flex items-start gap-3 bg-[#24150b] mt-6">
            <Info size={20} className="text-[#F4AE52] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#d8c2ad] leading-relaxed">
              <p className="font-semibold text-[#FEF3E2] mb-1">Account Credentials</p>
              <p>Your default portal password was configured as your date of birth (DD-MM-YYYY).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
