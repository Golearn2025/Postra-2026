import { cn } from '@/lib/utils/cn'
import { forwardRef, HTMLAttributes } from 'react'

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isUp: boolean
  }
  variant?: 'default' | 'gold' | 'dark'
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, icon, trend, variant = 'default', ...props }, ref) => {
    const baseClasses = 'rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]'
    
    const variantClasses = {
      default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
      gold: 'bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 border border-blue-200 shadow-lg hover:shadow-xl',
      dark: 'bg-[#111113] border border-[#2A2A2E] shadow-xl hover:shadow-2xl',
    }
    
    const textClasses = {
      default: 'text-gray-600',
      gold: 'text-blue-900',
      dark: 'text-gray-400',
    }
    
    const valueClasses = {
      default: 'text-gray-900',
      gold: 'text-blue-900',
      dark: 'text-white',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn('text-sm font-medium mb-2', textClasses[variant])}>
              {title}
            </p>
            <p className={cn('text-3xl font-bold', valueClasses[variant])}>
              {value}
            </p>
            {trend && (
              <div className={cn(
                'flex items-center mt-2 text-sm',
                trend.isUp ? 'text-green-600' : 'text-red-600'
              )}>
                <span className="mr-1">
                  {trend.isUp ? 'up' : 'down'}
                </span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              'p-3 rounded-xl',
              variant === 'gold' ? 'bg-blue-200 text-blue-700' :
              variant === 'dark' ? 'bg-[#2A2A2E] text-amber-400' :
              'bg-gray-100 text-gray-600'
            )}>
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'
