'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect(appConfig.routes.home)
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect(appConfig.routes.login)
}
