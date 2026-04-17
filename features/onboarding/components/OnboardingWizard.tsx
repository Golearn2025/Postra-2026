'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { completeOnboardingAction } from '@/server/actions/onboarding.actions'
import { OnboardingStep1 } from './OnboardingStep1'
import { OnboardingStep2 } from './OnboardingStep2'
import { OnboardingStep3 } from './OnboardingStep3'
import { OnboardingStep4 } from './OnboardingStep4'
import { OnboardingStep5 } from './OnboardingStep5'
import type { OnboardingData } from '@/types/onboarding'

interface OnboardingWizardProps {
  organizationId: string
  organizationName: string
  initialData?: Partial<OnboardingData>
}

export function OnboardingWizard({
  organizationId,
  organizationName,
  initialData
}: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<OnboardingData>({
    industry: initialData?.industry ?? null,
    industryOtherText: initialData?.industryOtherText ?? null,
    targetAudience: initialData?.targetAudience ?? null,
    targetAudienceOtherText: initialData?.targetAudienceOtherText ?? null,
    primaryGoal: initialData?.primaryGoal ?? null,
    defaultTone: initialData?.defaultTone ?? null,
    platforms: initialData?.platforms ?? []
  })

  const totalSteps = 5

  const handleStepComplete = async (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }))
    setError(null)
    
    if (currentStep === totalSteps) {
      // This is the final step (Step 5), trigger completion
      await handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError(null)
    }
  }

  const handleComplete = async () => {
    // DEBUG: Log current state
    console.log('DEBUG: Final wizard state:', data)
    console.log('DEBUG: Validation checks:', {
      industry: !!data.industry,
      targetAudience: !!data.targetAudience,
      primaryGoal: !!data.primaryGoal,
      defaultTone: !!data.defaultTone,
      platforms: data.platforms.length > 0,
      industryOtherText: data.industryOtherText,
      targetAudienceOtherText: data.targetAudienceOtherText
    })

    // Check if industry is 'other' and requires other text
    const industryComplete = data.industry && (
      data.industry !== 'other' || (data.industryOtherText && data.industryOtherText.trim().length >= 5)
    )

    // Check if targetAudience is 'other' and requires other text
    const targetAudienceComplete = data.targetAudience && (
      data.targetAudience !== 'other' || (data.targetAudienceOtherText && data.targetAudienceOtherText.trim().length >= 5)
    )

    if (!industryComplete || !targetAudienceComplete || !data.primaryGoal || !data.defaultTone || data.platforms.length === 0) {
      console.log('DEBUG: Validation failed', {
        industryComplete,
        targetAudienceComplete,
        primaryGoal: !!data.primaryGoal,
        defaultTone: !!data.defaultTone,
        platforms: data.platforms.length > 0
      })
      setError('Please complete all steps')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const payload = {
      industry: data.industry!,
      industryOtherText: data.industryOtherText || undefined,
      targetAudience: data.targetAudience!,
      targetAudienceOtherText: data.targetAudienceOtherText || undefined,
      primaryGoal: data.primaryGoal!,
      defaultTone: data.defaultTone!,
      platforms: data.platforms
    }

    console.log('DEBUG: Final payload:', payload)

    const result = await completeOnboardingAction(organizationId, payload)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // If successful, completeOnboardingAction will redirect to /campaigns/new
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-semibold">Welcome to Postra</h1>
        <p className="text-muted-foreground">
          Let's set up {organizationName} in just a few steps
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b bg-card/30 mb-8">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = step < currentStep
              const isCurrent = step === currentStep
              
              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${isCompleted ? 'border-primary bg-primary text-primary-foreground' : ''}
                      ${isCurrent ? 'border-primary bg-background text-primary' : ''}
                      ${!isCompleted && !isCurrent ? 'border-muted bg-muted/50 text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`h-0.5 w-16 mx-2 transition-all ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container max-w-3xl mx-auto px-4 pb-12">
        {currentStep === 1 && (
          <OnboardingStep1
            organizationId={organizationId}
            selectedValue={data.industry}
            selectedOtherText={data.industryOtherText}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && (
          <OnboardingStep2
            organizationId={organizationId}
            selectedValue={data.targetAudience}
            selectedOtherText={data.targetAudienceOtherText}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <OnboardingStep3
            organizationId={organizationId}
            selectedValue={data.primaryGoal}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <OnboardingStep4
            organizationId={organizationId}
            selectedValue={data.defaultTone}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <OnboardingStep5
            organizationId={organizationId}
            selectedValues={data.platforms}
            onComplete={handleStepComplete}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
