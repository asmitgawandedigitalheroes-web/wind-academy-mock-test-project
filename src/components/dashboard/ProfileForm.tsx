'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, Globe, CheckCircle2, Ban } from 'lucide-react'
import { updateProfile } from '@/app/actions/dashboard'
import { SubmitButton } from './SubmitButton'

interface ProfileFormProps {
  initialData: {
    full_name: string | null
    email: string | undefined
    phone: string | null
    country: string | null
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      await updateProfile(formData)
      setFeedback({ type: 'success', message: 'Profile updated successfully' })
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Failed to update profile' })
    } finally {
      setIsPending(false)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <>
      {/* Feedback Toast */}
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300 flex items-center gap-3 border ${
          feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
          <span className="font-black text-sm">{feedback.message}</span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2 md:space-y-3">
            <label className="text-[0.6rem] md:text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                name="fullName"
                defaultValue={initialData.full_name || ''}
                type="text"
                className="w-full bg-slate-50 border border-slate-100 py-3.5 md:py-4 pl-14 pr-6 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-[#0f172a]"
              />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <label className="text-[0.6rem] md:text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors" />
              <input
                disabled
                defaultValue={initialData.email || ''}
                type="email"
                className="w-full bg-slate-50 border border-slate-100 py-3.5 md:py-4 pl-14 pr-6 rounded-xl md:rounded-2xl outline-none opacity-50 cursor-not-allowed font-bold text-sm text-[#0f172a]"
              />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <label className="text-[0.6rem] md:text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                name="phone"
                defaultValue={initialData.phone || ''}
                placeholder="+971 50 123 4567"
                type="text"
                className="w-full bg-slate-50 border border-slate-100 py-3.5 md:py-4 pl-14 pr-6 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-[#0f172a]"
              />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <label className="text-[0.6rem] md:text-[0.65rem] font-black text-slate-400 uppercase tracking-widest ml-4">Country</label>
            <div className="relative group">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                name="country"
                defaultValue={initialData.country || 'United Arab Emirates'}
                type="text"
                className="w-full bg-slate-50 border border-slate-100 py-3.5 md:py-4 pl-14 pr-6 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-[#0f172a]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-slate-50 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </>
  )
}
