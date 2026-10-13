import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 gap-4">
    <div className="p-4 rounded-2xl bg-[#1e1107] border border-[#F4AE52]/25 shadow-[inset_3px_3px_8px_rgba(10,5,1,0.7),inset_-2px_-2px_6px_rgba(244,174,82,0.1)]">
      <Loader2 className="w-9 h-9 animate-spin text-[#F4AE52]" />
    </div>
    <p className="text-sm font-medium text-[#d8c2ad] tracking-wide">{message}</p>
  </div>
)
