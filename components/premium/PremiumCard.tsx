import { cn } from '@/lib/utils/cn'
import { forwardRef, HTMLAttributes } from 'react'

interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gold' | 'dark'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-200'
    
    const variantClasses = {
      default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
      glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl',
      gold: 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-lg hover:shadow-xl',
      dark: 'bg-[#111113] border border-[#2A2A2E] shadow-xl hover:shadow-2xl',
    }
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PremiumCard.displayName = 'PremiumCard'
