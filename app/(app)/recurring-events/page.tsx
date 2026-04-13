import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { CalendarClock } from 'lucide-react'

export const metadata: Metadata = { title: 'Recurring Events' }

export default function RecurringEventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recurring Events"
        description="Set up repeating content schedules — weekly posts, monthly digests, and more."
      />
      <EmptyState
        icon={CalendarClock}
        title="No recurring events"
        description="Create a recurring event to automatically schedule content on a repeating basis."
      />
    </div>
  )
}
