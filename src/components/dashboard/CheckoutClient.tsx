'use client'

import React, { useState } from 'react'
import { createZiinaCheckout } from '@/app/actions/dashboard'
import {
  ShieldCheck,
  ArrowLeft,
  Zap,
  Target,
  BookOpen,
  LockOpen,
  Loader2,
  AlertCircle,
  CreditCard,
} from 'lucide-react'
import Link from 'next/link'

interface CheckoutClientProps {
  moduleId: string
  moduleName: string
  price: number
}

export default function CheckoutClient({ moduleId, moduleName, price }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')

    try {
      const result = await createZiinaCheckout(moduleId)

      if (result.error === 'already_purchased') {
        window.location.href = `/dashboard/modules/${moduleId}`
        return
      }

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      if (result.redirect_url) {
        window.location.href = result.redirect_url
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/dashboard/modules/${moduleId}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel & Return
        </Link>
        <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">Unlock Full Module</h1>
        <p className="text-slate-500 font-medium">Pay securely via Ziina to unlock all tests in this module.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Summary Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <LockOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#0f172a]">{moduleName}</h3>
              <p className="text-slate-500 font-medium text-sm">
                Gain permanent access to all tests in this module including detailed result explanations.
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Zap className="w-4 h-4 text-amber-500" />
                Complete Module Access
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Target className="w-4 h-4 text-green-500" />
                Unlimited attempts for all tests
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Full performance analytics
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-black uppercase tracking-widest text-[0.65rem]">Total Amount</span>
                <span className="text-3xl font-black text-[#0f172a]">AED {price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a]">Secure Payment</h3>
                <p className="text-slate-400 text-xs font-bold">Visa, Mastercard, Apple Pay, Google Pay</p>
              </div>
            </div>

            <p className="text-slate-500 font-medium text-sm mb-8">
              Click below to pay <strong className="text-[#0f172a]">AED {price}</strong> securely through Ziina.
              Your module will be <strong className="text-[#0f172a]">unlocked instantly</strong> after payment.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#0f172a] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] transition-all hover:shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Payment Session...</span>
                </>
              ) : (
                <>
                  <span>Unlock Module — Pay AED {price}</span>
                  <LockOpen className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 font-bold text-[0.65rem] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure payment powered by Ziina
            </div>
          </div>

          {/* Info card */}
          <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-green-800 mb-1">Instant Access</p>
                <p className="text-xs font-medium text-green-700">
                  Your module will be unlocked automatically after payment. No waiting, no manual verification needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
