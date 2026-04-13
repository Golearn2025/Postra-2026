'use client'

import { Check } from 'lucide-react'
import { WIZARD_STEPS } from '../constants/presets'

interface WizardLayoutProps {
  currentStep: number
  children: React.ReactNode
}

export function WizardLayout({ currentStep, children }: WizardLayoutProps) {
  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground max-w-[100px]">{step.description}</div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border rounded-lg p-8">
        {children}
      </div>
    </div>
  )
}
