import { getSupabaseServerClient } from '@/server/supabase/server'
import { getProfileById } from '@/server/repositories/profiles.repository'
import type { AppUser } from '@/types/app'

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const profile = await getProfileById(supabase, user.id)
  if (!profile) return null

  return {
    profile,
    isPlatformOwner: profile.is_platform_owner ?? false,
  }
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
}
