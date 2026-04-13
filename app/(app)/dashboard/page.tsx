import type { Metadata } from 'next'
import { getCurrentUser } from '@/server/services/auth.service'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { redirect } from 'next/navigation'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  return <DashboardView user={user!} />
}
