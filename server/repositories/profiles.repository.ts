import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbProfile } from '@/types/database'

export async function getProfileById(
  supabase: SupabaseClient,
  userId: string
): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as DbProfile
}

export async function getCurrentProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<DbProfile | null> {
  return getProfileById(supabase, userId)
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Pick<DbProfile, 'full_name' | 'avatar_url' | 'metadata'>>
): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) return null
  return data as DbProfile
}
