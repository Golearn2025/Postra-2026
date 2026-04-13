'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({ placeholder = 'Search…', className, value, onChange }: SearchInputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-8 w-full rounded-lg border border-canvas-border bg-canvas-bg pl-8 pr-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/20"
      />
    </div>
  )
}
