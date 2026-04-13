import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Activity } from 'lucide-react'

export const metadata: Metadata = { title: 'Publish Logs' }

export default function PublishLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish Logs"
        description="Full audit trail of all publishing events, errors, and delivery confirmations."
      />
      <EmptyState
        icon={Activity}
        title="No publish events yet"
        description="Publishing logs will appear here once posts start going live."
      />
    </div>
  )
}
