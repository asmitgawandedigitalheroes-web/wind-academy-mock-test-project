import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = await createClient()
  
  // Sign out from Supabase
  await supabase.auth.signOut()

  // Revalidate paths affected by auth state
  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/', 'page')

  // Redirect to home page
  return redirect('/')
}
