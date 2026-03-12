'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'

export default function BrandingForm() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
        <div className="p-2 bg-primary/5 rounded-lg">
          <UserCircle className="w-6 h-6 text-primary" />
        </div>
        Platform Branding
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Platform Name</label>
          <input 
            type="text" 
            defaultValue="Wings Academy" 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-[#0f172a] shadow-inner"
          />
        </div>
        <div>
          <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Support Email</label>
          <input 
            type="email" 
            defaultValue="support@wingsacademy.com" 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-[#0f172a] shadow-inner"
          />
        </div>
      </div>
    </div>
  )
}
