import { cn } from '@/lib/utils/cn'
import type { CampaignStatus } from '@/types/database'

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-slate-100 text-slate-700 border-slate-200' },
  active:    { label: 'Active',    className: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  archived:  { label: 'Archived',  className: 'bg-amber-50 text-amber-700 border-amber-200' },
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={cn(
      'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
      config.className
    )}>
      {config.label}
    </span>
  )
}
