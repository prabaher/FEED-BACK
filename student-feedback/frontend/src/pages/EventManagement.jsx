import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminEvents, createEvent, deleteEvent } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react'

export const EventManagement = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ event_name: '', description: '', event_date: '', status: 'Active' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!adminAuth) navigate('/admin/login')
    else getAdminEvents(adminAuth.token).then(({ data }) => setEvents(data)).catch(() => {}).finally(() => setLoading(false))
  }, [adminAuth, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.event_name || !formData.event_date) { setError('Please fill in all required fields'); return }
    try {
      await createEvent(formData, adminAuth.token)
      setSuccess('Event created successfully!')
      setFormData({ event_name: '', description: '', event_date: '', status: 'Active' })
      setShowForm(false)
      getAdminEvents(adminAuth.token).then(({ data }) => setEvents(data))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event')
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await deleteEvent(eventId, adminAuth.token)
      setSuccess('Event deleted')
      getAdminEvents(adminAuth.token).then(({ data }) => setEvents(data))
    } catch (err) {
      setError('Failed to delete event')
    }
  }

  if (loading) return <LoadingSpinner message="Loading events..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold neon-purple">📅 Events</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-neon"><Plus size={20} />New Event</button>
        </div>
        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">Create New Event</h3><button onClick={() => setShowForm(false)}><X size={20} /></button></div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-400 text-sm mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event Name" value={formData.event_name} onChange={(e) => setFormData({...formData, event_name: e.target.value})} className="input-field w-full" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full" />
              <input type="text" placeholder="Date (DD-MM-YYYY)" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="input-field w-full" />
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input-field w-full">
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
              <button type="submit" className="btn-neon w-full">Create Event</button>
            </form>
          </div>
        )}
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="card text-center text-gray-400">No events created yet</div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1"><h3 className="font-semibold text-lg">{event.event_name}</h3>{event.description && <p className="text-sm text-gray-400 mb-1">{event.description}</p>}<p className="text-xs text-cyan-400">{event.event_date}</p></div>
                  <span className={`text-xs px-2 py-1 rounded ${event.status === 'Active' ? 'bg-green-500 bg-opacity-20 text-green-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>{event.status}</span>
                </div>
                <button onClick={() => handleDelete(event.id)} className="w-full text-sm py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-40 text-red-300 rounded transition-all"><Trash2 size={16} className="mx-auto" /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
