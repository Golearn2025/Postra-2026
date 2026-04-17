'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cookies } from 'next/headers'

interface Organization {
  id: string
  name: string
  slug: string
}

interface OrganizationSwitcherProps {
  currentOrganization: Organization
  organizations: Organization[]
  isPlatformOwner: boolean
}

export function OrganizationSwitcher({
  currentOrganization,
  organizations,
  isPlatformOwner
}: OrganizationSwitcherProps) {
  const router = useRouter()
  const [isSwitching, setIsSwitching] = useState(false)

  // Only show switcher if platform owner and has multiple organizations
  if (!isPlatformOwner || organizations.length <= 1) {
    return (
      <div className="text-sm text-muted-foreground">
        {currentOrganization.name}
      </div>
    )
  }

  const handleSwitch = async (org: Organization) => {
    if (org.id === currentOrganization.id) return

    setIsSwitching(true)
    
    try {
      // Set the selected organization cookie
      document.cookie = `selected-org=${org.slug}; path=/; max-age=31536000` // 1 year
      
      // Fetch organization context to check onboarding status
      const response = await fetch(`/api/organizations/context?slug=${org.slug}`)
      if (!response.ok) throw new Error('Failed to load organization')
      
      const orgContext = await response.json()
      const needsOnboarding = !orgContext.onboarding?.isOnboardingCompleted
      
      // Navigate based on onboarding status
      if (needsOnboarding) {
        // Stay in onboarding for incomplete organizations
        window.location.href = '/onboarding'
      } else {
        // Navigate to app shell for complete organizations
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Failed to switch organization:', error)
      setIsSwitching(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
          disabled={isSwitching}
        >
          <Building2 className="h-4 w-4 mr-2" />
          {currentOrganization.name}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Switch Organization</p>
        </div>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            className="cursor-pointer"
            onClick={() => handleSwitch(org)}
            disabled={org.id === currentOrganization.id || isSwitching}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span className={org.id === currentOrganization.id ? 'font-medium' : ''}>
              {org.name}
            </span>
            {org.id === currentOrganization.id && (
              <span className="ml-auto text-xs text-muted-foreground">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
