import React from 'react'
import { getModuleTests } from '@/app/actions/dashboard'
import { redirect } from 'next/navigation'
import CheckoutClient from '@/components/dashboard/CheckoutClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModuleCheckoutPage({ params }: PageProps) {
  const { id } = await params
  const { module: moduleInfo } = await getModuleTests(id)

  if (!moduleInfo) {
    redirect('/dashboard/modules')
  }

  return (
    <CheckoutClient
      moduleId={id}
      moduleName={moduleInfo.name}
      price={moduleInfo.price || 49}
    />
  )
}
