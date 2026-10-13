import React, { useState } from 'react'
import { Star } from 'lucide-react'

export const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0)

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-center items-center gap-2.5 sm:gap-3 p-2 rounded-2xl bg-[#1e1107] shadow-[inset_3px_3px_6px_rgba(10,5,1,0.7),inset_-2px_-2px_5px_rgba(254,243,226,0.04)] border border-[#FEF3E2]/5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hovered || value)
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${star} out of 5 stars`}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isFilled
                  ? 'bg-gradient-to-br from-[#3d2516] to-[#2c1a0d] shadow-[3px_3px_8px_rgba(10,5,1,0.6),-2px_-2px_6px_rgba(244,174,82,0.18)] border border-[#F4AE52]/40 scale-105'
                  : 'bg-transparent hover:bg-white/[0.04] text-[#9c8472]'
              }`}
            >
              <Star
                size={26}
                className={`transition-all duration-200 ${
                  isFilled
                    ? 'fill-[#F4AE52] text-[#F4AE52] drop-shadow-[0_2px_8px_rgba(244,174,82,0.45)]'
                    : 'text-[#9c8472]'
                }`}
              />
            </button>
          )
        })}
      </div>
      {(hovered > 0 || value > 0) && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[#F4AE52] animate-fadeIn">
          {labels[hovered || value]} ({hovered || value} / 5)
        </span>
      )}
    </div>
  )
}
