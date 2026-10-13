import React from 'react'
import { User, Hash, Eye, EyeOff } from 'lucide-react'

export const IdentityToggle = ({ showName, showRegisterNo, onShowNameChange, onShowRegisterNoChange }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider">Identity Privacy Controls</p>
      <span className="text-[11px] text-[#F4AE52]">
        {!showName && !showRegisterNo ? 'Completely Anonymous' : 'Custom Visibility'}
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Name Visibility Switch Card */}
      <button
        type="button"
        onClick={() => onShowNameChange(!showName)}
        className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
          showName
            ? 'bg-[#382214] border-[#D4621A]/40 shadow-[4px_4px_10px_rgba(10,5,1,0.6),-2px_-2px_6px_rgba(212,98,26,0.12)]'
            : 'neu-sunken border-[#FEF3E2]/5 opacity-70'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${showName ? 'bg-[#D4621A]/20 text-[#D4621A]' : 'bg-white/5 text-[#9c8472]'}`}>
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FEF3E2]">Show Name</p>
            <p className="text-[11px] text-[#d8c2ad]/80">{showName ? 'Visible to admin' : 'Hidden'}</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${showName ? 'bg-[#D4621A] text-[#FEF3E2]' : 'bg-[#1e1107] text-[#9c8472]'}`}>
          {showName ? <Eye size={12} /> : <EyeOff size={12} />}
        </div>
      </button>

      {/* Register Number Visibility Switch Card */}
      <button
        type="button"
        onClick={() => onShowRegisterNoChange(!showRegisterNo)}
        className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
          showRegisterNo
            ? 'bg-[#382214] border-[#F4AE52]/40 shadow-[4px_4px_10px_rgba(10,5,1,0.6),-2px_-2px_6px_rgba(244,174,82,0.12)]'
            : 'neu-sunken border-[#FEF3E2]/5 opacity-70'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${showRegisterNo ? 'bg-[#F4AE52]/20 text-[#F4AE52]' : 'bg-white/5 text-[#9c8472]'}`}>
            <Hash size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FEF3E2]">Show Register No</p>
            <p className="text-[11px] text-[#d8c2ad]/80">{showRegisterNo ? 'Visible to admin' : 'Hidden'}</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${showRegisterNo ? 'bg-[#F4AE52] text-[#2A1A0E]' : 'bg-[#1e1107] text-[#9c8472]'}`}>
          {showRegisterNo ? <Eye size={12} /> : <EyeOff size={12} />}
        </div>
      </button>
    </div>
  </div>
)
