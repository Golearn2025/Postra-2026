'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean
  message?: string
}

export function useUnsavedChanges({ 
  hasUnsavedChanges, 
  message = "You have unsaved changes. If you continue, your changes will be lost." 
}: UseUnsavedChangesOptions) {
  const router = useRouter()

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault()
      e.returnValue = message
      return message
    }
  }, [hasUnsavedChanges, message])

  // Handle browser refresh/close
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])

  // Handle navigation away from page
  const confirmNavigation = useCallback(() => {
    if (hasUnsavedChanges) {
      return window.confirm(message)
    }
    return true
  }, [hasUnsavedChanges, message])

  // Override router.push to check for unsaved changes
  const safeRouterPush = useCallback((url: string) => {
    if (confirmNavigation()) {
      router.push(url as any)
    }
  }, [confirmNavigation, router])

  return {
    confirmNavigation,
    safeRouterPush
  }
}
