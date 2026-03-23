import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, parsePaymentMessage, ZIINA_WEBHOOK_IPS } from '@/utils/ziina'

function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  // 1. IP whitelist check
  const forwarded = request.headers.get('x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : null

  // In development, skip IP check
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && clientIp && !ZIINA_WEBHOOK_IPS.includes(clientIp)) {
    console.warn(`Webhook rejected: unauthorized IP ${clientIp}`)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Read raw body for HMAC verification
  const rawBody = await request.text()
  const signature = request.headers.get('x-hmac-signature')

  if (signature && process.env.ZIINA_WEBHOOK_SECRET) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('Webhook rejected: invalid HMAC signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // 3. Parse payload
  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event, data } = payload

  if (event !== 'payment_intent.status.updated') {
    return NextResponse.json({ received: true })
  }

  const paymentIntentId = data?.id
  const status = data?.status
  const message = data?.message || ''

  // Only process completed payments
  if (status !== 'completed') {
    return NextResponse.json({ received: true })
  }

  try {
    const supabase = getServiceClient()

    // 4. Find the pending payment by Ziina payment intent ID
    const { data: payment } = await supabase
      .from('payments')
      .select('id, user_id, module_id, status')
      .eq('transaction_id', paymentIntentId)
      .maybeSingle()

    if (!payment) {
      console.warn(`Webhook: no payment found for intent ${paymentIntentId}`)
      return NextResponse.json({ received: true })
    }

    // Idempotency: already processed
    if (payment.status === 'completed') {
      return NextResponse.json({ received: true })
    }

    // 5. Update payment status to completed
    const { error: updateErr } = await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', payment.id)

    if (updateErr) {
      console.error('Webhook: failed to update payment:', updateErr)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // 6. Get module info from DB
    const moduleId = payment.module_id
    const userId = payment.user_id

    let moduleName = 'your module'
    if (moduleId) {
      const { data: mod } = await supabase
        .from('modules')
        .select('name')
        .eq('id', moduleId)
        .maybeSingle()
      if (mod?.name) moduleName = mod.name
    }

    // 7. Notify the student
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'payment_success',
      title: 'Module Unlocked!',
      message: `Your payment has been confirmed. All tests in "${moduleName}" are now available.`,
    })

    console.log(`Webhook: payment completed for user ${userId}, module ${moduleId}`)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
