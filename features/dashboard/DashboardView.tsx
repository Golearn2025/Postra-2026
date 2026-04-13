'use client'

import {
  BarChart3, FileText, Megaphone, CalendarDays,
  Upload, ImageIcon, Globe, Zap, Building,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { SectionCard } from '@/components/shared/SectionCard'
import { ActivityList } from '@/components/shared/ActivityList'
import { PlatformStatusList } from '@/components/shared/PlatformStatusList'
import { QuickActionGrid } from '@/components/shared/QuickActionGrid'
import { DashboardGrid, GridCell } from '@/components/shared/DashboardGrid'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_KPIS, MOCK_ACTIVITY, MOCK_PLATFORMS } from './dashboard.data'
import { useOrganization } from '@/contexts/organization-context'
import type { AppUser } from '@/types/app'

const QUICK_ACTIONS = [
  { label: 'New Post', description: 'Draft content', href: '/posts', icon: FileText, color: '#6366f1' },
  { label: 'New Campaign', description: 'Group posts', href: '/campaigns', icon: Megaphone, color: '#8b5cf6' },
  { label: 'Bulk Import', description: 'Upload CSV/JSON', href: '/bulk-import', icon: Upload, color: '#f59e0b' },
  { label: 'Media Library', description: 'Manage assets', href: '/media-library', icon: ImageIcon, color: '#10b981' },
  { label: 'Calendar', description: 'Schedule view', href: '/calendar', icon: CalendarDays, color: '#3b82f6' },
  { label: 'Social Accounts', description: 'Manage platforms', href: '/social-accounts', icon: Globe, color: '#ec4899' },
]

const KPI_ICONS = [BarChart3, CalendarDays, Megaphone, Zap]
const KPI_COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#10b981']

interface DashboardViewProps {
  user: AppUser
}

export function DashboardView({ user }: DashboardViewProps) {
  const { currentOrg, isLoading, error } = useOrganization()
  
  const firstName = user.profile.full_name?.split(' ')[0] ?? 'there'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Good morning, ${firstName} 👋`}
          description="Loading your organization..."
        />
      </div>
    )
  }

  if (error || !currentOrg) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Good morning, ${firstName} 👋`}
          description="No organization available"
        />
        <EmptyState
          icon={Building}
          title="No Organization Found"
          description="You don't have access to any organizations. Contact your administrator to get access."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${firstName} 👋`}
        description={`Here's what's happening across ${currentOrg.organization.name} today.`}
      />

      {/* KPI Row */}
      <DashboardGrid>
        {MOCK_KPIS.map((kpi, i) => (
          <GridCell key={kpi.label} span={3}>
            <StatCard kpi={kpi} icon={KPI_ICONS[i]} iconColor={KPI_COLORS[i]} />
          </GridCell>
        ))}
      </DashboardGrid>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" icon={Zap}>
        <QuickActionGrid actions={QUICK_ACTIONS} />
      </SectionCard>

      {/* Activity + Platform Status */}
      <DashboardGrid>
        <GridCell span={8}>
          <SectionCard
            title="Recent Activity"
            description="Latest actions across your workspace"
            icon={BarChart3}
          >
            <ActivityList items={MOCK_ACTIVITY} />
          </SectionCard>
        </GridCell>
        <GridCell span={4}>
          <SectionCard
            title="Connected Platforms"
            description="Social account status"
            icon={Globe}
          >
            <PlatformStatusList items={MOCK_PLATFORMS} />
          </SectionCard>
        </GridCell>
      </DashboardGrid>
    </div>
  )
}
