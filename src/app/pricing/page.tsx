import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PricingComponent from '@/components/home/Pricing'

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Invest in your aviation career with our premium mock test packages designed for maximum success.
            </p>
          </div>
          
          {/* Reuse the existing Pricing component */}
          <PricingComponent />
        </div>
      </main>
      <Footer />
    </>
  )
}
