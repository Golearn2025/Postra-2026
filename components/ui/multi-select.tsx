'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Select options...",
  className = ""
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  const handleRemove = (option: string) => {
    onChange(selected.filter(item => item !== option))
  }

  const handleClear = () => {
    onChange([])
  }

  // Check if dropdown should open up or down
  const checkDropdownPosition = () => {
    if (!triggerRef.current) return
    
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const dropdownHeight = 256 // max-h-64 = 16rem = 256px
    
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition('top')
    } else {
      setDropdownPosition('bottom')
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      checkDropdownPosition()
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      checkDropdownPosition()
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      {/* Trigger */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between h-9 bg-background hover:bg-background focus:bg-background active:bg-background"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              {selected.slice(0, 3).map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
              {selected.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{selected.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className={`absolute left-0 right-0 z-50 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto ${
            dropdownPosition === 'bottom' 
              ? 'top-full mt-1' 
              : 'bottom-full mb-1'
          }`}>
            {/* Clear button */}
            {selected.length > 0 && (
              <div className="p-2 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-xs h-7"
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Options */}
            <div className="p-2 space-y-1">
              {options.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <div
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-sm cursor-pointer select-none transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm capitalize">{option}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
