import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { appConfig } from '@/config/app-config'
import { MediaUploadForm } from '@/features/media-library/forms/MediaUploadForm'

export const metadata: Metadata = { title: 'Upload Media' }

export default async function UploadMediaPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) redirect('/media-library' as any)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={'/media-library' as any}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Media Library
        </Link>
      </div>

      <PageHeader
        title="Upload Media"
        description={`Add images or videos to ${orgContext!.organization.name}.`}
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <MediaUploadForm organizationId={orgContext!.organization.id} />
      </div>
    </div>
  )
}
