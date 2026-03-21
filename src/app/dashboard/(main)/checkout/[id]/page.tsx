import { getTestData } from '@/app/actions/dashboard'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

// Per-test checkout is no longer used.
// All purchases are module-level — redirect to the module checkout page.
export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params
  const rawTest = await getTestData(id)

  if (!rawTest) {
    redirect('/dashboard/modules')
  }

  const test = rawTest as any
  redirect(`/dashboard/checkout/module/${test.module_id}`)
}
