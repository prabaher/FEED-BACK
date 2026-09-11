import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { submitGeneralFeedback, getMyGeneralFeedback } from '../services/api'
import { StarRating } from '../components/StarRating'
import { IdentityToggle } from '../components/IdentityToggle'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { ArrowLeft, AlertCircle } from 'lucide-react'

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
    getMyGeneralFeedback(studentAuth.token).then(() => setAlreadySubmitted(true)).catch(() => {})
  }, [studentAuth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (rating === 0) { setError('Please provide a rating'); setLoading(false); return }
    if (!feedback.trim()) { setError('Please write some feedback'); setLoading(false); return }
    try {
      await submitGeneralFeedback({ rating, feedback_text: feedback, show_name: showName, show_register_no: showRegisterNo }, studentAuth.token)
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
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
          <div className="card"><div className="flex items-start gap-3 mb-4"><AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" /><div><h3 className="font-semibold text-yellow-400 mb-2">Already Submitted</h3><p className="text-gray-300 text-sm">You have already submitted general feedback.</p></div></div><button onClick={() => navigate('/student/dashboard')} className="btn-neon w-full">Back to Dashboard</button></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <div className="card animate-fadeIn">
          <h1 className="text-2xl font-bold mb-2">📝 General Feedback</h1>
          <p className="text-gray-400 mb-6">Help us improve your college experience</p>
          {error && (<div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-400 text-sm">{error}</p></div>)}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><p className="text-sm text-gray-400 mb-4 uppercase tracking-wide">How was your overall college experience?</p><StarRating value={rating} onChange={setRating} /></div>
            <div><label className="text-sm text-gray-400 block mb-2 uppercase tracking-wide">Your Feedback</label><textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us what we can do better..." className="w-full" /></div>
            <IdentityToggle showName={showName} showRegisterNo={showRegisterNo} onShowNameChange={setShowName} onShowRegisterNoChange={setShowRegisterNo} />
            <button type="submit" disabled={loading} className="btn-neon w-full">{loading ? 'Sending...' : 'Submit Feedback'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
