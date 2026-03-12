'use client'

import React from 'react'
import { TrendingUp, Award, Target } from 'lucide-react'

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0f172a] mb-6">Track Progress & Improve Every Attempt</h2>
        <p className="text-slate-600 text-lg mb-16 max-w-3xl mx-auto">
          Our dashboard gives you a clear view of your preparation. Watch your scores climb as you practice specialized mock tests.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <TrendingUp className="w-8 h-8" />, label: "Growth Analytics", text: "Visual charts for every subject" },
            { icon: <Award className="w-8 h-8" />, label: "Exam Readiness", text: "Probability of passing real flight exams" },
            { icon: <Target className="w-8 h-8" />, label: "Weakness Identification", text: "Focus areas automatically flagged" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h4 className="font-bold text-xl text-[#0f172a] mb-3">{item.label}</h4>
              <p className="text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
