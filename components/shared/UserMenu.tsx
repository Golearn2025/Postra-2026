'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { signOut } from '@/server/actions/auth.actions'
import type { AppUser } from '@/types/app'

interface UserMenuProps {
  user: AppUser
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.profile.full_name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent">
        {initials}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-[13px] font-medium text-sidebar-text-active">
          {user.profile.full_name ?? 'User'}
        </p>
        <p className="truncate text-[11px] text-sidebar-text-muted">{user.profile.email}</p>
      </div>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded p-1 text-sidebar-text-muted transition-colors hover:text-sidebar-text-active"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  )
}
