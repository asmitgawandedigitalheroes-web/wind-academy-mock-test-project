import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FinalCTA = () => {
  return (
    <section className="py-24 bg-[#0f172a] text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to Ace Your Certification?
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of AME students who have accelerated their careers with our specialized mock tests.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#pricing" className="w-full sm:w-auto bg-cyan-400 text-[#0f172a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2">
            Start Practicing Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="w-full sm:w-auto bg-transparent border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
