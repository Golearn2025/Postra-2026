import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = { title: 'AI Studio' }

export default function AiStudioPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Studio"
        description="Generate captions, rewrite content, suggest hashtags, and build post variants with AI."
      />
      <EmptyState
        icon={Sparkles}
        title="AI Studio coming soon"
        description="Connect an AI provider to start generating and optimising content at scale."
      />
    </div>
  )
}
