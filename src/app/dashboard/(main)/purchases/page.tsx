import React from 'react'
import { getUserPurchases } from '@/app/actions/dashboard'
import UserPurchasesClient from '@/components/dashboard/UserPurchasesClient'

export const metadata = {
  title: 'My Purchases | Wings Academy',
  description: 'Track your mock test and module purchases.',
}

export default async function PurchasesPage() {
  const purchases = await getUserPurchases()

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <UserPurchasesClient initialPurchases={purchases} />
    </div>
  )
}
