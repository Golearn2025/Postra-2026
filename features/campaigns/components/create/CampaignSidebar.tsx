'use client'

import { cn } from '@/lib/utils/cn'
import { Megaphone, Users, Calendar, StickyNote, CheckCircle2, Circle } from 'lucide-react'

interface CampaignSidebarProps {
  currentSection: string
  completedSections: string[]
  onSectionChange: (sectionId: string) => void
  progress: number
}

const sections = [
  { id: 'basics', label: 'What', icon: Megaphone, description: 'Campaign basics' },
  { id: 'target', label: 'Who', icon: Users, description: 'Target audience' },
  { id: 'schedule', label: 'When', icon: Calendar, description: 'Schedule & timing' },
  { id: 'notes', label: 'Notes', icon: StickyNote, description: 'Additional details' }
]

export function CampaignSidebar({
  currentSection,
  completedSections,
  onSectionChange,
  progress
}: CampaignSidebarProps) {
  return (
    <div className="w-96 h-full bg-white dark:bg-slate-900 border-r border-border flex flex-col">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-[#6366f1] to-[#4f46e5]"></div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Campaign Setup
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete all sections to create your campaign
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex-1 p-6 space-y-2 overflow-y-auto">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isActive = currentSection === section.id
          const isCompleted = completedSections.includes(section.id)
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all duration-200",
                isActive && "bg-[#eef2ff] dark:bg-[#6366f1]/10 border-2 border-[#6366f1] shadow-md shadow-[#6366f1]/10",
                !isActive && isCompleted && "bg-green-50/50 dark:bg-green-950/20 hover:bg-green-50 dark:hover:bg-green-950/30 border-2 border-transparent",
                !isActive && !isCompleted && "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-transparent"
              )}
            >
              {/* Icon & Status */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isActive && "bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white",
                !isActive && isCompleted && "bg-gradient-to-br from-green-500 to-green-600 text-white",
                !isActive && !isCompleted && "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              )}>
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    isActive && "text-[#6366f1]",
                    !isActive && isCompleted && "text-green-600 dark:text-green-400",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}>
                    Step {index + 1}
                  </span>
                </div>
                <h4 className={cn(
                  "text-sm font-bold mb-0.5",
                  isActive && "text-[#6366f1] dark:text-[#c7d2fe]",
                  !isActive && "text-slate-900 dark:text-slate-100"
                )}>
                  {section.label}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {section.description}
                </p>
              </div>

              {/* Arrow indicator for active */}
              {isActive && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Progress Section */}
      <div className="p-6 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Overall Progress</span>
            <span className="text-lg font-bold text-[#6366f1]">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] transition-all duration-500 rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSections.length} of {sections.length} completed
            </span>
            {completedSections.length === sections.length && (
              <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Ready!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
