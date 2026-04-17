'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CalendarDays, Images, Layers } from 'lucide-react'
import { PLATFORM_OPTIONS, TONE_OF_VOICE_SUGGESTIONS, TOPIC_SUGGESTIONS } from '../../constants/presets'

const MAX_TONES = 3

interface Step3Props {
  platforms: string[]
  toneOfVoice: string[]
  topics: string[]
  additionalNotes: string
  campaignName?: string
  campaignDuration?: number
  selectedAssetsCount?: number
  suggestedPlatforms?: string[]
  onUpdate: (updates: {
    platforms?: string[]
    toneOfVoice?: string[]
    topics?: string[]
    additionalNotes?: string
  }) => void
  onNext: () => void
  onPrevious: () => void
}

export function Step3PlanningSetup({
  platforms,
  toneOfVoice,
  topics,
  additionalNotes,
  campaignName,
  campaignDuration,
  selectedAssetsCount,
  suggestedPlatforms,
  onUpdate,
  onNext,
  onPrevious,
}: Step3Props) {
  // Use approved model presets - no legacy configuration
  const platformOptions = 
    PLATFORM_OPTIONS.map(p => ({ id: p.value, label: p.label, order: 0, active: true }))
  
  const toneOptions = 
    TONE_OF_VOICE_SUGGESTIONS.map(t => ({ id: t, label: t, order: 0, active: true }))
  
  const topicOptions = 
    TOPIC_SUGGESTIONS.map(t => ({ id: t, label: t, order: 0, active: true }))

  // Prefill platforms from suggested platforms on first render
  useEffect(() => {
    if (platforms.length === 0 && suggestedPlatforms && suggestedPlatforms.length > 0) {
      onUpdate({ platforms: suggestedPlatforms })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedPlatforms])

  const togglePlatform = (value: string) => {
    const newPlatforms = platforms.includes(value)
      ? platforms.filter(p => p !== value)
      : [...platforms, value]
    onUpdate({ platforms: newPlatforms })
  }

  const toggleTone = (value: string) => {
    if (toneOfVoice.includes(value)) {
      onUpdate({ toneOfVoice: toneOfVoice.filter(t => t !== value) })
    } else if (toneOfVoice.length < MAX_TONES) {
      onUpdate({ toneOfVoice: [...toneOfVoice, value] })
    }
  }

  const toggleTopic = (value: string) => {
    const newTopics = topics.includes(value)
      ? topics.filter(t => t !== value)
      : [...topics, value]
    onUpdate({ topics: newTopics })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Set Content Plan</h2>
        <p className="text-muted-foreground">
          Confirm how this campaign should be turned into a day-by-day content plan, including platforms, tone, and content direction.
        </p>
      </div>

      {/* Campaign planning summary */}
      {(campaignName || campaignDuration || selectedAssetsCount !== undefined) && (
        <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Campaign Plan Summary</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {campaignName && (
              <div className="flex items-start gap-2 col-span-2">
                <Layers className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Campaign</p>
                  <p className="text-sm font-medium leading-tight">{campaignName}</p>
                </div>
              </div>
            )}
            {campaignDuration && (
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{campaignDuration} days</p>
                </div>
              </div>
            )}
            {selectedAssetsCount !== undefined && (
              <div className="flex items-start gap-2">
                <Images className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Assets selected</p>
                  <p className="text-sm font-medium">{selectedAssetsCount}</p>
                </div>
              </div>
            )}
          </div>
          {campaignDuration && selectedAssetsCount !== undefined && (
            <p className="text-xs text-muted-foreground border-t pt-2 mt-1">
              This plan will generate <span className="font-semibold text-foreground">{Math.min(campaignDuration, selectedAssetsCount)} campaign days</span> using <span className="font-semibold text-foreground">{selectedAssetsCount} selected asset{selectedAssetsCount !== 1 ? 's' : ''}</span> in order — 1 asset per day.
            </p>
          )}
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">AI Brief Generation</p>
            <p className="text-blue-700">
              These settings will be used to generate the AI brief for your campaign plan. The planner will combine your campaign details, selected assets, and content settings to create day-by-day draft content.
            </p>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Platforms *</Label>
          {suggestedPlatforms && suggestedPlatforms.length > 0 && (
            <span className="text-xs text-muted-foreground">Prefilled from campaign assets</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Select where you'll publish this content</p>
        <div className="flex flex-wrap gap-2">
          {platformOptions
            .filter(option => option.active)
            .sort((a, b) => a.order - b.order)
            .map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                platforms.includes(platform.id)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone of Voice */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Tone of Voice *</Label>
          <span className={`text-xs font-medium ${toneOfVoice.length >= MAX_TONES ? 'text-amber-600' : 'text-muted-foreground'}`}>
            {toneOfVoice.length}/{MAX_TONES} selected
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Select up to {MAX_TONES} tones that define your brand voice</p>
        <div className="flex flex-wrap gap-2">
          {toneOptions
            .filter(option => option.active)
            .sort((a, b) => a.order - b.order)
            .map((tone) => {
            const isSelected = toneOfVoice.includes(tone.id)
            const isDisabled = !isSelected && toneOfVoice.length >= MAX_TONES
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => toggleTone(tone.id)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isDisabled
                      ? 'border-border text-muted-foreground opacity-40 cursor-not-allowed'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                {tone.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Focus Areas */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Focus Areas</Label>
        <p className="text-sm text-muted-foreground">Choose the themes or service angles this campaign should emphasize. (optional)</p>
        <div className="flex flex-wrap gap-2">
          {topicOptions
            .filter(option => option.active)
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                topics.includes(topic.id)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-3">
        <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
        <p className="text-sm text-muted-foreground">
          Any special instructions or context for the AI? (optional)
        </p>
        <Textarea
          id="notes"
          value={additionalNotes}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          placeholder="Example: Focus on premium service differentiators, mention upcoming event dates, highlight executive clientele..."
          rows={4}
        />
      </div>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={platforms.length === 0 || toneOfVoice.length === 0}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
