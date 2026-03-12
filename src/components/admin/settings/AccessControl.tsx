'use client'

import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

export default function AccessControl() {
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="pt-8 border-t border-slate-100 space-y-6">
      <h2 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        System Access
      </h2>
      
      <div 
        onClick={() => setEnabled(!enabled)}
        className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] cursor-pointer hover:bg-slate-100/50 transition-colors group"
      >
        <div>
          <p className="font-bold text-[#0f172a] text-sm">Public Registration</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Allow new students to sign up from the homepage.</p>
        </div>
        <div className={`w-14 h-7 rounded-full relative transition-all duration-300 ${enabled ? 'bg-primary' : 'bg-slate-300'}`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${enabled ? 'right-1' : 'left-1'}`}></div>
        </div>
      </div>
    </div>
  )
}
