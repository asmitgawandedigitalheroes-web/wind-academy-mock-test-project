'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getURL } from '@/utils/url'
import { sendTemplateEmail } from '@/lib/email.service'
import { WelcomeEmail } from '@/lib/emails/templates/WelcomeEmail'
import { PasswordResetEmail } from '@/lib/emails/templates/PasswordResetEmail'

// Removed legacy createMailTransporter in favor of email.service.ts

async function sendWelcomeEmail(name: string, email: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wings-academy-mock-test-project.vercel.app'
  
  await sendTemplateEmail({
    to: email,
    subject: 'Welcome to Wings Academy',
    template: WelcomeEmail,
    props: { name, siteUrl }
  })
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Check user role for redirection
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user.id)
    .single()

  if (profile?.status === 'suspended') {
    await supabase.auth.signOut()
    return redirect(`/login?error=${encodeURIComponent('Your account has been suspended. Please contact support.')}`)
  }

  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'page')
  
  if (profile?.role === 'admin') {
    return redirect('/admin')
  }
  
  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!password || password.length < 8) {
    return redirect(`/signup?error=${encodeURIComponent('Password must be at least 8 characters')}`)
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      },
      emailRedirectTo: `${getURL()}api/auth/callback?next=/login?message=${encodeURIComponent('Email confirmed. Please log in to your account.')}`,
    }
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // Send welcome email (non-blocking — failure won't break signup)
  sendWelcomeEmail(name, email).catch(err =>
    console.error('Welcome email failed:', err.message)
  )

  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'page')
  return redirect('/login?message=Check your email to confirm your account')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'page')
  return redirect('/')
}

export async function resetPasswordForEmail(formData: FormData) {
  const email = formData.get('email') as string

  if (!process.env.RESEND_API_KEY) {
    return redirect(`/forgot-password?error=${encodeURIComponent('Email service is not configured')}`)
  }

  // Use Supabase Admin API to generate recovery link without sending email
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${getURL()}api/auth/callback?next=/reset-password`,
    },
  })

  if (error) {
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  // Build the recovery URL from the returned token properties
  const recoveryUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?token=${data.properties.hashed_token}&type=recovery&redirect_to=${encodeURIComponent(`${getURL()}api/auth/callback?next=/reset-password`)}`

  // Send the recovery email via Resend
  try {
    const result = await sendTemplateEmail({
      to: email,
      subject: 'Reset Your Password - Wings Academy',
      template: PasswordResetEmail,
      props: { recoveryUrl }
    })

    if (!result.success) throw new Error(result.error)
  } catch (emailError: any) {
    console.error('Recovery email send failed:', emailError.message)
    return redirect(`/forgot-password?error=${encodeURIComponent('Failed to send recovery email. Please try again later.')}`)
  }

  return redirect('/forgot-password?message=Password reset link sent to your email')
}

export async function updatePassword(formData: FormData) {
  // Added log to force rebuild cache
  console.log('Update password action triggered')
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  if (!password || password.length < 8) {
    return redirect(`/reset-password?error=${encodeURIComponent('Password must be at least 8 characters')}`)
  }

  if (password !== confirmPassword) {
    return redirect(`/reset-password?error=${encodeURIComponent('Passwords do not match')}`)
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  // Force sign out after password reset so they have to log in with new credentials
  await supabase.auth.signOut()

  return redirect('/login?message=Password updated successfully. Please log in with your new password.')
}
