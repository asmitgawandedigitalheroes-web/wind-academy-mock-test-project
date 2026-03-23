import React from 'react'
import { checkPaymentStatus } from '@/app/actions/dashboard'
import PaymentSuccessClient from './PaymentSuccessClient'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment_intent_id?: string }>
}

export default async function PaymentSuccessPage({ params, searchParams }: PageProps) {
  const { id: moduleId } = await params
  const { payment_intent_id } = await searchParams

  if (!payment_intent_id) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <p className="text-slate-500 font-medium">No payment reference found.</p>
        <a href={`/dashboard/modules/${moduleId}`} className="text-primary font-bold hover:underline">
          Back to Module
        </a>
      </div>
    )
  }

  const result = await checkPaymentStatus(payment_intent_id)

  return (
    <PaymentSuccessClient
      moduleId={moduleId}
      transactionId={payment_intent_id}
      initialStatus={result.status}
    />
  )
}
