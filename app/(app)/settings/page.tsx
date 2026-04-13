import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Settings } from 'lucide-react'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your organization and account settings." />
      <EmptyState
        icon={Settings}
        title="Settings"
        description="Organization, billing, and integrations settings coming soon."
      />
    </div>
  )
}
