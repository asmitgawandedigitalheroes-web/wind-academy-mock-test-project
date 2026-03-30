import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email.service'

/**
 * GET /api/test-email?to=youremail@example.com
 * Only works in development or if explicitly allowed
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  const to = request.nextUrl.searchParams.get('to')
  if (!to) {
    return NextResponse.json({ error: 'Missing ?to= query param' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({
      error: 'Resend API key is not configured',
    }, { status: 500 })
  }

  try {
    // Send test email via Resend
    const result = await sendEmail({
      to,
      subject: '✅ Wings Academy — Resend Test Email',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:500px;margin:40px auto;padding:32px;border:1px solid #e2e8f0;border-radius:16px;">
          <h2 style="color:#0f172a;margin:0 0 16px;">Resend is working!</h2>
          <p style="color:#64748b;">This is a test email from your Wings Academy platform using Resend API.</p>
          <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;" />
          <p style="color:#94a3b8;font-size:12px;">
            Provider: <strong>Resend</strong><br/>
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    })

    if (!result.success) throw new Error(result.error)

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to}`,
      id: result.id,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 })
  }
}
