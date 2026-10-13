import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGeneralFeedback } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Star, Calendar, User, ShieldCheck, MessageSquare } from 'lucide-react'

export const AdminGeneralFeedback = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminAuth) navigate('/admin/login')
    else {
      getGeneralFeedback(adminAuth.token)
        .then(({ data }) => setFeedbacks(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [adminAuth, navigate])

  if (loading) return <LoadingSpinner message="Loading general feedback submissions..." />

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="neu-icon-btn"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">General Feedback</h1>
            <p className="text-xs text-[#d8c2ad]">All submitted campus experience responses</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#d8c2ad]">
            Total Responses: <strong className="text-[#F4AE52] ml-1">{feedbacks.length}</strong>
          </span>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="card text-center p-8 text-[#d8c2ad]">
              <MessageSquare size={32} className="mx-auto mb-2 text-[#9c8472]" />
              No general feedback received yet.
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="card p-5 sm:p-6 space-y-3.5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FEF3E2]/5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < fb.rating
                              ? 'fill-[#F4AE52] text-[#F4AE52] drop-shadow-[0_1px_4px_rgba(244,174,82,0.4)]'
                              : 'text-[#9c8472]'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[#F4AE52] text-sm font-bold">{fb.rating}.0</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#d8c2ad]">
                    <Calendar size={13} />
                    <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="neu-sunken p-3.5 rounded-xl border border-[#FEF3E2]/5">
                  <p className="text-sm sm:text-base text-[#FEF3E2] leading-relaxed whitespace-pre-line">
                    "{fb.feedback_text}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-[#d8c2ad] font-medium">
                    <span className="text-[#9c8472] mr-1.5">Submitted by:</span>
                    <strong className="text-[#FEF3E2]">{fb.student_name || 'Anonymous Student'}</strong>
                    {fb.register_no && (
                      <span className="text-[#F4AE52] font-mono ml-1.5">({fb.register_no})</span>
                    )}
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {fb.show_name && (
                      <span className="neu-badge neu-badge-green">
                        <User size={11} /> Name visible
                      </span>
                    )}
                    {fb.show_register_no && (
                      <span className="neu-badge neu-badge-amber">
                        <ShieldCheck size={11} /> Register visible
                      </span>
                    )}
                    {!fb.show_name && !fb.show_register_no && (
                      <span className="neu-badge neu-badge-gray">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
