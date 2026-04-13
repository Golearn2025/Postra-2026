'use client'

import { ChevronsUpDown, Building2, Loader2 } from 'lucide-react'
import { useOrganization } from '@/contexts/organization-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function OrganizationSwitcher() {
  const { availableOrgs, currentOrg, isLoading, switchOrganization } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-sidebar-text-muted" />
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-[13px] font-medium text-sidebar-text-active">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentOrg || availableOrgs.length === 0) {
    return (
      <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/20">
          <Building2 className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-[13px] font-medium text-sidebar-text-active">No Organization</p>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-hover">
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentOrg.organization.brand_logo_url || undefined} />
            <AvatarFallback className="bg-accent/20 text-[10px] text-accent">
              {currentOrg.organization.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[13px] font-medium text-sidebar-text-active">
              {currentOrg.organization.name}
            </p>
            <p className="truncate text-[11px] text-sidebar-text-muted">
              {currentOrg.isPlatformOwner ? 'Platform Owner' : currentOrg.member?.role}
            </p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-sidebar-text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableOrgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrganization(org.slug)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={org.logo_url || undefined} />
                <AvatarFallback className="bg-accent/20 text-[10px] text-accent">
                  {org.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{org.name}</p>
                <p className="truncate text-xs text-muted-foreground">
              {org.isPlatformOwner ? 'Platform Owner' : org.role}
            </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
