'use client'

import { Bell, Plus } from 'lucide-react'
import { SearchInput } from '@/components/shared/SearchInput'
import type { AppUser } from '@/types/app'

interface TopBarProps {
  user: AppUser
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-canvas-border bg-white px-6">
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Search posts, campaigns, media…" className="w-72" />
      </div>

      <div className="flex items-center gap-2">
        {/* Quick create */}
        <button className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover">
          <Plus className="h-3.5 w-3.5" />
          <span>Create</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-[12px] font-semibold text-accent">
          {user.profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  )
}
