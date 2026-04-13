import { cn } from '@/lib/utils/cn'

interface Column {
  key: string
  label: string
  className?: string
}

interface ContentTableShellProps {
  columns: Column[]
  children: React.ReactNode
  className?: string
  emptyState?: React.ReactNode
  isEmpty?: boolean
}

export function ContentTableShell({
  columns,
  children,
  className,
  emptyState,
  isEmpty,
}: ContentTableShellProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-canvas-border', className)}>
      <table className="w-full table-auto text-[13px]">
        <thead>
          <tr className="border-b border-canvas-border bg-gray-50/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                {emptyState ?? (
                  <p className="text-[13px] text-gray-400">No results found.</p>
                )}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
