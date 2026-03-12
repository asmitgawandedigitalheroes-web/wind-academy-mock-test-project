'use client'

import React from 'react'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Trophy, 
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { signout } from '@/app/actions/auth'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Tests', icon: FileText, href: '/dashboard/tests' },
  { name: 'Question Bank', icon: BookOpen, href: '/dashboard/practice' },
  { name: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
            <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#0f172a] leading-none tracking-tight">WINGS</span>
            <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mt-0.5">STUDENT</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-slate-400 group-hover:text-primary'}`} />
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={() => signout()}
          className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
