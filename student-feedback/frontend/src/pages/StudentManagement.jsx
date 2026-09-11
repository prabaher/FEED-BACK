import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllStudents, importStudentsJson } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, FileJson } from 'lucide-react'

export const StudentManagement = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  useEffect(() => {
    if (!adminAuth) navigate('/admin/login')
    else getAllStudents(adminAuth.token).then(({ data }) => setStudents(data)).catch(() => {}).finally(() => setLoading(false))
  }, [adminAuth, navigate])

  const handleImportJson = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setImportMessage('')
    try {
      const { data } = await importStudentsJson(file, adminAuth.token)
      setImportMessage(`✓ Imported ${data.imported} students`)
      setTimeout(() => getAllStudents(adminAuth.token).then(({ data: d }) => setStudents(d)), 1000)
    } catch (err) {
      setImportMessage('✗ Import failed: ' + err.response?.data?.message)
    } finally {
      setImporting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading students..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft size={20} />Back</button>
        <h1 className="text-3xl font-bold mb-6 neon-cyan">👥 Students</h1>
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Import Students</h3>
          <label className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-5 border-2 border-dashed border-white border-opacity-20 rounded-lg cursor-pointer hover:border-opacity-50 transition-all">
            <FileJson size={24} className="mb-2 text-cyan-400" />
            <span className="text-xs text-gray-400">JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} disabled={importing} className="hidden" />
          </label>
          {importMessage && <p className={`mt-3 text-sm ${importMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{importMessage}</p>}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-400 uppercase mb-3">Total Students: {students.length}</h3>
          {students.length === 0 ? (
            <div className="card text-center text-gray-400">No students imported yet</div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="card p-3">
                <div className="flex justify-between items-start">
                  <div><p className="font-semibold">{student.name}</p><p className="text-xs text-cyan-400 font-mono">{student.register_no}</p><p className="text-xs text-gray-400">{student.department} - Year {student.year}</p></div>
                  <span className="text-xs bg-green-500 bg-opacity-20 text-green-300 px-2 py-1 rounded">Active</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
