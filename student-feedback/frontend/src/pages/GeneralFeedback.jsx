import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { submitGeneralFeedback, getMyGeneralFeedback } from '../services/api'
import { StarRating } from '../components/StarRating'
import { IdentityToggle } from '../components/IdentityToggle'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { ArrowLeft, AlertCircle, MessageSquare, Send } from 'lucide-react'

export const GeneralFeedback = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showName, setShowName] = useState(true)
  const [showRegisterNo, setShowRegisterNo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  useEffect(() => {
    getMyGeneralFeedback(studentAuth.token)
      .then(() => setAlreadySubmitted(true))
      .catch(() => {})
  }, [studentAuth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (rating === 0) {
      setError('Please provide a star rating')
      setLoading(false)
      return
    }
    if (!feedback.trim()) {
      setError('Please write some feedback before submitting')
      setLoading(false)
      return
    }
    try {
      await submitGeneralFeedback(
        { rating, feedback_text: feedback, show_name: showName, show_register_no: showRegisterNo },
        studentAuth.token
      )
      setSuccess(true)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (success) return <SuccessAnimation onComplete={() => navigate('/student/dashboard')} />

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md animate-fadeIn">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="neu-icon-btn mb-6"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="card text-center p-6 sm:p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#1e1107] border border-[#F4AE52]/30 flex items-center justify-center text-[#F4AE52] shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6)]">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#FEF3E2] mb-2">Already Submitted</h2>
            <p className="text-[#d8c2ad] text-sm mb-6 leading-relaxed">
              You have already provided your general college feedback. Thank you for making your voice heard!
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="landing-button landing-button-student w-full"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

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
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">General Feedback</h1>
            <p className="text-xs text-[#d8c2ad]">Share your overall campus experience</p>
          </div>
        </div>

        <div className="card animate-fadeIn p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[#FEF3E2]/5">
            <div className="p-2.5 rounded-xl bg-[#D4621A]/10 text-[#D4621A] border border-[#D4621A]/20 shadow-[inset_2px_2px_4px_rgba(10,5,1,0.5)]">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FEF3E2]">College Experience Rating</h2>
              <p className="text-xs text-[#d8c2ad]">Help faculty and administration improve</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 neu-sunken border border-red-500/30 rounded-xl flex items-center gap-3 bg-red-950/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block text-center">
                How was your overall college experience?
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block">
                Detailed Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your honest thoughts, what's working well, and what could be improved..."
                rows={5}
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
              disabled={loading}
              className="landing-button landing-button-student w-full flex items-center justify-center gap-2 mt-4"
            >
              <Send size={18} />
              {loading ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
