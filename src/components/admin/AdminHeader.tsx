'use client'

import React from 'react'
import { Bell, Search, User, LogOut, Menu } from 'lucide-react'
import { signout } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function AdminHeader({ userEmail, onMenuClick }: { userEmail?: string, onMenuClick?: () => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    await signout()
    router.push('/login')
  }

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-96">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="bg-transparent border-none outline-none text-sm w-full font-medium"
        />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0f172a] leading-none">Admin Settings</p>
            <p className="text-[0.7rem] font-medium text-slate-500 mt-1">{userEmail || 'admin@windacademy.com'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <User className="w-6 h-6" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
