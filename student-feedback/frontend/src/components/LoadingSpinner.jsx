import React from 'react'
import { Loader } from 'lucide-react'

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <Loader className="w-12 h-12 spinner text-green-400" />
    <p className="text-lg text-green-400 neon-glow">{message}</p>
  </div>
)
