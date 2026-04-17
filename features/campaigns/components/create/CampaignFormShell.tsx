'use client'

import { ReactNode } from 'react'

interface CampaignFormShellProps {
  organizationName: string
  children: ReactNode
  onCancel?: () => void
}

export function CampaignFormShell({ 
  organizationName, 
  children, 
  onCancel 
}: CampaignFormShellProps) {
  return (
    <div className="h-[calc(100vh-56px)] bg-canvas-bg overflow-hidden">
      {children}
    </div>
  )
}
