import React from 'react'
import { Check, ShieldCheck, Zap, BookOpen } from 'lucide-react'
import Link from 'next/link'

const modules = [
  { id: 'm1', name: 'Module 1 - Mathematics (B1&B2)' },
  { id: 'm2', name: 'Module 2 - Physics (B1&B2)' },
  { id: 'm3', name: 'Module 3 – Electrical Fundamentals (B1&B2)' },
  { id: 'm4', name: 'Module 4 – Electronic Fundamentals (B1&B2)' },
  { id: 'm5', name: 'Module 5 – Digital Techniques, Electronic Instrument System (B1&B2)' },
  { id: 'm6', name: 'Module 6 – Materials and Hardware (B1&B2)' },
  { id: 'm7m', name: 'Module 7 – Maintenance Practices (B1&B2) (MCQ)' },
  { id: 'm7e', name: 'Module 7 – Maintenance Practices (B1&B2) (Essay)' },
  { id: 'm8', name: 'Module 8 – Basic Aerodynamics (B1&B2)' },
  { id: 'm9', name: 'Module 9 – Human Factors (B1&B2)' },
  { id: 'm10', name: 'Module 10 – Aviation Legislation (B1&B2)' },
  { id: 'm11', name: 'Module 11 – Aeroplane Aerodynamics Structure and system(B1)' },
  { id: 'm13', name: 'Module 13 – Aircraft Aerodynamics Structure and system(B2)' },
  { id: 'm14', name: 'Module 14 – Propulsion(B2)' },
  { id: 'm15', name: 'Module 15 – Gas Turbine Engine (B1)' },
  { id: 'm17', name: 'Module 17 – Propeller (B1)' },
]

const Pricing = ({ showHeading = true, user = null }: { showHeading?: boolean, user?: any }) => {
  const ctaLink = user ? '/dashboard/modules' : '/signup'
  const ctaText = user ? 'Access Modules' : 'Buy Now'

  return (
    <section id="pricing" className={`${showHeading ? 'py-24' : 'py-12'} bg-slate-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">
              Flexible <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Purchase modules individually as per your study schedule. Each module gives you full access to its mock tests.
            </p>
          </div>
        )}

        {/* Highlight Section */}
        <div className="bg-white rounded-3xl p-8 mb-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">AED 49 per module</h3>
              <p className="text-slate-500">Each purchase unlocks 3 professional mock tests</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">Free Trial Access</h3>
              <p className="text-slate-500">Take free tests once you register</p>
            </div>
          </div>
          <Link href={ctaLink}>
            <button className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 whitespace-nowrap">
              {user ? 'Go to Dashboard' : 'Register for Free'}
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <div 
              key={module.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-primary">AED 49</span>
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] leading-snug mb-2 group-hover:text-primary transition-colors">
                  {module.name}
                </h3>
              </div>
              
              <div className="mt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>3 Professional Mock Tests</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Lifetime Access</span>
                  </li>
                </ul>
                
                <Link href={ctaLink}>
                  <button className="w-full py-3 rounded-lg border-2 border-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm group-hover:border-primary">
                    {ctaText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-slate-500 text-sm">
          <p>Need custom packages? <Link href="/contact" className="text-primary font-bold hover:underline">Contact us</Link> for bulk discounts.</p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
