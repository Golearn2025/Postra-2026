'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { updateOnboardingStep3Action } from '@/server/actions/onboarding.actions'
import { PRIMARY_GOAL_OPTIONS } from '../constants/onboarding-options'
import type { PrimaryGoal, OnboardingData } from '@/types/onboarding'

interface OnboardingStep3Props {
  organizationId: string
  selectedValue: PrimaryGoal | null
  onComplete: (data: Partial<OnboardingData>) => void
  onBack: () => void
}

export function OnboardingStep3({
  organizationId,
  selectedValue,
  onComplete,
  onBack
}: OnboardingStep3Props) {
  const [selected, setSelected] = useState<PrimaryGoal | null>(selectedValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = (value: PrimaryGoal) => {
    setSelected(value)
    setError(null)
  }

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select an option')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await updateOnboardingStep3Action(organizationId, {
      primaryGoal: selected
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onComplete({ primaryGoal: selected })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold">What is your main goal right now?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We'll use this to shape your first campaigns and content suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PRIMARY_GOAL_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`
              p-4 cursor-pointer transition-all border-2
              ${selected === option.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }
            `}
            onClick={() => handleSelect(option.value)}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                  ${selected === option.value 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground/30'
                  }
                `}
              >
                {selected === option.value && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selected || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
