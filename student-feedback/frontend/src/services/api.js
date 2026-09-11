import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const studentLogin = (registerNo, password) => api.post('/auth/login', { register_no: registerNo, password })
export const submitGeneralFeedback = (feedback, token) => api.post('/feedback/general', feedback, { headers: { 'Authorization': `Bearer ${token}` } })
export const getMyGeneralFeedback = (token) => api.get('/feedback/general/my', { headers: { 'Authorization': `Bearer ${token}` } })
export const getEvents = () => api.get('/events')
export const getEvent = (eventId) => api.get(`/events/${eventId}`)
export const submitEventFeedback = (eventId, feedback, token) => api.post(`/events/${eventId}/feedback`, feedback, { headers: { 'Authorization': `Bearer ${token}` } })
export const getMyEventFeedback = (eventId, token) => api.get(`/events/${eventId}/feedback/my`, { headers: { 'Authorization': `Bearer ${token}` } })
export const adminLogin = (username, password) => api.post('/auth/admin-login', { username, password })
export const getAdminStats = (token) => api.get('/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
export const getAllStudents = (token) => api.get('/admin/students', { headers: { 'Authorization': `Bearer ${token}` } })
export const importStudentsJson = (file, token) => { const formData = new FormData(); formData.append('file', file); return api.post('/admin/students/import-json', formData, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }) }
export const createEvent = (eventData, token) => api.post('/admin/events', eventData, { headers: { 'Authorization': `Bearer ${token}` } })
export const getAdminEvents = (token) => api.get('/admin/events', { headers: { 'Authorization': `Bearer ${token}` } })
export const deleteEvent = (eventId, token) => api.delete(`/admin/events/${eventId}`, { headers: { 'Authorization': `Bearer ${token}` } })
export const getGeneralFeedback = (token) => api.get('/admin/feedback/general', { headers: { 'Authorization': `Bearer ${token}` } })
export const getEventFeedback = (eventId, token) => api.get(`/admin/feedback/events/${eventId}`, { headers: { 'Authorization': `Bearer ${token}` } })
