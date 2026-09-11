import React, { useEffect } from 'react'
import { Check } from 'lucide-react'

export const SuccessAnimation = ({ onComplete }) => {
  useEffect(() => { const timer = setTimeout(onComplete, 3000); return () => clearTimeout(timer) }, [onComplete])
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="glass card text-center">
        <div className="mb-4 checkmark-animate"><Check className="w-16 h-16 mx-auto text-green-400 neon-glow" /></div>
        <h2 className="text-2xl font-bold text-green-400 neon-glow mb-2">Thank You!</h2>
        <p className="text-gray-300">Your feedback helps us improve</p>
      </div>
    </div>
  )
}
