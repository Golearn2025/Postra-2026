'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { NavSection } from '@/config/navigation'

interface SidebarSectionProps {
  section: NavSection
  pathname: string
}

export function SidebarSection({ section, pathname }: SidebarSectionProps) {
  return (
    <div className="mb-1">
      {section.title && (
        <p className="mb-1 px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-text-muted">
          {section.title}
        </p>
      )}
      <ul className="space-y-0.5 px-2">
        {section.items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={item.href as any}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-100',
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text-active'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-accent' : 'text-sidebar-text group-hover:text-sidebar-text-active'
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.isNew && (
                  <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    New
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className="rounded-full bg-sidebar-surface px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-text">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
