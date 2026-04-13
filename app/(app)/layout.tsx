import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getAvailableOrganizations, getCurrentOrganizationContext } from '@/server/services/organization.service'
import { AppShell } from '@/components/layout/AppShell'
import { OrganizationProvider } from '@/contexts/organization-context'
import { appConfig } from '@/config/app-config'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(appConfig.routes.login)
  }

  // Get selected organization from cookie
  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value

  // Fetch available organizations and current context server-side
  const [availableOrgs, currentOrg] = await Promise.all([
    getAvailableOrganizations(user!),
    getCurrentOrganizationContext(user!, selectedOrgSlug)
  ])

  return (
    <OrganizationProvider 
      initialUser={user!} 
      initialOrgSlug={selectedOrgSlug}
      initialAvailableOrgs={availableOrgs}
      initialCurrentOrg={currentOrg}
    >
      <AppShell user={user!}>{children}</AppShell>
    </OrganizationProvider>
  )
}
