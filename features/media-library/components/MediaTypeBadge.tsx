import { cn } from '@/lib/utils/cn'
import type { MediaAssetType, MediaAssetStatus } from '@/types/database'

const TYPE_CONFIG: Record<MediaAssetType, { label: string; className: string }> = {
  image:     { label: 'Image',     className: 'bg-blue-50 text-blue-700 border-blue-200' },
  video:     { label: 'Video',     className: 'bg-purple-50 text-purple-700 border-purple-200' },
  thumbnail: { label: 'Thumbnail', className: 'bg-slate-50 text-slate-700 border-slate-200' },
  logo:      { label: 'Logo',      className: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const STATUS_CONFIG: Record<MediaAssetStatus, { label: string; className: string }> = {
  draft:      { label: 'Draft',      className: 'bg-slate-100 text-slate-600 border-slate-200' },
  ready:      { label: 'Ready',      className: 'bg-green-50 text-green-700 border-green-200' },
  processing: { label: 'Processing', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  failed:     { label: 'Failed',     className: 'bg-red-50 text-red-700 border-red-200' },
  archived:   { label: 'Archived',   className: 'bg-stone-50 text-stone-600 border-stone-200' },
}

export function MediaTypeBadge({ type }: { type: MediaAssetType }) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.image
  return (
    <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium', config.className)}>
      {config.label}
    </span>
  )
}

export function MediaStatusBadge({ status }: { status: MediaAssetStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium', config.className)}>
      {config.label}
    </span>
  )
}
