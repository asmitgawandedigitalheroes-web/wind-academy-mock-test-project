'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Plus, 
  FileText, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Play,
  Settings,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { getSubjectDetails, getTestsBySubject } from '@/app/actions/admin'
import AddTestModal from '@/components/admin/tests/AddTestModal'

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [subject, setSubject] = useState<any>(null)
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTest, setShowAddTest] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const [subDetails, testList] = await Promise.all([
      getSubjectDetails(id),
      getTestsBySubject(id)
    ])
    setSubject(subDetails)
    setTests(testList)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading && !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 animate-pulse">Loading subject data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Add Test Modal */}
      {showAddTest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <AddTestModal 
            subjectId={id}
            onCancel={() => setShowAddTest(false)}
            onSuccess={() => {
              setShowAddTest(false)
              fetchData()
            }}
          />
        </div>
      )}

      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/questions"
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Subjects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white shadow-xl shadow-primary/5 rounded-3xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">
                <span>{subject?.categories?.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
              </div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">{subject?.name}</h1>
            </div>
          </div>
          <button 
            onClick={() => setShowAddTest(true)}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-[#152e75] hover:scale-[1.02] transition-all flex items-center gap-3 shrink-0"
          >
            <Plus className="w-6 h-6" />
            Add New Test
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tests</p>
          <p className="text-2xl font-black text-[#0f172a]">{tests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Total Questions</p>
          <p className="text-2xl font-black text-[#0f172a]">0</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Average Time</p>
          <p className="text-2xl font-black text-[#0f172a]">45m</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-lg font-black text-[#0f172a]">Ready</p>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Available Test Sets
            </h2>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Sort by:</span>
                <select className="bg-transparent text-sm font-black text-slate-600 cursor-pointer outline-none">
                    <option>Newest First</option>
                    <option>A - Z</option>
                </select>
            </div>
        </div>

        {tests.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-primary/5 p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-primary translate-x-0.5" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a]">No Tests Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">This subject doesn't have any mock tests yet. Create your first one to start adding questions.</p>
            <button 
              onClick={() => setShowAddTest(true)}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all"
            >
              Create First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5 hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/5 group-hover:scale-110 transition-all">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <h4 className="text-xl font-black text-[#0f172a] mb-2">{test.title}</h4>
                
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{test.test_type === 'short' ? 'Short Length' : 'Full Length'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{test.time_limit_minutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">0 Qs</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                    <Link 
                        href={`/admin/tests/${test.id}`}
                        className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Manage
                    </Link>
                    <button className="flex items-center justify-center gap-2 py-4 bg-primary/5 text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Play className="w-4 h-4" />
                        Preview
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
