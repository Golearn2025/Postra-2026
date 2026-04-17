'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { signOut } from '@/server/actions/auth.actions'
import { OrganizationSwitcher } from './OrganizationSwitcher'
import type { AppUser } from '@/types/app'

interface Organization {
  id: string
  name: string
  slug: string
}

interface OnboardingHeaderProps {
  organizationName: string
  organizationId: string
  user: AppUser
  organizations?: Organization[]
}

export function OnboardingHeader({ 
  organizationName, 
  organizationId,
  user, 
  organizations = [] 
}: OnboardingHeaderProps) {
  const userInitials = user.profile.full_name?.[0] || user.profile.email[0]?.toUpperCase()
  const userDisplayName = user.profile.full_name || user.profile.email
  
  const currentOrganization = organizations.find(org => org.id === organizationId) || {
    id: organizationId,
    name: organizationName,
    slug: ''
  }

  return (
    <div className="border-b bg-card/50">
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Organization */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg">Postra</span>
            </div>
            <OrganizationSwitcher
              currentOrganization={currentOrganization}
              organizations={organizations}
              isPlatformOwner={user.isPlatformOwner}
            />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile.avatar_url || undefined} alt={userDisplayName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userDisplayName}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.profile.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
