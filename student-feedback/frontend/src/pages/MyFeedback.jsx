import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyGeneralFeedback } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Star } from 'lucide-react'

export const MyFeedback = () => {
  const { studentAuth } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyGeneralFeedback(studentAuth.token).then(({ data }) => setFeedback(data)).catch(() => setError('No feedback submitted yet')).finally(() => setLoading(false))
  }, [studentAuth])

  if (loading) return <LoadingSpinner message="Loading your feedback..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4">
        <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <h1 className="text-3xl font-bold mb-6 neon-glow">📜 My Feedback</h1>
        {error && <div className="card text-center text-gray-400">{error}</div>}
        {feedback && (
          <div className="card animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (<Star key={i} size={20} className={i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'} />))}
              </div>
              <span className="text-yellow-400 font-semibold">{feedback.rating}.0</span>
            </div>
            <p className="text-gray-300 mb-4">{feedback.feedback_text}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {feedback.show_name && <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full">Name visible</span>}
              {feedback.show_register_no && <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full">Register visible</span>}
              {!feedback.show_name && !feedback.show_register_no && <span className="px-3 py-1 bg-gray-500 bg-opacity-20 text-gray-300 rounded-full">Anonymous</span>}
            </div>
            <p className="text-xs text-gray-500 mt-4">Submitted on {new Date(feedback.created_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
