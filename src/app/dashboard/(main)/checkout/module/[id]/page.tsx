import React from 'react'
import { getModuleTests, notifyAdminOfModulePayment } from '@/app/actions/dashboard'
import {
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  Zap,
  Target,
  BookOpen,
  LockOpen,
  CheckCircle2,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ZIINA_PAYMENT_LINK = 'https://pay.ziina.com/WingsAcademy/fPG_nbmYx'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModuleCheckoutPage({ params }: PageProps) {
  const { id } = await params
  const { module: moduleInfo } = await getModuleTests(id)

  if (!moduleInfo) {
    redirect('/dashboard/modules')
  }

  const price = moduleInfo.price || 49

  const handleNotifyAdmin = async () => {
    'use server'
    await notifyAdminOfModulePayment(id)
    redirect(`/dashboard/modules/${id}?payment=pending`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/dashboard/modules/${id}`}
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
              <h3 className="text-2xl font-black text-[#0f172a]">{moduleInfo.name}</h3>
              <p className="text-slate-500 font-medium text-sm">Gain permanent access to all tests in this module including detailed result explanations.</p>
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

          {/* Step 1 — Pay via Ziina */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm shrink-0">1</div>
              <h3 className="text-xl font-black text-[#0f172a]">Pay via Ziina</h3>
            </div>

            <p className="text-slate-500 font-medium text-sm mb-8">
              Click the button below to complete your payment of <strong className="text-[#0f172a]">AED {price}</strong> securely through Ziina.
              Ziina accepts <strong>Visa, Mastercard, Apple Pay</strong> and <strong>Google Pay</strong>.
            </p>

            <a
              href={ZIINA_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0f172a] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] transition-all hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <span>Pay AED {price} with Ziina</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 font-bold text-[0.65rem] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure payment powered by Ziina · pay.ziina.com
            </div>
          </div>

          {/* Step 2 — Notify Admin after paying */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm shrink-0">2</div>
              <h3 className="text-xl font-black text-[#0f172a]">Notify Us After Payment</h3>
            </div>

            <p className="text-slate-500 font-medium text-sm mb-8">
              Once you've completed payment on Ziina, click below to notify our team. We'll verify your payment and unlock the module for you — usually within a few minutes.
            </p>

            <form action={handleNotifyAdmin}>
              <button
                type="submit"
                className="w-full bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 group"
              >
                <Bell className="w-5 h-5" />
                I've Completed Payment — Notify Admin
              </button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-amber-700">
                  Our team will verify your Ziina payment and manually unlock the module. You'll receive a notification once access is granted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
