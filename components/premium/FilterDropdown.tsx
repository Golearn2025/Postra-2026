'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  variant?: 'default' | 'dark'
  className?: string
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  variant = 'default',
  className
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const clearAll = () => {
    onSelectionChange([])
    setIsOpen(false)
  }

  const selectedCount = selectedValues.length

  const buttonClasses = cn(
    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
    variant === 'dark' 
      ? 'bg-[#111113] border-[#2A2A2E] text-gray-300 hover:bg-[#1A1A1D] hover:border-amber-500/50'
      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    selectedCount > 0 && (variant === 'dark' 
      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
      : 'border-blue-200 bg-blue-50 text-blue-700'
    ),
    className
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={buttonClasses}>
          <Filter className="h-4 w-4" />
          <span>{label}</span>
          {selectedCount > 0 && (
            <Badge variant={variant === 'dark' ? 'secondary' : 'default'} className="ml-1">
              {selectedCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className={cn(
          'w-64 rounded-xl border shadow-xl',
          variant === 'dark' && 'bg-[#111113] border-[#2A2A2E] text-gray-300'
        )}
        align="start"
      >
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="text-sm font-medium">
            {label}
          </DropdownMenuLabel>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className={cn(
                'h-6 px-2 text-xs',
                variant === 'dark' && 'hover:bg-[#2A2A2E] text-gray-400'
              )}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator className={variant === 'dark' ? 'bg-[#2A2A2E]' : ''} />
        
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value)
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex items-center justify-between cursor-pointer',
                variant === 'dark' && 'hover:bg-[#2A2A2E] focus:bg-[#2A2A2E]',
                isSelected && (variant === 'dark' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-blue-50 text-blue-700'
                )
              )}
            >
              <span className="text-sm">{option.label}</span>
              {option.count !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {option.count}
                </Badge>
              )}
            </DropdownMenuItem>
          )
        })}
        
        {options.length === 0 && (
          <div className="p-3 text-center text-sm text-gray-500">
            No options available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
