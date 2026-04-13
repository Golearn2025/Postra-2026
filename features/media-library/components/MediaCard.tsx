import Link from 'next/link'
import { ImageIcon, Video, FileText, ArrowRight, MoreHorizontal, Trash2 } from 'lucide-react'
import { MediaTypeBadge, MediaStatusBadge } from './MediaTypeBadge'
import { formatDate } from '@/lib/formatters/date'
import { formatFileSize } from '@/lib/formatters/file'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppMediaAssetsListItem } from '@/types/views'

interface MediaCardProps {
  asset: AppMediaAssetsListItem & { signedUrl?: string }
  onDelete?: (assetId: string) => void
  isDeleting?: boolean
}

const TYPE_ICON = {
  image:     ImageIcon,
  video:     Video,
  thumbnail: ImageIcon,
  logo:      ImageIcon,
}

export function MediaCard({ asset, onDelete, isDeleting }: MediaCardProps) {
  const Icon = TYPE_ICON[asset.type] ?? FileText
  const displayName = asset.title || asset.original_filename || 'Untitled'

  const handleDelete = () => {
    if (onDelete) {
      onDelete(asset.id)
    }
  }

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:border-accent/50 hover:shadow-md">
      {/* Preview area */}
      <Link
        href={`/media-library/${asset.id}` as any}
        className="relative flex h-36 w-full items-center justify-center bg-muted/40"
      >
        {asset.signedUrl ? (
          asset.type === 'video' ? (
            <video
              src={asset.signedUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.signedUrl}
              alt={asset.alt_text || displayName}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )
        ) : (
          <Icon className="h-10 w-10 text-muted-foreground/30" />
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <MediaTypeBadge type={asset.type} />
        </div>
        <ArrowRight className="absolute top-2 right-2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/media-library/${asset.id}` as any}
            className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors flex-1"
          >
            {displayName}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
          <MediaStatusBadge status={asset.status} />
          {asset.file_size_bytes && (
            <span className="text-[11px] text-muted-foreground">
              {formatFileSize(asset.file_size_bytes)}
            </span>
          )}
        </div>
        {asset.format_group && (
          <span className="text-[11px] text-muted-foreground capitalize">
            {asset.format_group.replace('_', ' ')}
          </span>
        )}
        <span className="text-xs text-muted-foreground">
              {formatDate(asset.updated_at || '')}
            </span>
      </div>
    </div>
  )
}
