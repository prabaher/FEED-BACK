import React, { useEffect } from 'react'
import { Check } from 'lucide-react'

export const SuccessAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#150a04]/85 backdrop-blur-md z-50 p-4 animate-fadeIn">
      <div className="card text-center max-w-sm w-full p-8 shadow-[12px_12px_32px_rgba(10,5,2,0.9),-8px_-8px_24px_rgba(244,174,82,0.1)] border border-[#F4AE52]/30">
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-[#1e1107] border border-[#F4AE52]/40 shadow-[inset_4px_4px_10px_rgba(10,5,1,0.7),inset_-3px_-3px_8px_rgba(244,174,82,0.15)] flex items-center justify-center checkmark-animate">
          <Check className="w-10 h-10 text-[#F4AE52] drop-shadow-[0_2px_10px_rgba(244,174,82,0.4)]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#FEF3E2] mb-2">Thank You!</h2>
        <p className="text-[#d8c2ad] text-sm leading-relaxed">
          Your feedback has been successfully submitted and helps build a better campus.
        </p>
      </div>
    </div>
  )
}
