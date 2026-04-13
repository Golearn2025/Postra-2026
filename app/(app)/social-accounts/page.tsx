import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Share2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Social Accounts' }

export default function SocialAccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Accounts"
        description="Connect and manage your social media accounts across all platforms."
      />
      <EmptyState
        icon={Share2}
        title="No accounts connected"
        description="Connect Instagram, Facebook, LinkedIn, TikTok, and more to start publishing."
      />
    </div>
  )
}
