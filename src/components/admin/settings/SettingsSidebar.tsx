'use client'

import React from 'react'
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Globe, 
  Database 
} from 'lucide-react'

const settingsTabs = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'security', name: 'Security', icon: Lock },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'region', name: 'Language & Region', icon: Globe },
  { id: 'backup', name: 'Backup & Data', icon: Database },
]

export default function SettingsSidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {settingsTabs.map((item) => (
        <button 
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all text-left ${
            activeTab === item.id 
            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
            : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-accent' : 'text-slate-400'}`} />
          {item.name}
        </button>
      ))}
    </div>
  )
}
