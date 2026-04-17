'use client'

import { useState } from 'react'

interface CampaignFormHeaderProps {
  currentSection: string
  onSectionChange: (sectionId: string) => void
}

const sections = [
  { id: 'basics', label: 'What' },
  { id: 'target', label: 'Who' },
  { id: 'schedule', label: 'When' },
  { id: 'notes', label: 'Notes' }
]

export function CampaignFormHeader({ 
  currentSection, 
  onSectionChange 
}: CampaignFormHeaderProps) {
  return (
    <div className="mb-8">
      {/* Compact Progress Indicator */}
      <div className="flex items-center gap-2">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center flex-1">
            <button
              onClick={() => onSectionChange(section.id)}
              className={`
                flex items-center gap-2 text-sm font-medium transition-colors py-2
                ${currentSection === section.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentSection === section.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}
              >
                {index + 1}
              </div>
              <span className="hidden md:inline">{section.label}</span>
            </button>
            {index < sections.length - 1 && (
              <div className="flex-1 h-px bg-border mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
