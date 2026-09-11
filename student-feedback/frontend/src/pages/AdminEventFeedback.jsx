import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminEvents, getEventFeedback } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Star } from 'lucide-react'

export const AdminEventFeedback = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  useEffect(() => {
    if (!adminAuth) navigate('/admin/login')
    else getAdminEvents(adminAuth.token).then(({ data }) => { setEvents(data); if (data.length > 0) handleSelectEvent(data[0].id) }).catch(() => {}).finally(() => setLoading(false))
  }, [adminAuth, navigate])

  const handleSelectEvent = async (eventId) => {
    setSelectedEventId(eventId)
    setFeedbackLoading(true)
    try { const { data } = await getEventFeedback(eventId, adminAuth.token); setFeedbacks(data) } catch (err) { }
    finally { setFeedbackLoading(false) }
  }

  if (loading) return <LoadingSpinner message="Loading feedback..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <h1 className="text-3xl font-bold mb-6 neon-pink">🎯 Event Feedback</h1>
        <div className="mb-6"><label className="text-sm text-gray-400 block mb-2 uppercase">Select Event</label><select value={selectedEventId || ''} onChange={(e) => handleSelectEvent(parseInt(e.target.value))} className="input-field w-full">{events.map((event) => <option key={event.id} value={event.id}>{event.event_name} ({event.event_date})</option>)}</select></div>
        {feedbackLoading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <div className="card text-center text-gray-400">No feedback for this event yet</div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-400">Total Responses: <span className="font-bold text-white">{feedbacks.length}</span></div>
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <div><div className="flex items-center gap-2 mb-1"><div className="flex gap-1">{[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />))}</div><span className="text-yellow-400 text-sm font-semibold">{fb.rating}</span></div><p className="text-xs text-gray-400"><strong>{fb.student_name || 'Anonymous'}</strong>{fb.register_no && ` • ${fb.register_no}`}</p></div>
                      <span className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{fb.feedback_text}</p>
                    <div className="flex gap-2 flex-wrap text-xs">
                      {fb.show_name && <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded">Name visible</span>}
                      {fb.show_register_no && <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded">Register visible</span>}
                      {!fb.show_name && !fb.show_register_no && <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-300 rounded">Anonymous</span>}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
