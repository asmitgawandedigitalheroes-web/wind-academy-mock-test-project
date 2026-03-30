'use client'
 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
 
/**
 * AuthHandler is a client-side component that listens for Supabase auth fragments
 * (e.g., #access_token=...) in the URL. Since these fragments are not sent to the server,
 * we handle the redirection logic on the client side.
 */
export default function AuthHandler() {
  const router = useRouter()
  const supabase = createClient()
 
  useEffect(() => {
    // Listen for auth state changes which are triggered by Supabase when it detects a session in the URL fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // If Supabase detects a password recovery event from the URL, redirect to the reset password page
        console.log('Password recovery event detected, redirecting to /reset-password')
        router.push('/reset-password')
      }
      
      // Additional logic can be added here for other auth events like SIGNED_IN etc if needed
    })
 
    // Manual check for the fragment on mount as a fallback
    const handleHash = () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        // If it's a recovery flow, redirect to reset-password
        if (hash.includes('type=recovery') || window.location.href.includes('next=%2Freset-password')) {
          console.log('Recovery token detected in URL fragment, redirecting to /reset-password...')
          router.push('/reset-password')
        } else if (window.location.pathname === '/login' && !hash.includes('error')) {
            // If we are on login page with a token, maybe they should be redirected elsewhere?
            // For now, let's focus on recovery.
        }
      }
    }
 
    handleHash()
 
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])
 
  return null // This component doesn't render anything
}
