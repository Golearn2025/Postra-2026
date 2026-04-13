'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AppUser } from '@/types/app'
import type { OrganizationSwitcherItem, OrgContext } from '@/types/organizations'

interface OrganizationContextValue {
  availableOrgs: OrganizationSwitcherItem[]
  currentOrg: OrgContext | null
  isLoading: boolean
  error: string | null
  switchOrganization: (slug: string) => Promise<void>
  refreshOrganizations: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined)

export function OrganizationProvider({
  children,
  initialUser,
  initialOrgSlug,
  initialAvailableOrgs,
  initialCurrentOrg,
}: {
  children: React.ReactNode
  initialUser: AppUser
  initialOrgSlug?: string
  initialAvailableOrgs?: OrganizationSwitcherItem[]
  initialCurrentOrg?: OrgContext | null
}) {
  const router = useRouter()
  const [availableOrgs, setAvailableOrgs] = useState<OrganizationSwitcherItem[]>(initialAvailableOrgs || [])
  const [currentOrg, setCurrentOrg] = useState<OrgContext | null>(initialCurrentOrg || null)
  const [isLoading, setIsLoading] = useState(!initialAvailableOrgs || !initialCurrentOrg)
  const [error, setError] = useState<string | null>(null)

  const loadOrganizations = async () => {
    // Only fetch client-side if no initial data (fallback for edge cases)
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/organizations/available')
      if (!response.ok) throw new Error('Failed to load organizations')
      
      const orgs = await response.json()
      setAvailableOrgs(orgs)

      // Load current organization context
      const selectedSlug = initialOrgSlug || (orgs.length > 0 ? orgs[0].slug : undefined)
      if (selectedSlug) {
        const orgResponse = await fetch(`/api/organizations/context?slug=${selectedSlug}`)
        if (orgResponse.ok) {
          const orgContext = await orgResponse.json()
          setCurrentOrg(orgContext)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations')
    } finally {
      setIsLoading(false)
    }
  }

  const switchOrganization = async (slug: string) => {
    if (!availableOrgs.find(org => org.slug === slug)) return

    try {
      setError(null)
      
      // Store the selection in a cookie
      document.cookie = `selected-org=${slug}; path=/; max-age=31536000; SameSite=Lax`
      
      // Optimistic update - find the org in availableOrgs and update immediately
      const targetOrg = availableOrgs.find(org => org.slug === slug)
      if (targetOrg && currentOrg?.organization.id !== targetOrg.id) {
        // Load new organization context WITHOUT refetching available organizations
        const response = await fetch(`/api/organizations/context?slug=${slug}`)
        if (!response.ok) throw new Error('Failed to load organization')
        
        const orgContext = await response.json()
        setCurrentOrg(orgContext)
      }
      
      // Minimal server-side revalidation - only for org-scoped data
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch organization')
    }
  }

  const refreshOrganizations = async () => {
    await loadOrganizations()
  }

  useEffect(() => {
    if (initialUser && (!initialAvailableOrgs || !initialCurrentOrg)) {
      loadOrganizations()
    }
  }, [initialUser, initialAvailableOrgs, initialCurrentOrg])

  const value: OrganizationContextValue = {
    availableOrgs,
    currentOrg,
    isLoading,
    error,
    switchOrganization,
    refreshOrganizations,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}
