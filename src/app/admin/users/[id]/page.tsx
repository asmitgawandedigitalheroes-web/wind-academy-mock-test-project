'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Clock, 
  BookOpen,
  Award,
  History,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/common/BackButton'
import { createClient } from '@/utils/supabase/client'
import { updateUserStatus, forceLogoutUser } from '@/app/actions/admin'
import ConfirmationModal from '@/components/common/ConfirmationModal'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [recentTests, setRecentTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean,
    title: string,
    message: string,
    type: 'info' | 'danger',
    onConfirm: () => void,
    confirmLabel?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  })

  const supabase = createClient()

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    setLoading(true)
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    // Fetch test results
    const { data: resultsData } = await supabase
      .from('test_results')
      .select(`
        *,
        test_sets (title, pass_percentage, modules (name))
      `)
      .eq('user_id', id)
      .order('completed_at', { ascending: false })

    setProfile(profileData)
    
    // Map data for UI
    const mappedResults = (resultsData || []).map(r => ({
      ...r,
      score: typeof r.score === 'string' ? parseFloat(r.score) : r.score,
      created_at: r.completed_at
    }))
    
    setRecentTests(mappedResults)
    
    // Calculate stats
    if (mappedResults.length > 0) {
      const totalScore = mappedResults.reduce((sum, r) => sum + r.score, 0)
      const avgScore = Math.round(totalScore / mappedResults.length)
      const passedTests = mappedResults.filter(r => r.score >= (r.test_sets?.pass_percentage || 70)).length
      
      setStats({
        totalTests: mappedResults.length,
        avgScore,
        passPercentage: Math.round((passedTests / mappedResults.length) * 100)
      })
    } else {
      setStats({
        totalTests: 0,
        avgScore: 0,
        passPercentage: 0
      })
    }

    setLoading(false)
  }

  const handleStatusToggle = () => {
    if (!profile) return
    const isSuspended = profile.status === 'suspended'
    const newStatus = isSuspended ? 'active' : 'suspended'
    
    setModalConfig({
      isOpen: true,
      title: isSuspended ? 'Activate Student' : 'Suspend Student',
      message: `Are you sure you want to ${isSuspended ? 'activate' : 'suspend'} this student? They will ${isSuspended ? 'regain' : 'lose'} access to the platform.`,
      type: isSuspended ? 'info' : 'danger',
      confirmLabel: isSuspended ? 'Activate' : 'Suspend',
      onConfirm: async () => {
        setActionLoading(true)
        const res = await updateUserStatus(id, newStatus)
        if (res.error) {
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: res.error,
            type: 'danger',
            confirmLabel: 'OK',
            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
          })
        } else {
          await fetchStudentData()
          setModalConfig({
            isOpen: true,
            title: 'Success',
            message: `User status updated to ${newStatus}`,
            type: 'info',
            confirmLabel: 'OK',
            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
          })
        }
        setActionLoading(false)
      }
    })
  }

  const handleForceLogout = () => {
    setModalConfig({
      isOpen: true,
      title: 'Force Logout',
      message: 'Are you sure you want to force logout this student from all devices? This will invalidate all active sessions immediately.',
      type: 'danger',
      confirmLabel: 'Force Logout',
      onConfirm: async () => {
        setActionLoading(true)
        const res = await forceLogoutUser(id)
        if (res.error) {
          setModalConfig({
            isOpen: true,
            title: 'Error',
            message: res.error,
            type: 'danger',
            confirmLabel: 'OK',
            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
          })
        } else {
          setModalConfig({
            isOpen: true,
            title: 'Logged Out',
            message: 'Student has been logged out from all devices.',
            type: 'info',
            confirmLabel: 'OK',
            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
          })
        }
        setActionLoading(false)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 animate-pulse">Loading student profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <BackButton variant="ghost" className="-ml-3" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 p-8 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${profile?.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`}></div>
            
            <div className="w-24 h-24 bg-slate-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-slate-300" />
            </div>
            
            <h1 className="text-2xl font-black text-[#0f172a]">{profile?.full_name}</h1>
            <p className="text-slate-400 font-medium">{profile?.email}</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider ${
                profile?.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
              }`}>
                {profile?.role || 'student'}
              </span>
              <span className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider ${
                profile?.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {profile?.status || 'active'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t border-slate-50 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-bold text-slate-500 truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-bold text-slate-500 line-clamp-1">Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 p-8 space-y-4">
            <h3 className="text-lg font-black text-[#0f172a] flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
            <button 
              onClick={handleStatusToggle}
              disabled={actionLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all text-left flex items-center justify-between ${
                profile?.status === 'suspended' 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              } disabled:opacity-50`}
            >
              {profile?.status === 'suspended' ? 'Activate Student' : 'Suspend Student'}
              {profile?.status === 'suspended' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleForceLogout}
              disabled={actionLoading}
              className="w-full py-3 px-4 bg-slate-50 hover:bg-primary/5 text-slate-600 hover:text-primary rounded-xl font-bold text-sm transition-all text-left flex items-center justify-between disabled:opacity-50"
            >
              Force Logout
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats & History */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tests Taken</p>
              </div>
              <h4 className="text-3xl font-black text-[#0f172a]">{stats?.totalTests || 0}</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg. Score</p>
              </div>
              <h4 className="text-3xl font-black text-[#0f172a]">{stats?.avgScore || 0}%</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pass Rate</p>
              </div>
              <h4 className="text-3xl font-black text-[#0f172a]">{stats?.passPercentage || 0}%</h4>
            </div>
          </div>

          {/* Test History */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
                <History className="w-6 h-6 text-primary" />
                Performance History
              </h3>
            </div>
            <div className="overflow-x-auto">
              {recentTests.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold">
                  No test attempts found for this student.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Title</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentTests.map((t) => {
                      const isPass = t.score >= (t.test_sets?.pass_percentage || 70)
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4">
                            <p className="text-sm font-black text-[#0f172a]">{t.test_sets?.title}</p>
                            <p className="text-[10px] text-primary font-bold uppercase">{t.test_sets?.modules?.name}</p>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`font-black text-sm ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                              {t.score}%
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isPass ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                              <Clock className="w-3 h-3" />
                              {new Date(t.created_at).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmLabel={modalConfig.confirmLabel}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        isLoading={actionLoading}
      />
    </div>
  )
}
