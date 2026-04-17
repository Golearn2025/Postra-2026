'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { updateOnboardingStep1Action } from '@/server/actions/onboarding.actions'
import { INDUSTRY_OPTIONS } from '../constants/onboarding-options'
import type { Industry, OnboardingData } from '@/types/onboarding'

interface OnboardingStep1Props {
  organizationId: string
  selectedValue: Industry | null
  selectedOtherText: string | null
  onComplete: (data: Partial<OnboardingData>) => void
  onBack: () => void
}

export function OnboardingStep1({
  organizationId,
  selectedValue,
  selectedOtherText,
  onComplete,
  onBack
}: OnboardingStep1Props) {
  const [selected, setSelected] = useState<Industry | null>(selectedValue)
  const [industryOtherText, setIndustryOtherText] = useState(selectedOtherText || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = (value: Industry) => {
    setSelected(value)
    setError(null)
    // Clear other text when switching away from "other"
    if (value !== 'other') {
      setIndustryOtherText('')
    }
  }

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select an option')
      return
    }

    if (selected === 'other' && (!industryOtherText || industryOtherText.trim().length < 5)) {
      setError('Please tell us more about your business (minimum 5 characters)')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await updateOnboardingStep1Action(organizationId, {
      industry: selected,
      industryOtherText: selected === 'other' ? industryOtherText.trim() : undefined
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onComplete({ 
      industry: selected,
      industryOtherText: selected === 'other' ? industryOtherText.trim() : null
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold">What does your organization do?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This helps us suggest better campaigns, visuals, and content ideas for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INDUSTRY_OPTIONS.map((option) => (
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
            <label htmlFor="industry-other-text" className="block text-sm font-medium mb-2">
              Tell us a bit more about your business
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              This helps us suggest better campaigns and content ideas for your organization.
            </p>
            <Input
              id="industry-other-text"
              value={industryOtherText}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 140) {
                  setIndustryOtherText(value)
                  setError(null)
                }
              }}
              placeholder="e.g. luxury chauffeur service, pet grooming, custom furniture, wedding planning"
              className="w-full"
              maxLength={140}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Examples: "Luxury chauffeur service for airport transfers and executive travel"
              </p>
              <p className="text-xs text-muted-foreground">
                {industryOtherText.length}/140
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
            (selected === 'other' && (!industryOtherText || industryOtherText.trim().length < 5))
          }
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
