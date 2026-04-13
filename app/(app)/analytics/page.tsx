import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { BarChart3 } from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track performance across your social channels." />
      <EmptyState
        icon={BarChart3}
        title="No analytics data yet"
        description="Connect social accounts and publish posts to see analytics."
      />
    </div>
  )
}
