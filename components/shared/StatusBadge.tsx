import { cn } from '@/lib/utils/cn'
import { statusVariantMap, type StatusVariant } from '@/config/design-tokens'

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const variantClasses: Record<StatusVariant, string> = {
  success: 'bg-status-success-bg text-status-success-text',
  warning: 'bg-status-warning-bg text-status-warning-text',
  error: 'bg-status-error-bg text-status-error-text',
  info: 'bg-status-info-bg text-status-info-text',
  muted: 'bg-gray-100 text-gray-500',
  draft: 'bg-gray-100 text-gray-500',
  active: 'bg-status-success-bg text-status-success-text',
  archived: 'bg-gray-100 text-gray-400',
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolved = variant ?? statusVariantMap[status.toLowerCase()] ?? 'muted'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
        variantClasses[resolved],
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
