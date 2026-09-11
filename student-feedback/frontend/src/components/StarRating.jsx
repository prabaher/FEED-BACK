import React, { useState } from 'react'
import { Star } from 'lucide-react'

export const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex justify-center gap-2">
      {[1,2,3,4,5].map((star) => (
        <button key={star} onClick={() => onChange(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}>
          <Star size={40} className={`transition-all ${star <= (hovered || value) ? 'fill-yellow-400 text-yellow-400 neon-glow' : 'text-gray-500'}`} />
        </button>
      ))}
    </div>
  )
}
