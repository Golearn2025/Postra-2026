'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Megaphone, Users, Calendar, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { AppCampaignDetail } from '@/types/views'
import { useEditCampaignForm } from '../hooks/useEditCampaignForm'
import { EditCampaignWhatSection } from './edit/EditCampaignWhatSection'
import { EditCampaignWhoSection } from './edit/EditCampaignWhoSection'
import { EditCampaignWhenSection } from './edit/EditCampaignWhenSection'
import { EditCampaignNotesSection } from './edit/EditCampaignNotesSection'

interface EditCampaignFormGuidedProps {
  campaign: AppCampaignDetail
  organizationId: string
  onCancel?: () => void
  onSuccess?: () => void
  embedded?: boolean
}

const sections = [
  { id: 'basics', label: 'What', icon: Megaphone },
  { id: 'target', label: 'Who', icon: Users },
  { id: 'schedule', label: 'When', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: StickyNote }
]

export function EditCampaignFormGuided({
  campaign,
  organizationId
}: EditCampaignFormGuidedProps) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState('basics')

  const sectionRefs = {
    basics: useRef<HTMLDivElement>(null),
    target: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    notes: useRef<HTMLDivElement>(null)
  }

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleAddDate,
    handleRemoveDate,
    handleSubmit
  } = useEditCampaignForm(campaign, organizationId)

  return (
    <div className="min-h-screen bg-background">
      {/* ONE UNIFIED PREMIUM HEADER */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {/* Title + Campaign Name */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent to-accent/60"></div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent to-accent/60"></div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Editing campaign</span>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-accent/10 to-accent/5 text-accent border border-accent/20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
                {formData.name || 'Untitled Campaign'}
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
                    onClick={() => setCurrentSection(section.id)}
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

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => router.push('/campaigns')}
              className="border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="edit-campaign-form"
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent-hover text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content - Modular Sections */}
      <form onSubmit={handleSubmit} id="edit-campaign-form" className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Section 1: What */}
          <section id="basics" ref={sectionRefs.basics} className="scroll-mt-32">
            <EditCampaignWhatSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </section>

          {/* Section 2: Who */}
          <section id="target" ref={sectionRefs.target} className="scroll-mt-32">
            <EditCampaignWhoSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </section>

          {/* Section 3: When */}
          <section id="schedule" ref={sectionRefs.schedule} className="scroll-mt-32">
            <EditCampaignWhenSection
              formData={formData}
              onChange={handleChange}
              onAddDate={handleAddDate}
              onRemoveDate={handleRemoveDate}
              errors={errors}
            />
          </section>

          {/* Section 4: Notes */}
          <section id="notes" ref={sectionRefs.notes} className="scroll-mt-32">
            <EditCampaignNotesSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </section>
        </div>
      </form>
    </div>
  )
}
