'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { PLATFORM_OPTIONS } from '../constants/onboarding-options'
import type { Platform } from '@/types/onboarding'

interface OnboardingStep5Props {
  organizationId: string
  selectedValues: Platform[]
  onComplete: (data: { platforms: Platform[] }) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
}

export function OnboardingStep5({
  organizationId,
  selectedValues,
  onComplete,
  onBack,
  isSubmitting
}: OnboardingStep5Props) {
  const [selected, setSelected] = useState<Platform[]>(selectedValues)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (value: Platform) => {
    setSelected(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value)
      }
      return [...prev, value]
    })
    setError(null)
  }

  const handleFinish = async () => {
    if (selected.length === 0) {
      setError('Please select at least one platform')
      return
    }

    await onComplete({ platforms: selected })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold">Where do you want to publish most often?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the platforms you plan to use most. We'll use this when preparing your content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PLATFORM_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value)
          
          return (
            <Card
              key={option.value}
              className={`
                p-4 cursor-pointer transition-all border-2
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }
              `}
              onClick={() => handleToggle(option.value)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                    ${isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30'
                    }
                  `}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">{selected.length} platform{selected.length > 1 ? 's' : ''} selected:</span>{' '}
            {PLATFORM_OPTIONS
              .filter(opt => selected.includes(opt.value))
              .map(opt => opt.label)
              .join(', ')}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleFinish}
          disabled={selected.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Completing...' : 'Complete Setup'}
        </Button>
      </div>
    </div>
  )
}
