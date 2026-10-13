import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react'

export const Events = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEvents()
      .then(({ data }) => setEvents(data))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner message="Loading campus events..." />

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="neu-icon-btn"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">Campus Events</h1>
            <p className="text-xs text-[#d8c2ad]">Select an event to submit your feedback</p>
          </div>
        </div>

        {error && (
          <div className="card mb-6 text-center text-red-400 border border-red-500/30 p-4">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="card text-center p-8 sm:p-12 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1e1107] border border-[#FEF3E2]/10 flex items-center justify-center text-[#9c8472] shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6)]">
              <Calendar size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#FEF3E2] mb-1">No Active Events</h3>
            <p className="text-sm text-[#d8c2ad]">
              There are currently no events open for feedback. Please check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/student/events/${event.id}/feedback`)}
                className="card w-full text-left p-4 sm:p-5 group transition-all duration-200 block"
              >
                {event.image_url && (
                  <div className="w-full h-40 sm:h-48 overflow-hidden rounded-xl mb-4 border border-[#FEF3E2]/10 neu-sunken">
                    <img
                      src={event.image_url}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F4AE52]/10 text-[#F4AE52] border border-[#F4AE52]/20">
                        <Calendar size={12} />
                        {event.event_date}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#FEF3E2] group-hover:text-[#F4AE52] transition-colors">
                      {event.event_name}
                    </h3>
                    {event.description && (
                      <p className="text-xs sm:text-sm text-[#d8c2ad]/80 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8472] group-hover:text-[#F4AE52] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1">
                    <ChevronRight size={22} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
