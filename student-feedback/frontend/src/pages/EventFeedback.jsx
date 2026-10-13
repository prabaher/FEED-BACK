import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvent, submitEventFeedback, getMyEventFeedback } from '../services/api'
import { StarRating } from '../components/StarRating'
import { IdentityToggle } from '../components/IdentityToggle'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export const EventFeedback = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [answers, setAnswers] = useState([])
  const [showName, setShowName] = useState(true)
  const [showRegisterNo, setShowRegisterNo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  useEffect(() => {
    getEvent(eventId).then(({ data }) => { setEvent(data); setAnswers(new Array((data.questions || []).length).fill('')); checkExistingFeedback() }).catch(() => setError('Event not found')).finally(() => setLoading(false))
  }, [eventId])

  const checkExistingFeedback = async () => {
    try { await getMyEventFeedback(eventId, studentAuth.token); setAlreadySubmitted(true) } catch (err) { }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    if (rating === 0) { setError('Please provide a rating'); setSubmitting(false); return }
    if (!feedback.trim()) { setError('Please write some feedback'); setSubmitting(false); return }
    const questions = event.questions || []
    if (questions.length > 0 && answers.some((a) => !a.trim())) { setError('Please answer all questions'); setSubmitting(false); return }
    try {
      const payload = { rating, feedback_text: feedback, show_name: showName, show_register_no: showRegisterNo }
      if (questions.length > 0) payload.answers = answers.map((a) => a.trim())
      await submitEventFeedback(eventId, payload, studentAuth.token)
      setSuccess(true)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading event..." />
  if (success) return <SuccessAnimation onComplete={() => navigate('/student/events')} />
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate('/student/events')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
          <div className="card"><div className="flex items-start gap-3 mb-4"><AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" /><div><h3 className="font-semibold text-yellow-400 mb-2">Already Submitted</h3><p className="text-gray-300 text-sm">You have already submitted feedback for this event.</p></div></div><button onClick={() => navigate('/student/events')} className="btn-neon w-full">Back to Events</button></div>
        </div>
      </div>
    )
  }
  if (!event) return null

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        <button onClick={() => navigate('/student/events')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <div className="card animate-fadeIn">
          {event.image_url && <img src={event.image_url} alt={event.event_name} className="w-full h-44 object-cover rounded-lg mb-4" />}
          <h1 className="text-2xl font-bold mb-2">🎯 {event.event_name}</h1>
          <p className="text-gray-400 mb-4 text-sm">{event.event_date}</p>
          {event.description && <p className="text-gray-300 mb-6">{event.description}</p>}
          {error && (<div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-400 text-sm">{error}</p></div>)}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><p className="text-sm text-gray-400 mb-4 uppercase tracking-wide">How would you rate this event?</p><StarRating value={rating} onChange={setRating} /></div>
            {(event.questions || []).length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Event Questions</p>
                <div className="space-y-3">
                  {event.questions.map((q, i) => (
                    <div key={i}>
                      <label className="text-sm text-gray-300 block mb-1">{i + 1}. {q}</label>
                      <input type="text" value={answers[i] || ''} onChange={(e) => { const next = [...answers]; next[i] = e.target.value; setAnswers(next) }} placeholder="Your answer" className="input-field w-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div><label className="text-sm text-gray-400 block mb-2 uppercase tracking-wide">Your Feedback</label><textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What did you like? What could be improved?..." className="w-full" /></div>
            <IdentityToggle showName={showName} showRegisterNo={showRegisterNo} onShowNameChange={setShowName} onShowRegisterNoChange={setShowRegisterNo} />
            <button type="submit" disabled={submitting} className="btn-neon w-full">{submitting ? 'Sending...' : 'Submit Feedback'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
