'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { updateOnboardingStep2Action } from '@/server/actions/onboarding.actions'
import { TARGET_AUDIENCE_OPTIONS } from '../constants/onboarding-options'
import type { TargetAudience, OnboardingData } from '@/types/onboarding'

interface OnboardingStep2Props {
  organizationId: string
  selectedValue: TargetAudience | null
  selectedOtherText: string | null
  onComplete: (data: Partial<OnboardingData>) => void
  onBack: () => void
}

export function OnboardingStep2({
  organizationId,
  selectedValue,
  selectedOtherText,
  onComplete,
  onBack
}: OnboardingStep2Props) {
  const [selected, setSelected] = useState<TargetAudience | null>(selectedValue)
  const [targetAudienceOtherText, setTargetAudienceOtherText] = useState(selectedOtherText || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = (value: TargetAudience) => {
    setSelected(value)
    setError(null)
    // Clear other text when switching away from "other"
    if (value !== 'other') {
      setTargetAudienceOtherText('')
    }
  }

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select an option')
      return
    }

    if (selected === 'other' && (!targetAudienceOtherText || targetAudienceOtherText.trim().length < 5)) {
      setError('Please tell us more about your audience (minimum 5 characters)')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await updateOnboardingStep2Action(organizationId, {
      targetAudience: selected,
      targetAudienceOtherText: selected === 'other' ? targetAudienceOtherText.trim() : undefined
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onComplete({ 
      targetAudience: selected,
      targetAudienceOtherText: selected === 'other' ? targetAudienceOtherText.trim() : null
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold">Who do you want to reach most often?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the people your content should speak to most of the time. You can change this later for each campaign.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TARGET_AUDIENCE_OPTIONS.map((option) => (
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

      {selected === 'other' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="target-audience-other-text" className="block text-sm font-medium mb-2">
              Tell us a bit more about your audience
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              This helps us suggest content that fits the people you want to reach.
            </p>
            <Input
              id="target-audience-other-text"
              value={targetAudienceOtherText}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 140) {
                  setTargetAudienceOtherText(value)
                  setError(null)
                }
              }}
              placeholder="e.g. corporate travelers, pet owners, high-net-worth families, engaged couples"
              className="w-full"
              maxLength={140}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Examples: "Corporate executives seeking luxury travel experiences"
              </p>
              <p className="text-xs text-muted-foreground">
                {targetAudienceOtherText.length}/140
              </p>
            </div>
          </div>
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
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            !selected || 
            isLoading || 
            (selected === 'other' && (!targetAudienceOtherText || targetAudienceOtherText.trim().length < 5))
          }
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
