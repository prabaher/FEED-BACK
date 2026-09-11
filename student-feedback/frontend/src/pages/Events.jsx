import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvents } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Calendar } from 'lucide-react'

export const Events = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEvents().then(({ data }) => setEvents(data)).catch(() => setError('Failed to load events')).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner message="Loading events..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <h1 className="text-3xl font-bold mb-6 neon-glow">🎯 Events</h1>
        {error && <div className="card mb-6 text-center text-red-400">{error}</div>}
        {events.length === 0 ? (
          <div className="card text-center"><Calendar className="w-12 h-12 mx-auto mb-4 text-gray-500" /><p className="text-gray-400">No active events at the moment</p></div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <button key={event.id} onClick={() => navigate(`/student/events/${event.id}/feedback`)} className="card w-full text-left hover:scale-105 transition-transform">
                <div className="flex items-start justify-between">
                  <div className="flex-1"><h3 className="font-bold text-lg mb-1">{event.event_name}</h3>{event.description && <p className="text-sm text-gray-400 mb-2">{event.description}</p>}<div className="flex items-center gap-2 text-xs text-cyan-400"><Calendar size={14} />{event.event_date}</div></div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
