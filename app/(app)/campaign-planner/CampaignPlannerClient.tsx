'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { WizardLayout } from '@/features/campaign-planner/components/WizardLayout'
import { Step1SelectCampaign } from '@/features/campaign-planner/components/steps/Step1SelectCampaign'
import { Step2ChooseMedia } from '@/features/campaign-planner/components/steps/Step2ChooseMedia'
import { Step3PlanningSetup } from '@/features/campaign-planner/components/steps/Step3PlanningSetup'
import { Step4GenerateBrief } from '@/features/campaign-planner/components/steps/Step4GenerateBrief'
import { Step5PasteOutput } from '@/features/campaign-planner/components/steps/Step5PasteOutput'
import { Step6ReviewDrafts } from '@/features/campaign-planner/components/steps/Step6ReviewDrafts'
import { Step7CreatePosts } from '@/features/campaign-planner/components/steps/Step7CreatePosts'
import { generateAIBrief } from '@/features/campaign-planner/utils/ai-brief-generator'
import { createDraftPostsAction } from '@/server/actions/campaign-planner.actions'
import type { CreateDraftPostsResult } from '@/server/actions/campaign-planner.actions'
import type { PlannerWizardState } from '@/features/campaign-planner/schemas/planner.schema'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CampaignPlannerClientProps {
  organizationId: string
  userId: string
  campaigns?: any[]
  mediaAssets?: any[]
}

export function CampaignPlannerClient({ organizationId, userId, campaigns, mediaAssets }: CampaignPlannerClientProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardState, setWizardState] = useState<Partial<PlannerWizardState>>({
    selectedMediaIds: [],
    platforms: [],
    toneOfVoice: [],
    topics: [],
    additionalNotes: '',
    aiOutput: '',
    parsedDrafts: [],
  })
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [selectedMedia, setSelectedMedia] = useState<any[]>([])
  const [aiBrief, setAiBrief] = useState('')

  const updateWizardState = (updates: Partial<PlannerWizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1)
      
      // Generate AI brief when moving to step 4
      if (currentStep === 3 && selectedCampaign) {
        const brief = generateAIBrief({
          campaignName: selectedCampaign.name,
          campaignObjective: selectedCampaign.objective,
          campaignTargetAudience: selectedCampaign.target_audience,
          campaignTargetMarket: selectedCampaign.target_market,
          campaignStartDate: selectedCampaign.start_date,
          campaignEndDate: selectedCampaign.end_date,
          mediaAssets: selectedMedia.map(m => ({
            filename: m.original_filename,
            title: m.title,
            description: m.description || '',
            tags: m.tags || [],
          })),
          platforms: wizardState.platforms || [],
          toneOfVoice: wizardState.toneOfVoice || [],
          topics: wizardState.topics || [],
          additionalNotes: wizardState.additionalNotes,
        })
        setAiBrief(brief)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleCreatePosts = async (): Promise<CreateDraftPostsResult> => {
    if (!wizardState.parsedDrafts || wizardState.parsedDrafts.length === 0) {
      return { success: false, postsCreated: 0, slotsCreated: 0, errors: [], error: 'No drafts to create' }
    }

    const mediaMap: Record<string, string> = {}
    selectedMedia.forEach(asset => {
      mediaMap[asset.original_filename] = asset.id
    })

    return createDraftPostsAction(
      organizationId,
      wizardState.selectedCampaignId!,
      wizardState.parsedDrafts,
      mediaMap
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaign Planner"
        description="Create a content plan with guided AI assistance"
      />
      
      <WizardLayout currentStep={currentStep}>
        {currentStep === 1 && (
          <Step1SelectCampaign
            organizationId={organizationId}
            selectedCampaignId={wizardState.selectedCampaignId}
            campaigns={campaigns}
            onSelect={(campaignId) => {
              updateWizardState({ selectedCampaignId: campaignId })
              // Fetch campaign details
              fetch(`/api/campaigns/${campaignId}`)
                .then(res => res.json())
                .then(data => setSelectedCampaign(data.campaign))
            }}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2ChooseMedia
            organizationId={organizationId}
            campaignId={wizardState.selectedCampaignId}
            campaignDuration={selectedCampaign ? (() => {
              if (selectedCampaign.start_date && selectedCampaign.end_date) {
                const start = new Date(selectedCampaign.start_date)
                const end = new Date(selectedCampaign.end_date)
                return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
              }
              return undefined
            })() : undefined}
            selectedMediaIds={wizardState.selectedMediaIds || []}
            onSelect={(mediaIds: string[], mediaAssets: any[]) => {
              updateWizardState({ selectedMediaIds: mediaIds })
              setSelectedMedia(mediaAssets)
            }}
            onNext={nextStep}
            onPrevious={prevStep}
            mediaAssets={mediaAssets}
          />
        )}

        {currentStep === 3 && (
          <Step3PlanningSetup
            platforms={wizardState.platforms || []}
            toneOfVoice={wizardState.toneOfVoice || []}
            topics={wizardState.topics || []}
            additionalNotes={wizardState.additionalNotes || ''}
            campaignName={selectedCampaign?.name}
            campaignDuration={selectedCampaign ? (() => {
              if (selectedCampaign.start_date && selectedCampaign.end_date) {
                const start = new Date(selectedCampaign.start_date)
                const end = new Date(selectedCampaign.end_date)
                return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
              }
              return undefined
            })() : undefined}
            selectedAssetsCount={(wizardState.selectedMediaIds || []).length}
            suggestedPlatforms={(() => {
              const allPlatforms = selectedMedia.flatMap((m: any) => m.suggested_platforms || [])
              return [...new Set(allPlatforms)] as string[]
            })()}
            onUpdate={updateWizardState}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}

        {currentStep === 4 && (
          <Step4GenerateBrief
            aiBrief={aiBrief}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}

        {currentStep === 5 && (
          <Step5PasteOutput
            aiOutput={wizardState.aiOutput || ''}
            expectedCount={(wizardState.selectedMediaIds || []).length}
            expectedFilenamesByDay={selectedMedia.map((m: any) => m.original_filename)}
            campaignStartDate={selectedCampaign?.start_date}
            campaignEndDate={selectedCampaign?.end_date}
            onUpdate={(output, drafts) => {
              updateWizardState({ aiOutput: output, parsedDrafts: drafts })
            }}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}

        {currentStep === 6 && (
          <Step6ReviewDrafts
            drafts={wizardState.parsedDrafts || []}
            mediaUrlMap={Object.fromEntries(
              selectedMedia
                .filter((m: any) => m.original_filename && m.signedUrl)
                .map((m: any) => [m.original_filename, m.signedUrl])
            )}
            onUpdateDrafts={(drafts) => updateWizardState({ parsedDrafts: drafts })}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}

        {currentStep === 7 && (
          <Step7CreatePosts
            drafts={wizardState.parsedDrafts || []}
            onPrevious={prevStep}
            onCreatePosts={handleCreatePosts}
          />
        )}
      </WizardLayout>
    </div>
  )
}
