'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T
  header: string | (() => React.ReactNode)
  width?: string
  className?: string
  headerClassName?: string
  render?: (value: any, item: T, index: number) => React.ReactNode
}

interface Action<T> {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (item: T, index: number) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  disabled?: (item: T) => boolean
}

interface PremiumTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  className?: string
  emptyMessage?: string
  showZebraStriping?: boolean
  hoverEffect?: boolean
  compact?: boolean
}

export function PremiumTable<T>({
  data,
  columns,
  actions,
  className,
  emptyMessage = 'No data available',
  showZebraStriping = true,
  hoverEffect = true,
  compact = false
}: PremiumTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  if (data.length === 0) {
    return (
      <div className={cn(
        "rounded-lg border bg-card shadow-sm",
        className
      )}>
        <div className="p-12 text-center">
          <div className="text-muted-foreground text-sm">{emptyMessage}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-lg border bg-card shadow-sm overflow-hidden",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-accent/5 to-accent/10 border-b">
              {columns.map((column, index) => (
                <th
                  key={column.key as string}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
                    column.headerClassName,
                    column.width && `w-[${column.width}]`
                  )}
                >
                  {typeof column.header === 'function' ? column.header() : column.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const isExpanded = expandedRows.has(index)
              const isZebra = showZebraStriping && index % 2 === 1
              
              return (
                <tr
                  key={index}
                  className={cn(
                    "border-b transition-all duration-200",
                    isZebra && "bg-canvas",
                    hoverEffect && "hover:bg-accent/10",
                    compact ? "py-2" : "py-3"
                  )}
                >
                  {columns.map((column) => {
                    const value = item[column.key]
                    const content = column.render ? column.render(value, item, index) : (value as ReactNode)
                    
                    return (
                      <td
                        key={column.key as string}
                        className={cn(
                          "px-4",
                          compact ? "py-2" : "py-3",
                          column.className
                        )}
                      >
                        {content}
                      </td>
                    )
                  })}
                  {actions && (
                    <td className={cn(
                      "px-4 text-right",
                      compact ? "py-2" : "py-3"
                    )}>
                      <div className="flex items-center justify-end gap-1">
                        {actions.slice(0, 2).map((action, actionIndex) => {
                          const Icon = action.icon
                          const isDisabled = action.disabled?.(item)
                          
                          return (
                            <Button
                              key={actionIndex}
                              size={compact ? "sm" : "default"}
                              variant={action.variant || "ghost"}
                              onClick={() => action.onClick(item, index)}
                              disabled={isDisabled}
                              className={cn(
                                "h-8 w-8 p-0",
                                action.variant === "destructive" && "hover:bg-red-100 dark:hover:bg-red-900/20"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          )
                        })}
                        {actions.length > 2 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleRow(index)}
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isExpanded && actions.length > 2 && (
                        <div className="absolute right-4 mt-2 bg-white dark:bg-slate-800 border rounded-lg shadow-lg p-1 z-10">
                          {actions.slice(2).map((action, actionIndex) => {
                            const Icon = action.icon
                            const isDisabled = action.disabled?.(item)
                            
                            return (
                              <Button
                                key={actionIndex}
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  action.onClick(item, index)
                                  toggleRow(index)
                                }}
                                disabled={isDisabled}
                                className="w-full justify-start h-8 px-2"
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Premium table with enhanced features
export function EnhancedPremiumTable<T>({
  data,
  columns,
  actions,
  className,
  emptyMessage,
  showZebraStriping = true,
  hoverEffect = true,
  compact = false,
  showHeader = true,
  rounded = true
}: PremiumTableProps<T> & {
  showHeader?: boolean
  rounded?: boolean
}) {
  if (!showHeader) {
    return (
      <div className={cn(
        "overflow-hidden",
        rounded && "rounded-lg border bg-card shadow-sm",
        className
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {data.map((item, index) => {
                const isZebra = showZebraStriping && index % 2 === 1
                
                return (
                  <tr
                    key={index}
                    className={cn(
                      "border-b transition-all duration-200",
                      isZebra && "bg-canvas",
                      hoverEffect && "hover:bg-accent/10",
                      compact ? "py-2" : "py-3"
                    )}
                  >
                    {columns.map((column) => {
                      const value = item[column.key]
                      const content = column.render ? column.render(value, item, index) : (value as ReactNode)
                      
                      return (
                        <td
                          key={column.key as string}
                          className={cn(
                            "px-4",
                            compact ? "py-2" : "py-3",
                            column.className
                          )}
                        >
                          {content}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <PremiumTable
      data={data}
      columns={columns}
      actions={actions}
      className={className}
      emptyMessage={emptyMessage}
      showZebraStriping={showZebraStriping}
      hoverEffect={hoverEffect}
      compact={compact}
    />
  )
}
