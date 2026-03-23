'use client'

import React, { useState, useEffect, useRef } from 'react'
import { checkPaymentStatus } from '@/app/actions/dashboard'
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  moduleId: string
  transactionId: string
  initialStatus: string
}

export default function PaymentSuccessClient({ moduleId, transactionId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const pollCount = useRef(0)
  const maxPolls = 10 // 10 * 3s = 30s

  useEffect(() => {
    if (status === 'completed' || status === 'not_found' || status === 'error') return

    const interval = setInterval(async () => {
      pollCount.current += 1
      if (pollCount.current > maxPolls) {
        clearInterval(interval)
        return
      }

      try {
        const result = await checkPaymentStatus(transactionId)
        if (result.status === 'completed') {
          setStatus('completed')
          clearInterval(interval)
        }
      } catch {
        // Keep polling on error
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status, transactionId])

  if (status === 'completed') {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-green-500/10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a]">Module Unlocked!</h1>
          <p className="text-slate-500 font-medium">
            Your payment has been confirmed. All tests in this module are now available.
          </p>
          <Link
            href={`/dashboard/modules/${moduleId}`}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all group"
          >
            Go to Module
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'not_found') {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-6">
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-[#0f172a]">Payment Not Found</h1>
          <p className="text-slate-500 font-medium text-sm">
            We couldn't find a payment with this reference. If you completed the payment, please contact support.
          </p>
          <Link
            href={`/dashboard/modules/${moduleId}`}
            className="text-primary font-bold hover:underline"
          >
            Back to Module
          </Link>
        </div>
      </div>
    )
  }

  // Pending / processing state
  return (
    <div className="max-w-lg mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-black text-[#0f172a]">Processing Payment...</h1>
        <p className="text-slate-500 font-medium text-sm">
          Your payment is being verified. This usually takes just a few seconds.
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
          <Loader2 className="w-3 h-3 animate-spin" />
          Checking payment status...
        </div>
        {pollCount.current >= maxPolls && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-amber-600 font-bold text-xs">
              Verification is taking longer than expected. Your payment will be confirmed shortly.
            </p>
            <Link
              href={`/dashboard/modules/${moduleId}`}
              className="text-primary font-bold text-sm hover:underline"
            >
              Go to Module — you'll be notified when access is granted
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
