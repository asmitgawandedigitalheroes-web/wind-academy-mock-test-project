'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Plus, 
  HelpCircle, 
  CheckCircle2,
  Trash2,
  Edit2,
  LayoutList,
  ChevronRight,
  BookOpen,
  FileText,
  UploadCloud
} from 'lucide-react'
import Link from 'next/link'
import { getTestDetails, getQuestionsByTest, deleteQuestion, bulkUploadQuestions } from '@/app/actions/admin'
import AddQuestionToTestModal from '@/components/admin/questions/AddQuestionToTestModal'

export default function TestQuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [test, setTest] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)

  const handleEdit = (question: any) => {
    setEditingQuestion(question)
    setShowAddQuestion(true)
  }

  const handleDelete = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setLoading(true)
      await deleteQuestion(questionId, id)
      fetchData()
    }
  }

  const fetchData = async () => {
    setLoading(true)
    const [testDetails, questionList] = await Promise.all([
      getTestDetails(id),
      getQuestionsByTest(id)
    ])
    setTest(testDetails)
    setQuestions(questionList)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading && !test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 animate-pulse">Loading test questions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Modals */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <AddQuestionToTestModal 
            testSetId={id}
            subjectId={test?.subject_id}
            initialData={editingQuestion}
            onCancel={() => {
              setShowAddQuestion(false)
              setEditingQuestion(null)
            }}
            onSuccess={() => {
              setShowAddQuestion(false)
              setEditingQuestion(null)
              fetchData()
            }}
          />
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
          <Link href="/admin/questions" className="hover:text-primary transition-colors">Subjects</Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link href={`/admin/subjects/${test?.subject_id}`} className="hover:text-primary transition-colors">{test?.subjects?.name}</Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-600">Manage Questions</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white shadow-xl shadow-primary/5 rounded-3xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">
                <span>Test Config</span>
              </div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">{test?.title}</h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <label className="cursor-pointer bg-white border-2 border-slate-200 text-[#0f172a] px-8 py-4 rounded-2xl font-black shadow-lg shadow-slate-200/50 hover:bg-slate-50 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-3 whitespace-nowrap">
               <UploadCloud className="w-6 h-6 shrink-0" />
               {loading && !test ? 'Uploading...' : 'Upload CSV'}
               <input 
                 type="file" 
                 accept=".csv"
                 disabled={loading}
                 className="hidden" 
                 onChange={async (e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     setLoading(true);
                     const reader = new FileReader();
                     reader.onload = async (event) => {
                       const content = event.target?.result as string;
                       const result = await bulkUploadQuestions(id, test?.subject_id, content);
                       if (result.success) {
                         alert(`Successfully uploaded ${result.successCount} questions!${result.errorCount ? ` (${result.errorCount} errors)` : ''}`);
                         fetchData();
                       } else {
                         alert(`Error: ${result.error}`);
                         setLoading(false);
                       }
                     };
                     reader.readAsText(file);
                   }
                 }}
               />
            </label>
            <button 
              onClick={() => setShowAddQuestion(true)}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-[#152e75] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 whitespace-nowrap"
            >
              <Plus className="w-6 h-6 shrink-0" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
            <LayoutList className="w-6 h-6 text-primary" />
            Questions List ({questions.length})
          </h2>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-primary/5 p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a]">This test is empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Add your first question to this test set to make it available for students.</p>
            <button 
              onClick={() => setShowAddQuestion(true)}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all"
            >
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-primary/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 group-hover:bg-primary transition-colors"></div>
                
                <div className="flex justify-between items-start gap-6 relative z-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black text-sm shrink-0">#{idx + 1}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{q.question_type === 'multiple' ? 'Multiple Choice' : 'Single Choice'}</span>
                          </div>
                          <p className="text-lg font-bold text-[#0f172a] leading-relaxed">{q.question_text}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isCorrect = q.correct_options ? q.correct_options.includes(optIdx) : q.correct_option_index === optIdx;
                        return (
                          <div 
                            key={optIdx} 
                            className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-bold ${isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isCorrect ? 'bg-green-500 text-white' : 'bg-white text-slate-300'}`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                          </div>
                        )
                      })}
                    </div>

                    {q.explanation && (
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <ChevronRight className="w-3 h-3" />
                                Explanation
                            </p>
                            <p className="text-sm text-slate-600 font-medium">{q.explanation}</p>
                        </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleEdit(q)}
                      className="p-3 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
