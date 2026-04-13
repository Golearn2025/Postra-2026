import { cn } from '@/lib/utils/cn'

interface RightRailPanelProps {
  children: React.ReactNode
  className?: string
}

export function RightRailPanel({ children, className }: RightRailPanelProps) {
  return (
    <aside className={cn('w-72 shrink-0 space-y-4', className)}>
      {children}
    </aside>
  )
}
