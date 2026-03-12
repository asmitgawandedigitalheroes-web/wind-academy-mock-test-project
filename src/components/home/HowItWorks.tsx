import React from 'react'
import { UserPlus, BookOpenCheck, LineChart } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      title: '1. Register Account',
      description: 'Create a free account and access subject-wise mock tests instantly.'
    },
    {
      icon: <BookOpenCheck className="w-8 h-8 text-primary" />,
      title: '2. Take Mock Tests',
      description: 'Practice timed exams matching EASA, GCAA, and DGCA formats.'
    },
    {
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: '3. Track Performance',
      description: 'Analyze scores, identify weak areas, and improve preparation.'
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your journey to certification success in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 border border-slate-100 rounded-xl hover:shadow-lg transition-shadow bg-slate-50">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
