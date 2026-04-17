'use client'

import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { Megaphone, Users, Calendar, StickyNote } from 'lucide-react'
import { CampaignFormHeader } from './CampaignFormHeader'
import { CampaignWhatSection } from './CampaignWhatSection'
import { CampaignWhoSection } from './CampaignWhoSection'
import { CampaignWhenSection } from './CampaignWhenSection'
import { CampaignNotesSection } from './CampaignNotesSection'
import { CampaignAdvancedSection } from './CampaignAdvancedSection'
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

  const sections = [
    { id: 'basics', label: 'What', icon: Megaphone },
    { id: 'target', label: 'Who', icon: Users },
    { id: 'schedule', label: 'When', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: StickyNote }
  ]

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/campaigns')
    }
  }

  const sectionRefs = {
    basics: useRef<HTMLDivElement>(null),
    target: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    notes: useRef<HTMLDivElement>(null)
  }

  const [formData, setFormData] = useState<CreateCampaignFormData>({
    name: initialData?.name || '',
    campaignPillar: initialData?.campaignPillar || undefined,
    mainGoal: initialData?.mainGoal || undefined,
    targetAudience: initialData?.targetAudience || undefined,
    targetMarket: initialData?.targetMarket || '',
    scheduleType: initialData?.scheduleType || 'date_range',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    selectedDates: initialData?.selectedDates || [],
    description: initialData?.description || '',
    slug: initialData?.slug || '',
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
  }

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs]
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setCurrentSection(sectionId)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Failed to create campaign. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* ONE UNIFIED PREMIUM HEADER */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {/* Title + Organization */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent to-accent/60"></div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent to-accent/60"></div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Creating campaign for</span>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-accent/10 to-accent/5 text-accent border border-accent/20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
                {organizationName}
              </div>
            </div>
          </div>

          {/* Steps with Icons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isActive = currentSection === section.id
              const isCompleted = index < sections.findIndex(s => s.id === currentSection)
              
              return (
                <React.Fragment key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive && "bg-accent text-white shadow-sm",
                      isCompleted && "bg-accent/10 text-accent hover:bg-accent/20",
                      !isActive && !isCompleted && "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                  {index < sections.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5",
                      index < sections.findIndex(s => s.id === currentSection) ? "bg-accent" : "bg-muted"
                    )} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Cancel Button */}
          <div className="text-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleCancel}
              className="border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container max-w-4xl mx-auto px-4 py-8 space-y-12">
        {errors.general && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md">
            {errors.general}
          </div>
        )}

      {/* Section 1: Campaign Basics */}
      <section id="basics" ref={sectionRefs.basics}>
        <Card className="p-6">
          <CampaignWhatSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </Card>
      </section>

      {/* Section 2: Target Audience */}
      <section id="target" ref={sectionRefs.target}>
        <Card className="p-6">
          <CampaignWhoSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </Card>
      </section>

      {/* Section 3: Schedule */}
      <section id="schedule" ref={sectionRefs.schedule}>
        <Card className="p-6">
          <CampaignWhenSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </Card>
      </section>

      {/* Section 4: Notes */}
      <section id="notes" ref={sectionRefs.notes}>
        <Card className="p-6">
          <CampaignNotesSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </Card>
      </section>

      {/* Advanced Section */}
      <Card className="p-6">
        <CampaignAdvancedSection
          formData={formData}
          onChange={handleChange}
          errors={errors}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </Card>
      </form>
    </div>
  )
}
