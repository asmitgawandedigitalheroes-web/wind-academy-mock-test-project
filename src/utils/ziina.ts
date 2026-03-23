import crypto from 'crypto'

const ZIINA_API_BASE = 'https://api-v2.ziina.com/api'

function getApiKey(): string {
  const key = process.env.ZIINA_API_KEY
  if (!key) throw new Error('ZIINA_API_KEY environment variable is not set')
  return key
}

function isTestMode(): boolean {
  return process.env.ZIINA_TEST_MODE === 'true'
}

export async function createPaymentIntent({
  amount,
  moduleId,
  userId,
  moduleName,
}: {
  amount: number
  moduleId: string
  userId: string
  moduleName: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const amountInFils = Math.round(amount * 100)

  const res = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInFils,
      currency_code: 'AED',
      message: `Wings Academy`,
      success_url: `${siteUrl}/dashboard/checkout/module/${moduleId}/success?payment_intent_id={PAYMENT_INTENT_ID}`,
      cancel_url: `${siteUrl}/dashboard/checkout/module/${moduleId}`,
      test: isTestMode(),
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Ziina API error (${res.status}): ${errBody}`)
  }

  const data = await res.json()
  return {
    id: data.id as string,
    redirectUrl: data.redirect_url as string,
    status: data.status as string,
  }
}

export async function getPaymentIntent(id: string) {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
    },
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`Ziina API error (${res.status}): ${errBody}`)
  }

  return await res.json()
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.ZIINA_WEBHOOK_SECRET
  if (!secret) return false

  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(signature, 'hex')
    )
  } catch {
    return false
  }
}

export function parsePaymentMessage(message: string): { moduleId: string; userId: string; moduleName: string } | null {
  const match = message.match(/^module:([^|]+)\|user:([^|]+)\|(.+)$/)
  if (!match) return null
  return {
    moduleId: match[1],
    userId: match[2],
    moduleName: match[3],
  }
}

// Allowed Ziina webhook source IPs
export const ZIINA_WEBHOOK_IPS = [
  '3.29.184.186',
  '3.29.190.95',
  '20.233.47.127',
  '13.202.161.181',
]
