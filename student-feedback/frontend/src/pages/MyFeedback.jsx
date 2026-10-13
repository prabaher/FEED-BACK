import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyGeneralFeedback } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Star, Calendar, MessageSquare, ShieldCheck, User } from 'lucide-react'

export const MyFeedback = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyGeneralFeedback(studentAuth.token)
      .then(({ data }) => setFeedback(data))
      .catch(() => setError('No feedback submitted yet'))
      .finally(() => setLoading(false))
  }, [studentAuth])

  if (loading) return <LoadingSpinner message="Loading your feedback..." />

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
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">My Feedback</h1>
            <p className="text-xs text-[#d8c2ad]">View your general feedback submission</p>
          </div>
        </div>

        {error && !feedback && (
          <div className="card text-center p-8 sm:p-12 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1e1107] border border-[#FEF3E2]/10 flex items-center justify-center text-[#9c8472] shadow-[inset_3px_3px_6px_rgba(10,5,1,0.6)]">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#FEF3E2] mb-1">No Feedback Yet</h3>
            <p className="text-sm text-[#d8c2ad] mb-6">
              You haven't submitted any general feedback yet.
            </p>
            <button
              onClick={() => navigate('/student/feedback/general')}
              className="landing-button landing-button-student"
            >
              Submit Feedback Now
            </button>
          </div>
        )}

        {feedback && (
          <div className="card animate-fadeIn p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#FEF3E2]/5">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < feedback.rating
                          ? 'fill-[#F4AE52] text-[#F4AE52] drop-shadow-[0_1px_4px_rgba(244,174,82,0.4)]'
                          : 'text-[#9c8472]'
                      }
                    />
                  ))}
                </div>
                <span className="text-[#F4AE52] font-bold text-sm">
                  {feedback.rating}.0
                </span>
              </div>
              <span className="text-xs text-[#d8c2ad] flex items-center gap-1.5 font-mono">
                <Calendar size={13} />
                {new Date(feedback.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="neu-sunken p-4 rounded-xl border border-[#FEF3E2]/5">
              <p className="text-[#FEF3E2] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                "{feedback.feedback_text}"
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {feedback.show_name && (
                <span className="neu-badge neu-badge-green">
                  <User size={12} /> Name visible
                </span>
              )}
              {feedback.show_register_no && (
                <span className="neu-badge neu-badge-amber">
                  <ShieldCheck size={12} /> Register visible
                </span>
              )}
              {!feedback.show_name && !feedback.show_register_no && (
                <span className="neu-badge neu-badge-gray">
                  Anonymous submission
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
