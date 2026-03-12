'use client'

import React from 'react'
import { Search, Bell, UserCircle } from 'lucide-react'

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-slate-50">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for tests, subjects, or questions..." 
            className="w-full bg-slate-50 border border-slate-100 py-3 pl-12 pr-6 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all font-medium text-sm text-[#0f172a]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
          <Bell className="w-5 h-5 group-hover:text-primary" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white ring-2 ring-accent/20"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-[#0f172a] leading-tight">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Student Explorer</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group cursor-pointer hover:border-primary/20 transition-all">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  )
}
