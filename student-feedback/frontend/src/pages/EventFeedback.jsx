import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvent, submitEventFeedback, getMyEventFeedback } from '../services/api'
import { StarRating } from '../components/StarRating'
import { IdentityToggle } from '../components/IdentityToggle'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, AlertCircle, Calendar, Send, HelpCircle } from 'lucide-react'

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
    getEvent(eventId)
      .then(({ data }) => {
        setEvent(data)
        setAnswers(new Array((data.questions || []).length).fill(''))
        checkExistingFeedback()
      })
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false))
  }, [eventId])

  const checkExistingFeedback = async () => {
    try {
      await getMyEventFeedback(eventId, studentAuth.token)
      setAlreadySubmitted(true)
    } catch (err) {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    if (rating === 0) {
      setError('Please provide a rating')
      setSubmitting(false)
      return
    }
    if (!feedback.trim()) {
      setError('Please write some feedback')
      setSubmitting(false)
      return
    }
    const questions = event.questions || []
    if (questions.length > 0 && answers.some((a) => !a.trim())) {
      setError('Please answer all event questions')
      setSubmitting(false)
      return
    }
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

  if (loading) return <LoadingSpinner message="Loading event details..." />
  if (success) return <SuccessAnimation onComplete={() => navigate('/student/events')} />

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md animate-fadeIn">
          <button
            onClick={() => navigate('/student/events')}
            className="neu-icon-btn mb-6"
            aria-label="Back to events"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="card text-center p-6 sm:p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#1e1107] border border-[#F4AE52]/30 flex items-center justify-center text-[#F4AE52] shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6)]">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#FEF3E2] mb-2">Already Submitted</h2>
            <p className="text-[#d8c2ad] text-sm mb-6 leading-relaxed">
              You have already submitted your response for this event. Thank you for your feedback!
            </p>
            <button
              onClick={() => navigate('/student/events')}
              className="landing-button landing-button-student w-full"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student/events')}
            className="neu-icon-btn"
            aria-label="Back to events"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">Event Feedback</h1>
            <p className="text-xs text-[#d8c2ad]">Share your thoughts on this event</p>
          </div>
        </div>

        <div className="card animate-fadeIn p-6 sm:p-8 space-y-6">
          {event.image_url && (
            <div className="w-full h-44 sm:h-52 overflow-hidden rounded-xl border border-[#FEF3E2]/10 neu-sunken">
              <img
                src={event.image_url}
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F4AE52]/10 text-[#F4AE52] border border-[#F4AE52]/20 mb-2">
              <Calendar size={13} />
              {event.event_date}
            </div>
            <h2 className="text-2xl font-extrabold text-[#FEF3E2]">{event.event_name}</h2>
            {event.description && (
              <p className="text-sm text-[#d8c2ad] mt-2 leading-relaxed">{event.description}</p>
            )}
          </div>

          {error && (
            <div className="p-3.5 neu-sunken border border-red-500/30 rounded-xl flex items-center gap-3 bg-red-950/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block text-center mb-3">
                How would you rate this event?
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {(event.questions || []).length > 0 && (
              <div className="space-y-4 pt-2 border-t border-[#FEF3E2]/5">
                <div className="flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#F4AE52]" />
                  <p className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider">
                    Event Questions
                  </p>
                </div>
                <div className="space-y-3.5">
                  {event.questions.map((q, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs text-[#d8c2ad] block">
                        <span className="text-[#F4AE52] font-bold mr-1.5">Q{i + 1}.</span>
                        {q}
                      </label>
                      <input
                        type="text"
                        value={answers[i] || ''}
                        onChange={(e) => {
                          const next = [...answers]
                          next[i] = e.target.value
                          setAnswers(next)
                        }}
                        placeholder="Your answer..."
                        className="input-field"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-[#FEF3E2]/5">
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block">
                Additional Comments & Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you like? What could be improved for future events?"
                rows={4}
                className="w-full"
                required
              />
            </div>

            <IdentityToggle
              showName={showName}
              showRegisterNo={showRegisterNo}
              onShowNameChange={setShowName}
              onShowRegisterNoChange={setShowRegisterNo}
            />

            <button
              type="submit"
              disabled={submitting}
              className="landing-button landing-button-student w-full flex items-center justify-center gap-2 mt-4"
            >
              <Send size={18} />
              {submitting ? 'Submitting...' : 'Submit Event Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
