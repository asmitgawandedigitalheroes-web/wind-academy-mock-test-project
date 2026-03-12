'use client'

import React, { useState } from 'react'
import { Save } from 'lucide-react'
import SettingsSidebar from '@/components/admin/settings/SettingsSidebar'
import BrandingForm from '@/components/admin/settings/BrandingForm'
import AccessControl from '@/components/admin/settings/AccessControl'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight text-center md:text-left">Admin Settings</h1>
        <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Configure global application parameters and system security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 space-y-10">
            {activeTab === 'general' && (
              <>
                <BrandingForm />
                <AccessControl />
              </>
            )}
            
            {activeTab !== 'general' && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a]">Modular Settings Coming Soon</h3>
                <p className="text-slate-500 max-w-xs mx-auto">We're currently building out the {activeTab} section to provide more granular control.</p>
              </div>
            )}

            <button className="w-full flex justify-center items-center gap-3 bg-[#0f172a] text-white py-5 rounded-[2rem] font-black hover:bg-[#1e293b] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/10 mt-10">
              <Save className="w-5 h-5 text-accent" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

