import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllStudents, importStudentsJson, importStudentsExcel, createStudent } from '../services/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ArrowLeft, FileJson, FileSpreadsheet, UserPlus, Download, CheckCircle, AlertCircle, Users } from 'lucide-react'

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

  if (loading) return <LoadingSpinner message="Loading students database..." />

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="neu-icon-btn"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FEF3E2]">Student Directory</h1>
            <p className="text-xs text-[#d8c2ad]">Add, import, and review student rosters</p>
          </div>
        </div>

        {/* Add Student Manually */}
        <div className="card mb-6 animate-fadeIn p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#FEF3E2]/5">
            <div className="p-2.5 rounded-xl bg-[#D4621A]/10 text-[#D4621A] border border-[#D4621A]/20 shadow-[inset_2px_2px_4px_rgba(10,5,1,0.5)]">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#FEF3E2]">Add Student Manually</h3>
              <p className="text-xs text-[#d8c2ad]">Create a single student record with DOB login</p>
            </div>
          </div>

          <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Register No</label>
              <input
                className="input-field"
                name="register_no"
                placeholder="e.g. 23AD001"
                value={formData.register_no}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Student Name</label>
              <input
                className="input-field"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Date of Birth</label>
              <input
                className="input-field"
                name="dob"
                placeholder="DD-MM-YYYY"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Department</label>
              <input
                className="input-field"
                name="department"
                placeholder="e.g. CSE, IT, AIDS"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Year</label>
              <input
                className="input-field"
                name="year"
                placeholder="e.g. 1, 2, 3, 4"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#d8c2ad] uppercase tracking-wider block mb-1.5 font-semibold">Section</label>
              <input
                className="input-field"
                name="section"
                placeholder="e.g. A, B"
                value={formData.section}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="landing-button landing-button-student w-full sm:w-auto"
              >
                {formLoading ? 'Adding Student...' : 'Add Student Record'}
              </button>
            </div>
          </form>

          {formMessage && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-sm neu-sunken ${
              formMessage.startsWith('✓') ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
            }`}>
              {formMessage.startsWith('✓') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{formMessage}</span>
            </div>
          )}
        </div>

        {/* Bulk Import */}
        <div className="card mb-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#FEF3E2]/5">
            <div>
              <h3 className="font-bold text-lg text-[#FEF3E2]">Bulk Import Students</h3>
              <p className="text-xs text-[#d8c2ad]">Import hundreds of students via JSON or Excel (.xlsx)</p>
            </div>
            <button
              type="button"
              onClick={downloadSampleJson}
              className="neu-button text-xs text-[#F4AE52] hover:text-[#f7c27d]"
            >
              <Download size={14} />
              Sample JSON
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center p-6 neu-sunken border border-dashed border-[#D4621A]/35 hover:border-[#D4621A]/70 rounded-2xl cursor-pointer transition-all group">
              <div className="p-3 rounded-xl bg-[#D4621A]/10 text-[#D4621A] mb-2 group-hover:scale-110 transition-transform">
                <FileJson size={28} />
              </div>
              <span className="text-sm font-semibold text-[#FEF3E2]">Upload JSON File</span>
              <span className="text-xs text-[#d8c2ad] mt-0.5">Click to browse file</span>
              <input type="file" accept=".json" onChange={handleImportJson} disabled={importing} className="hidden" />
            </label>

            <label className="flex flex-col items-center justify-center p-6 neu-sunken border border-dashed border-[#F4AE52]/35 hover:border-[#F4AE52]/70 rounded-2xl cursor-pointer transition-all group">
              <div className="p-3 rounded-xl bg-[#F4AE52]/10 text-[#F4AE52] mb-2 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={28} />
              </div>
              <span className="text-sm font-semibold text-[#FEF3E2]">Upload Excel (.xlsx)</span>
              <span className="text-xs text-[#d8c2ad] mt-0.5">Click to browse spreadsheet</span>
              <input type="file" accept=".xlsx" onChange={handleImportExcel} disabled={importing} className="hidden" />
            </label>
          </div>

          {importing && (
            <div className="mt-4 text-center text-sm text-[#F4AE52] animate-pulse">
              Processing import data...
            </div>
          )}

          {importMessage && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-sm neu-sunken ${
              importMessage.startsWith('✓') ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
            }`}>
              {importMessage.startsWith('✓') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{importMessage}</span>
            </div>
          )}

          {importSummary && importSummary.status === 'success' && (
            <div className="mt-4 text-xs text-[#d8c2ad] neu-sunken border border-[#FEF3E2]/5 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-[#9c8472]">Total Rows</p>
                <p className="text-base font-bold text-[#FEF3E2] mt-0.5">{importSummary.total_rows}</p>
              </div>
              <div>
                <p className="text-[#9c8472]">Imported</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{importSummary.imported}</p>
              </div>
              <div>
                <p className="text-[#9c8472]">Duplicates</p>
                <p className="text-base font-bold text-[#F4AE52] mt-0.5">{importSummary.skipped_duplicates}</p>
              </div>
              <div>
                <p className="text-[#9c8472]">Invalid</p>
                <p className="text-base font-bold text-red-400 mt-0.5">{importSummary.skipped_invalid}</p>
              </div>
            </div>
          )}
        </div>

        {/* Student Records List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#d8c2ad]">
              Total Enrolled: {students.length}
            </h3>
          </div>

          {students.length === 0 ? (
            <div className="card text-center p-8 text-[#d8c2ad]">
              No students imported yet.
            </div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1e1107] text-[#D4621A] border border-[#D4621A]/20 shadow-[inset_2px_2px_4px_rgba(10,5,1,0.5)]">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[#FEF3E2] text-base">{student.name}</p>
                    <p className="text-xs text-[#F4AE52] font-mono mt-0.5">{student.register_no}</p>
                    <p className="text-xs text-[#d8c2ad] mt-1">
                      {student.department} • Year {student.year} • Section {student.section}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="neu-badge neu-badge-green">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
