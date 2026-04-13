'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { mainNavSections } from '@/config/navigation'
import { OrganizationSwitcher } from '@/components/shared/OrganizationSwitcher'
import { UserMenu } from '@/components/shared/UserMenu'
import { SidebarSection } from './SidebarSection'
import type { AppUser } from '@/types/app'

interface SidebarNavProps {
  user: AppUser
}

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[248px] flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar-bg">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
          <span className="text-[11px] font-bold text-white">P</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-text-active">
          Postra
        </span>
      </div>

      {/* Org switcher */}
      <div className="border-b border-sidebar-border px-3 py-2.5">
        <OrganizationSwitcher />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3">
        {mainNavSections.map((section, idx) => (
          <SidebarSection key={idx} section={section} pathname={pathname} />
        ))}
      </nav>

      {/* User menu */}
      <div className="border-t border-sidebar-border p-3">
        <UserMenu user={user} />
      </div>
    </aside>
  )
}
