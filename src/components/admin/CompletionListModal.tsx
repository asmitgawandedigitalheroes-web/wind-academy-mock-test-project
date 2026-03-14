'use client'

import React from 'react'
import { X, User, Mail, Calendar, CheckCircle2, TrendingUp, Award } from 'lucide-react'

interface CompletionListModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle: string
  data: any[]
  type: 'test' | 'module'
  loading?: boolean
}

export default function CompletionListModal({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  type,
  loading = false
}: CompletionListModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium text-sm mt-0.5">{subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-300 hover:text-slate-600 border border-transparent hover:border-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="font-black text-slate-400">Loading student list...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <User className="w-8 h-8" />
              </div>
              <p className="font-black text-slate-400">No students found for this {type}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                      <User className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#0f172a] group-hover:text-primary transition-colors">
                        {type === 'test' ? (item.profiles?.full_name || 'Deleted User') : (item.profile?.full_name || 'Deleted User')}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <Mail className="w-3 h-3" />
                          {type === 'test' ? item.profiles?.email : item.profile?.email}
                        </span>
                        <span className="text-slate-200">•</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(type === 'test' ? item.completed_at : item.lastAttempt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {type === 'test' ? (
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <span className="text-sm font-black text-[#0f172a]">{item.score}%</span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${item.score >= 70 ? 'text-green-500' : 'text-red-400'}`}>
                          {item.score >= 70 ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          <span className="text-sm font-black text-[#0f172a]">{item.testsCompleted} Tests</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 justify-end">
                          <Award className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Best: {item.bestScore}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Wings Academy Admin Panel
          </p>
        </div>
      </div>
    </div>
  )
}
