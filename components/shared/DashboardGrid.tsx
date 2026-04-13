import { cn } from '@/lib/utils/cn'

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={cn('grid grid-cols-12 gap-5', className)}>
      {children}
    </div>
  )
}

interface GridCellProps {
  children: React.ReactNode
  span?: 3 | 4 | 6 | 8 | 12
  className?: string
}

const spanClasses: Record<number, string> = {
  3: 'col-span-12 md:col-span-3',
  4: 'col-span-12 md:col-span-4',
  6: 'col-span-12 md:col-span-6',
  8: 'col-span-12 md:col-span-8',
  12: 'col-span-12',
}

export function GridCell({ children, span = 12, className }: GridCellProps) {
  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  )
}
