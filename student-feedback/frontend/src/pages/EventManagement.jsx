import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminEvents, createEvent, updateEvent, deleteEvent, uploadEventImage, removeEventImage } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Plus, Trash2, X, Pencil, ImagePlus, ListPlus } from 'lucide-react'

const EMPTY_FORM = { event_name: '', description: '', event_date: '', status: 'Active', questions: [] }

const processImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 1000
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.75))
    }
    img.onerror = () => reject(new Error('Could not read image'))
    img.src = reader.result
  }
  reader.onerror = () => reject(new Error('Could not read file'))
  reader.readAsDataURL(file)
})

export const EventManagement = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [image, setImage] = useState(null)
  const [pendingImage, setPendingImage] = useState(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!adminAuth) navigate('/admin/login')
    else getAdminEvents(adminAuth.token).then(({ data }) => setEvents(data)).catch(() => {}).finally(() => setLoading(false))
  }, [adminAuth, navigate])

  const refresh = () => getAdminEvents(adminAuth.token).then(({ data }) => setEvents(data)).catch(() => {})

  const openCreate = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setImage(null)
    setPendingImage(null)
    setImageRemoved(false)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  const openEdit = (event) => {
    setEditingId(event.id)
    setFormData({
      event_name: event.event_name,
      description: event.description || '',
      event_date: event.event_date,
      status: event.status,
      questions: event.questions || []
    })
    setImage(event.image_url || null)
    setPendingImage(null)
    setImageRemoved(false)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose an image file'); return }
    setError('')
    setUploading(true)
    try {
      const dataUrl = await processImage(file)
      setImage(dataUrl)
      setPendingImage(dataUrl)
      setImageRemoved(false)
    } catch (err) {
      setError(err.message || 'Failed to read image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    setImage(null)
    setPendingImage(null)
    setImageRemoved(true)
    if (editingId) {
      try { await removeEventImage(editingId, adminAuth.token); setImageRemoved(false) } catch (err) { setError('Failed to remove image') }
    }
  }

  const setQuestion = (index, value) => {
    const questions = [...formData.questions]
    questions[index] = value
    setFormData({ ...formData, questions })
  }

  const addQuestion = () => setFormData({ ...formData, questions: [...formData.questions, ''] })

  const removeQuestion = (index) => setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.event_name || !formData.event_date) { setError('Please fill in all required fields'); return }
    const payload = {
      ...formData,
      description: formData.description || null,
      questions: formData.questions.map((q) => q.trim()).filter(Boolean)
    }
    setUploading(true)
    try {
      let eventId = editingId
      if (editingId) {
        await updateEvent(editingId, payload, adminAuth.token)
        setSuccess('Event updated successfully!')
      } else {
        const { data } = await createEvent(payload, adminAuth.token)
        eventId = data.event_id
        setSuccess('Event created successfully!')
      }
      if (pendingImage && eventId) await uploadEventImage(eventId, pendingImage, adminAuth.token)
      if (imageRemoved && eventId && !pendingImage) await removeEventImage(eventId, adminAuth.token).catch(() => {})
      setFormData(EMPTY_FORM)
      setEditingId(null)
      setImage(null)
      setPendingImage(null)
      setImageRemoved(false)
      setShowForm(false)
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || (editingId ? 'Failed to update event' : 'Failed to create event'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event and its feedback? This cannot be undone.')) return
    setError('')
    setSuccess('')
    try {
      await deleteEvent(eventId, adminAuth.token)
      setSuccess('Event deleted')
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete event')
    }
  }

  if (loading) return <LoadingSpinner message="Loading events..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold neon-purple">📅 Events</h1>
          <button onClick={() => (showForm && !editingId ? setShowForm(false) : openCreate())} className="flex items-center gap-2 btn-neon"><Plus size={20} />New Event</button>
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}
        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{editingId ? 'Edit Event' : 'Create New Event'}</h3><button onClick={() => { setShowForm(false); setEditingId(null) }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event Name" value={formData.event_name} onChange={(e) => setFormData({ ...formData, event_name: e.target.value })} className="input-field w-full" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full" />

              <div className="border border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400 uppercase tracking-wide flex items-center gap-2"><ImagePlus size={16} />Event Photo</label>
                  {image && <button type="button" onClick={handleRemoveImage} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                </div>
                {image && <img src={image} alt="Event preview" className="w-full h-40 object-cover rounded-lg mb-2" />}
                <input type="file" accept="image/*" onChange={handleImageSelect} className="text-sm text-gray-400 w-full" />
                {uploading && <p className="text-xs text-cyan-400 mt-1">Processing image...</p>}
              </div>

              <input type="text" placeholder="Date (DD-MM-YYYY)" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="input-field w-full" />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field w-full">
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>

              <div className="border border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400 uppercase tracking-wide flex items-center gap-2"><ListPlus size={16} />Feedback Questions (optional)</label>
                  <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"><Plus size={14} />Add Question</button>
                </div>
                {formData.questions.length === 0 && <p className="text-xs text-gray-500">No extra questions — students will only give a rating and comment.</p>}
                <div className="space-y-2">
                  {formData.questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder={`Question ${i + 1}`} value={q} onChange={(e) => setQuestion(i, e.target.value)} className="input-field w-full" />
                      <button type="button" onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-300 px-2"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={uploading} className="btn-neon w-full">{uploading ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}</button>
            </form>
          </div>
        )}
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="card text-center text-gray-400">No events created yet</div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="card">
                {event.image_url && <img src={event.image_url} alt={event.event_name} className="w-full h-40 object-cover rounded-lg mb-3" />}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1"><h3 className="font-semibold text-lg">{event.event_name}</h3>{event.description && <p className="text-sm text-gray-400 mb-1">{event.description}</p>}<p className="text-xs text-cyan-400">{event.event_date}</p>
                    {event.questions?.length > 0 && <p className="text-xs text-purple-300 mt-1">{event.questions.length} custom question{event.questions.length > 1 ? 's' : ''}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${event.status === 'Active' ? 'bg-green-500 bg-opacity-20 text-green-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>{event.status}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(event)} className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-purple-500 bg-opacity-20 hover:bg-opacity-40 text-purple-300 rounded transition-all"><Pencil size={16} />Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-40 text-red-300 rounded transition-all"><Trash2 size={16} />Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
