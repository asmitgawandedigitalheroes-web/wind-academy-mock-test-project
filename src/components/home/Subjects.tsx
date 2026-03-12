import React from 'react'
import { Wind, Box, Zap, Cpu, Settings, Wrench, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Subjects = () => {
  const subjects = [
    { name: 'Aerodynamics', tests: 8, free: true, icon: <Wind className="w-6 h-6 text-primary" /> },
    { name: 'Aircraft Structures', tests: 12, free: true, icon: <Box className="w-6 h-6 text-primary" /> },
    { name: 'Propulsion', tests: 10, free: false, icon: <Zap className="w-6 h-6 text-primary" /> },
    { name: 'Avionics', tests: 15, free: true, icon: <Cpu className="w-6 h-6 text-primary" /> },
    { name: 'Electrical Systems', tests: 9, free: false, icon: <Settings className="w-6 h-6 text-primary" /> },
    { name: 'Maintenance Practices', tests: 14, free: true, icon: <Wrench className="w-6 h-6 text-primary" /> },
  ]

  return (
    <section id="subjects" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f172a] mb-2">Exam Subjects</h2>
            <p className="text-slate-600 max-w-xl text-sm md:text-base">
              Targeted practice questions across all major AME certification modules.
            </p>
          </div>
          <Link href="#subjects" className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
            View All Subjects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-50 text-primary">
                  {subject.icon}
                </div>
                {subject.free && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2.5 py-1 rounded">
                    Free Tests
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1">{subject.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow">
                {subject.tests} Practice tests available.
              </p>
              <button className="w-full py-2.5 rounded text-primary font-bold border border-primary/20 hover:bg-primary/5 transition-colors text-sm">
                Explore Tests
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Subjects
