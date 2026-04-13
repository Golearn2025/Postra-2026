import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <div className={cn('card-base flex flex-col', className)}>
      <div className="flex items-center justify-between border-b border-canvas-border-subtle px-5 py-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Icon className="h-3.5 w-3.5 text-accent" />
            </div>
          )}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-[12px] text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </div>
  )
}
