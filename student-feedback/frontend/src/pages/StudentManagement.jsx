import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllStudents, importStudentsJson, importStudentsExcel, createStudent } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, FileJson, FileSpreadsheet, UserPlus, Download } from 'lucide-react'

const initialForm = {
  register_no: '',
  name: '',
  dob: '',
  department: '',
  year: '',
  section: ''
}

const sampleStudents = [
  {
    register_no: '23AD001',
    name: 'Student One',
    dob: '15-04-2005',
    department: 'CSE',
    year: '2',
    section: 'A'
  },
  {
    register_no: '23AD002',
    name: 'Student Two',
    dob: '20-06-2005',
    department: 'ECE',
    year: '2',
    section: 'B'
  }
]

export const StudentManagement = () => {
  const { adminAuth } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const [importSummary, setImportSummary] = useState(null)
  const [formMessage, setFormMessage] = useState('')
  const [formData, setFormData] = useState(initialForm)

  const refreshStudents = async () => {
    if (!adminAuth) return
    try {
      const { data } = await getAllStudents(adminAuth.token)
      setStudents(data)
    } catch (error) {
      console.error('Failed to load students', error)
    }
  }

  useEffect(() => {
    if (!adminAuth) {
      navigate('/admin/login')
      return
    }

    getAllStudents(adminAuth.token)
      .then(({ data }) => setStudents(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [adminAuth, navigate])

  const downloadSampleJson = () => {
    const blob = new Blob([JSON.stringify(sampleStudents, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'students-sample.json'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleBulkImport = async (file, type) => {
    if (!file) return

    setImporting(true)
    setImportMessage('')
    setImportSummary(null)

    try {
      const importer = type === 'excel' ? importStudentsExcel : importStudentsJson
      const { data } = await importer(file, adminAuth.token)

      if (data?.status === 'success') {
        setImportSummary(data)
        setImportMessage(`✓ ${data.message}`)
        await refreshStudents()
      } else {
        setImportMessage(`✗ ${data?.message || 'Import failed'}`)
      }
    } catch (err) {
      setImportMessage('✗ Import failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setImporting(false)
    }
  }

  const handleImportJson = async (event) => {
    const file = event.target.files[0]
    await handleBulkImport(file, 'json')
    event.target.value = ''
  }

  const handleImportExcel = async (event) => {
    const file = event.target.files[0]
    await handleBulkImport(file, 'excel')
    event.target.value = ''
  }

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleAddStudent = async (event) => {
    event.preventDefault()
    setFormMessage('')
    setFormLoading(true)

    try {
      const { data } = await createStudent(formData, adminAuth.token)
      setFormMessage(`✓ ${data.message}`)
      setFormData(initialForm)
      await refreshStudents()
    } catch (err) {
      setFormMessage('✗ ' + (err.response?.data?.detail || err.message))
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading students..." />

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-6 neon-cyan">👥 Students</h1>

        <div className="card mb-6 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300"><UserPlus size={20} /></div>
            <h3 className="font-semibold text-lg">Add Student Manually</h3>
          </div>

          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input-field" name="register_no" placeholder="Register No" value={formData.register_no} onChange={handleChange} required />
            <input className="input-field" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required />
            <input className="input-field" name="dob" placeholder="Date of Birth (dd-mm-yyyy)" value={formData.dob} onChange={handleChange} required />
            <input className="input-field" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
            <input className="input-field" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required />
            <input className="input-field" name="section" placeholder="Section" value={formData.section} onChange={handleChange} required />
            <div className="md:col-span-2">
              <button type="submit" disabled={formLoading} className="btn-neon w-full md:w-auto">
                {formLoading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>

          {formMessage && <p className={`mt-3 text-sm ${formMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{formMessage}</p>}
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold">Bulk Import Students</h3>
            <button onClick={downloadSampleJson} className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-2">
              <Download size={16} />
              Download sample JSON
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Required fields: register_no, name, dob, department, year, section
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-5 border-2 border-dashed border-white border-opacity-20 rounded-lg cursor-pointer hover:border-opacity-50 transition-all">
              <FileJson size={24} className="mb-2 text-cyan-400" />
              <span className="text-xs text-gray-400">Upload JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} disabled={importing} className="hidden" />
            </label>

            <label className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-5 border-2 border-dashed border-white border-opacity-20 rounded-lg cursor-pointer hover:border-opacity-50 transition-all">
              <FileSpreadsheet size={24} className="mb-2 text-green-400" />
              <span className="text-xs text-gray-400">Upload Excel (.xlsx)</span>
              <input type="file" accept=".xlsx" onChange={handleImportExcel} disabled={importing} className="hidden" />
            </label>
          </div>

          {importMessage && <p className={`mt-3 text-sm ${importMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{importMessage}</p>}

          {importSummary && importSummary.status === 'success' && (
            <div className="mt-3 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg p-3">
              <p>Total rows: {importSummary.total_rows}</p>
              <p>Imported: {importSummary.imported}</p>
              <p>Skipped duplicates: {importSummary.skipped_duplicates}</p>
              <p>Skipped invalid: {importSummary.skipped_invalid}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-400 uppercase mb-3">Total Students: {students.length}</h3>
          {students.length === 0 ? (
            <div className="card text-center text-gray-400">No students imported yet</div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="card p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-cyan-400 font-mono">{student.register_no}</p>
                    <p className="text-xs text-gray-400">{student.department} - Year {student.year} - Section {student.section}</p>
                  </div>
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
