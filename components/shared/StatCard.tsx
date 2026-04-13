import { cn } from '@/lib/utils/cn'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import type { DashboardKpi } from '@/types/content'

interface StatCardProps {
  kpi: DashboardKpi
  icon?: LucideIcon
  iconColor?: string
  className?: string
}

export function StatCard({ kpi, icon: Icon, iconColor, className }: StatCardProps) {
  const trendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
  const TrendIcon = trendIcon
  const trendColor =
    kpi.trend === 'up' ? 'text-status-success-text' :
    kpi.trend === 'down' ? 'text-status-error-text' :
    'text-gray-400'

  return (
    <div className={cn('card-base card-hover p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-medium uppercase tracking-wide text-gray-500">{kpi.label}</p>
          <p className="mt-1.5 text-[26px] font-bold leading-none tracking-tight text-gray-900">
            {kpi.value}
          </p>
          {(kpi.delta !== undefined || kpi.deltaLabel) && (
            <div className={cn('mt-2 flex items-center gap-1 text-[12px] font-medium', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {kpi.delta !== undefined && `${kpi.delta > 0 ? '+' : ''}${kpi.delta}%`}
                {kpi.deltaLabel && ` ${kpi.deltaLabel}`}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${iconColor ?? '#6366f1'}15` }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: iconColor ?? '#6366f1' }} />
          </div>
        )}
      </div>
    </div>
  )
}
