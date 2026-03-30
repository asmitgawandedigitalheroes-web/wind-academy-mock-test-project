import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/api/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Auth success:', data.user?.email)
      if (next) {
        // If the next page is login, sign out first to ensure they have to log in manually
        if (next.includes('/login')) {
          await supabase.auth.signOut()
        }
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      }
      return NextResponse.redirect(`${requestUrl.origin}/`)
    } else {
      console.error('Auth callback error:', error.message)
      // If we were going to reset-password, redirect back there with the error
      if (next?.includes('/reset-password')) {
        return NextResponse.redirect(`${requestUrl.origin}/reset-password?error=${encodeURIComponent(error.message)}`)
      }
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }
  
  // If no code is provided, it might be a fragment-based flow (implicit flow)
  // We should redirect to the 'next' URL (if provided) and let the client-side AuthHandler pick it up
  if (next) {
    console.log('No code provided in callback, but next URL exists. Redirecting to:', next)
    // If it's the reset password page, we definitely need a session. 
    // If we reach here without a code, something is wrong with the link.
    if (next.includes('/reset-password')) {
      return NextResponse.redirect(`${requestUrl.origin}/reset-password?error=${encodeURIComponent('Invalid or expired reset link. Please request a new one.')}`)
    }
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // fallback to the login page with an error
  console.error('Auth callback error: No code provided and no next URL')
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`)
}
