import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowLeft, ImageIcon, Video, Ruler, Clock, HardDrive, Tag } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { MediaTypeBadge, MediaStatusBadge } from '@/features/media-library/components/MediaTypeBadge'
import { EditMediaAssetForm } from '@/features/media-library/forms/EditMediaAssetForm'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getMediaAssetDetailById } from '@/server/repositories/media-assets.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'
import { formatDate } from '@/lib/formatters/date'
import { formatFileSize } from '@/lib/formatters/file'

export const metadata: Metadata = { title: 'Media Asset' }

interface MediaDetailPageProps {
  params: Promise<{ mediaId: string }>
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) redirect('/media-library')

  const { mediaId } = await params
  const supabase = await getSupabaseServerClient()
  const asset = await getMediaAssetDetailById(supabase, mediaId, orgContext!.organization.id)
  if (!asset) notFound()

  const displayName = asset.title || asset.original_filename || 'Untitled'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/media-library"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Media Library
        </Link>
      </div>

      <PageHeader
        title={displayName}
        description={`Updated ${formatDate(asset.updated_at || '')}`}
        actions={
          <div className="flex gap-1.5">
            <MediaTypeBadge type={asset.type} />
            <MediaStatusBadge status={asset.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="flex h-56 items-center justify-center bg-muted/40">
              {asset.signedUrl ? (
                asset.type === 'video' ? (
                  <video
                    src={asset.signedUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.signedUrl}
                    alt={asset.alt_text || displayName}
                    className="h-full w-full object-contain"
                    decoding="async"
                    loading="lazy"
                  />
                )
              ) : (
                asset.type === 'video'
                  ? <Video className="h-12 w-12 text-muted-foreground/30" />
                  : <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>

            {/* File info */}
            <div className="divide-y divide-border p-4 space-y-0">
              {asset.original_filename && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Filename</span>
                  <span className="font-medium truncate max-w-[140px]">{asset.original_filename}</span>
                </div>
              )}
              {asset.mime_type && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">{asset.mime_type}</span>
                </div>
              )}
              {asset.file_size_bytes && (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><HardDrive className="h-3.5 w-3.5" />Size</span>
                  <span className="font-medium">{formatFileSize(asset.file_size_bytes)}</span>
                </div>
              )}
              {asset.width && asset.height && (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Ruler className="h-3.5 w-3.5" />Dimensions</span>
                  <span className="font-medium">{asset.width} × {asset.height}</span>
                </div>
              )}
              {asset.duration_seconds && (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" />Duration</span>
                  <span className="font-medium">{asset.duration_seconds}s</span>
                </div>
              )}
              {asset.aspect_ratio && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Aspect Ratio</span>
                  <span className="font-medium">{asset.aspect_ratio}</span>
                </div>
              )}
              {asset.format_group && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Format Group</span>
                  <span className="font-medium capitalize">{asset.format_group.replace('_', ' ')}</span>
                </div>
              )}
              {asset.tags?.length > 0 && (
                <div className="flex items-start justify-between gap-2 py-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Tag className="h-3.5 w-3.5" />Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {asset.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata edit */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-foreground">Edit Metadata</h2>
          <EditMediaAssetForm asset={asset} organizationId={orgContext!.organization.id} />
        </div>
      </div>
    </div>
  )
}
