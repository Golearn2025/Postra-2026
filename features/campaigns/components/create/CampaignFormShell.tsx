'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/campaigns')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-canvas/30">
      {/* Premium Form Content - NO HEADER HERE */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
