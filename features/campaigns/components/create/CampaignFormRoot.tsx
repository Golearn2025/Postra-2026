'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CampaignPremiumHeader } from './CampaignPremiumHeader'
import { CampaignSidebar } from './CampaignSidebar'
import { CampaignDebugPanel } from './CampaignDebugPanel'
import { CampaignWhatSection } from './CampaignWhatSection'
import { CampaignWhoSection } from './CampaignWhoSection'
import { CampaignWhenSection } from './CampaignWhenSection'
import { CampaignNotesSection } from './CampaignNotesSection'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignFormRootProps {
  organizationId: string
  organizationName: string
  initialData?: Partial<CreateCampaignFormData>
  onSubmit: (data: CreateCampaignFormData) => Promise<void>
  onCancel?: () => void
}

export function CampaignFormRoot({
  organizationId,
  organizationName,
  initialData,
  onSubmit,
  onCancel
}: CampaignFormRootProps) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState('basics')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const sections = ['basics', 'target', 'schedule', 'notes']

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/campaigns')
    }
  }

  const [formData, setFormData] = useState<CreateCampaignFormData>({
    name: initialData?.name || '',
    campaignPillar: initialData?.campaignPillar,
    mainGoal: initialData?.mainGoal,
    targetAudience: initialData?.targetAudience,
    targetMarket: initialData?.targetMarket,
    scheduleType: initialData?.scheduleType || 'date_range',
    startDate: initialData?.startDate,
    endDate: initialData?.endDate,
    selectedDates: initialData?.selectedDates,
    description: initialData?.description,
    slug: initialData?.slug,
    status: initialData?.status || 'draft'
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Auto-generate slug from name
    if (field === 'name' && value) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }

    // Mark section as touched/completed
    if (value && !completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection])
    }
  }

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId)
  }

  const handleNext = () => {
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('[SUBMIT ERROR]', error)
      setErrors({ general: 'Failed to create campaign. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (completedSections.length / sections.length) * 100

  const currentIndex = sections.indexOf(currentSection)

  return (
    <div className="h-full flex flex-col">
      {/* Premium Fixed Header */}
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <CampaignPremiumHeader
          organizationName={organizationName}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <CampaignSidebar
            currentSection={currentSection}
            completedSections={completedSections}
            onSectionChange={handleSectionChange}
            progress={progress}
          />

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-canvas-bg">
            {/* Error Message */}
            {errors.general && (
              <div className="mx-8 mt-8 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-5 rounded-xl shadow-sm">
                <strong className="font-semibold">Error:</strong> {errors.general}
              </div>
            )}

            {/* Section Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-5xl mx-auto">
                {/* Section Slides */}
                <div className="relative">
                  {/* What Section */}
                  <div className={cn(
                    "transition-all duration-300",
                    currentSection === 'basics' ? 'block' : 'hidden'
                  )}>
                    <CampaignWhatSection
                      formData={formData}
                      onChange={handleChange}
                      errors={errors}
                    />
                  </div>

                  {/* Who Section */}
                  <div className={cn(
                    "transition-all duration-300",
                    currentSection === 'target' ? 'block' : 'hidden'
                  )}>
                    <CampaignWhoSection
                      formData={formData}
                      onChange={handleChange}
                      errors={errors}
                    />
                  </div>

                  {/* When Section */}
                  <div className={cn(
                    "transition-all duration-300",
                    currentSection === 'schedule' ? 'block' : 'hidden'
                  )}>
                    <CampaignWhenSection
                      formData={formData}
                      onChange={handleChange}
                      errors={errors}
                    />
                  </div>

                  {/* Notes Section */}
                  <div className={cn(
                    "transition-all duration-300",
                    currentSection === 'notes' ? 'block' : 'hidden'
                  )}>
                    <CampaignNotesSection
                      formData={formData}
                      onChange={handleChange}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex-shrink-0 border-t border-border bg-white dark:bg-slate-900 px-8 py-6">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="gap-2 h-11 px-6 border-slate-300 dark:border-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-semibold">Previous</span>
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    Step {currentIndex + 1} of {sections.length}
                  </span>
                  <div className="flex gap-1.5">
                    {sections.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-200",
                          idx === currentIndex && "w-8 bg-gradient-to-r from-[#6366f1] to-[#4f46e5]",
                          idx < currentIndex && "bg-green-500",
                          idx > currentIndex && "bg-slate-300 dark:bg-slate-600"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {currentIndex < sections.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 h-11 px-6 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white shadow-lg shadow-[#6366f1]/25"
                  >
                    <span className="font-semibold">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <div className="w-32" />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Debug Panel - Remove in production */}
      <CampaignDebugPanel formData={formData} />
    </div>
  )
}
