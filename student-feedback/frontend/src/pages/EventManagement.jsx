import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminEvents, createEvent, updateEvent, deleteEvent, uploadEventImage, removeEventImage } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, Plus, Trash2, X, Pencil, ImagePlus, ListPlus, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

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
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file')
      return
    }
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
      try {
        await removeEventImage(editingId, adminAuth.token)
        setImageRemoved(false)
      } catch (err) {
        setError('Failed to remove image')
      }
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
    if (!formData.event_name || !formData.event_date) {
      setError('Please fill in all required fields')
      return
    }
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
      setSuccess('Event deleted successfully')
      refresh()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete event')
    }
  }

  if (loading) return <LoadingSpinner message="Loading events..." />

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="neu-icon-btn"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">Campus Events</h1>
              <p className="text-xs text-[#d8c2ad]">Configure event details and custom question surveys</p>
            </div>
          </div>
          <button
            onClick={() => (showForm && !editingId ? setShowForm(false) : openCreate())}
            className="landing-button landing-button-admin text-xs sm:text-sm py-2.5 px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Event</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 neu-sunken border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3.5 neu-sunken border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-400 text-sm">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Create / Edit Modal Form */}
        {showForm && (
          <div className="card mb-8 animate-fadeIn p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#FEF3E2]/5">
              <div>
                <h3 className="font-extrabold text-xl text-[#FEF3E2]">
                  {editingId ? 'Edit Event Details' : 'Create New Campus Event'}
                </h3>
                <p className="text-xs text-[#d8c2ad]">Students can rate and respond after publication</p>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="neu-icon-btn"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Annual Tech Symposium 2026"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe the event, organizers, and key highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Photo Upload */}
              <div className="p-4 rounded-xl neu-sunken border border-[#FEF3E2]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider flex items-center gap-2">
                    <ImagePlus size={16} className="text-[#F4AE52]" />
                    Event Banner Photo
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                {image && (
                  <div className="w-full h-44 overflow-hidden rounded-xl border border-[#FEF3E2]/10 neu-sunken">
                    <img src={image} alt="Event preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="text-xs text-[#d8c2ad] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#F4AE52]/20 file:text-[#F4AE52] hover:file:bg-[#F4AE52]/30 cursor-pointer"
                />
                {uploading && <p className="text-xs text-[#F4AE52]">Processing image file...</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block mb-1.5">
                    Date (DD-MM-YYYY) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25-10-2026"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider block mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="Active">Active (Accepting Feedback)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="p-4 rounded-xl neu-sunken border border-[#FEF3E2]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#d8c2ad] uppercase tracking-wider flex items-center gap-2">
                    <ListPlus size={16} className="text-[#D4621A]" />
                    Custom Survey Questions (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="neu-button text-xs py-1 px-3"
                  >
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                {formData.questions.length === 0 ? (
                  <p className="text-xs text-[#9c8472] py-1">
                    No custom questions added. Students will provide star rating & commentary.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {formData.questions.map((q, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Question ${i + 1} (e.g. Was the speaker clear?)`}
                          value={q}
                          onChange={(e) => setQuestion(i, e.target.value)}
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeQuestion(i)}
                          className="neu-icon-btn text-red-400 hover:text-red-300 flex-shrink-0"
                          title="Remove question"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null) }}
                  className="neu-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="landing-button landing-button-admin"
                >
                  {uploading ? 'Saving Event...' : editingId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="card text-center p-8 text-[#d8c2ad]">
              No campus events created yet. Click "New Event" above to create one.
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="card p-5 sm:p-6 space-y-4">
                {event.image_url && (
                  <div className="w-full h-44 sm:h-52 overflow-hidden rounded-xl border border-[#FEF3E2]/10 neu-sunken">
                    <img src={event.image_url} alt={event.event_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F4AE52]/10 text-[#F4AE52] border border-[#F4AE52]/20">
                        <Calendar size={12} />
                        {event.event_date}
                      </span>
                      <span className={`neu-badge ${event.status === 'Active' ? 'neu-badge-green' : 'neu-badge-red'}`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl text-[#FEF3E2]">{event.event_name}</h3>
                    {event.description && (
                      <p className="text-xs sm:text-sm text-[#d8c2ad] mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    {event.questions?.length > 0 && (
                      <p className="text-xs text-[#F4AE52] mt-2 font-medium">
                        ✦ {event.questions.length} custom survey question{event.questions.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#FEF3E2]/5">
                  <button
                    onClick={() => openEdit(event)}
                    className="neu-button flex-1 text-[#F4AE52] text-xs sm:text-sm py-2"
                  >
                    <Pencil size={15} /> Edit Event
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="neu-button flex-1 text-red-400 text-xs sm:text-sm py-2 hover:text-red-300"
                  >
                    <Trash2 size={15} /> Delete Event
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
