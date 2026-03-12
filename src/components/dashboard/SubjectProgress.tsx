'use client'

import React from 'react'

const subjects = [
  { name: 'Aviation Law', progress: 85, color: 'bg-primary' },
  { name: 'Aircraft General Knowledge', progress: 62, color: 'bg-accent' },
  { name: 'Flight Performance & Planning', progress: 45, color: 'bg-purple-600' },
  { name: 'Human Performance', progress: 92, color: 'bg-green-500' },
]

export default function SubjectProgress() {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 space-y-6">
      <h3 className="text-xl font-black text-[#0f172a]">Learning Progress</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {subjects.map((item) => (
          <div key={item.name} className="space-y-2.5">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
              <span className="text-sm font-black text-[#0f172a]">{item.progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
