import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface QuickAction {
  label: string
  description?: string
  href: string
  icon: LucideIcon
  color?: string
}

interface QuickActionGridProps {
  actions: QuickAction[]
  className?: string
}

export function QuickActionGrid({ actions, className }: QuickActionGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={action.href as any}
            className="group flex items-center gap-3 rounded-xl border border-canvas-border bg-white p-3.5 transition-all hover:border-accent/30 hover:shadow-card-md"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${action.color ?? '#6366f1'}12` }}
            >
              <Icon className="h-4.5 w-4.5" style={{ color: action.color ?? '#6366f1' }} />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-[13px] font-semibold text-gray-800">{action.label}</p>
              {action.description && (
                <p className="truncate text-[11px] text-gray-400">{action.description}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
