'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { parseAIOutput, validatePlannerContract } from '../../utils/ai-output-parser'
import type { AIDraftPost } from '../../schemas/planner.schema'

interface Step5Props {
  aiOutput: string
  expectedCount?: number
  expectedFilenamesByDay?: string[]
  campaignStartDate?: string
  campaignEndDate?: string
  onUpdate: (output: string, drafts: AIDraftPost[]) => void
  onNext: () => void
  onPrevious: () => void
}

const PLACEHOLDER = `[
  {
    "day": 1,
    "date": "2026-04-10",
    "mediaFilename": "airport-transfer-01.png",
    "primaryTopic": "Airport Transfer",
    "title": "...",
    "hook": "...",
    "caption": "...",
    "cta": "...",
    "hashtags": ["#example1", "#example2"],
    "targetGoal": "..."
  }
]`

export function Step5PasteOutput({
  aiOutput,
  expectedCount,
  expectedFilenamesByDay,
  campaignStartDate,
  campaignEndDate,
  onUpdate,
  onNext,
  onPrevious,
}: Step5Props) {
  const [errors, setErrors] = useState<string[]>([])
  const [validatedDrafts, setValidatedDrafts] = useState<AIDraftPost[] | null>(null)

  const handleValidate = () => {
    // Step 1: Parse JSON + schema validation
    const parseResult = parseAIOutput(aiOutput)
    if (!parseResult.success || !parseResult.data) {
      setErrors(parseResult.errors || ['Failed to parse AI output'])
      setValidatedDrafts(null)
      return
    }

    // Step 2: Planner contract validation (when context is available)
    if (expectedCount !== undefined && expectedFilenamesByDay && campaignStartDate) {
      const contractResult = validatePlannerContract(parseResult.data, {
        expectedCount,
        expectedFilenamesByDay,
        campaignStartDate,
      })
      if (!contractResult.valid) {
        setErrors(contractResult.errors)
        setValidatedDrafts(null)
        return
      }
    }

    setErrors([])
    setValidatedDrafts(parseResult.data)
    onUpdate(aiOutput, parseResult.data)
  }

  const isValid = validatedDrafts !== null && errors.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Paste AI Output</h2>
        <p className="text-muted-foreground">
          Paste the full AI-generated JSON array for this campaign plan. The planner will validate the structure, required fields, and day-to-asset mapping before continuing.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">What to paste</p>
            <p className="text-blue-700">
              Paste the complete JSON array returned by the AI. It should start with{' '}
              <code className="px-1 py-0.5 bg-blue-100 rounded">[</code> and end with{' '}
              <code className="px-1 py-0.5 bg-blue-100 rounded">]</code>. If the AI wrapped it in markdown code fences, the planner will clean that automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Textarea
          value={aiOutput}
          onChange={(e) => {
            onUpdate(e.target.value, [])
            setErrors([])
            setValidatedDrafts(null)
          }}
          placeholder={PLACEHOLDER}
          rows={14}
          className="font-mono text-sm"
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleValidate}
            variant="outline"
            disabled={!aiOutput.trim()}
          >
            Validate Output
          </Button>
          {isValid && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {validatedDrafts!.length} items validated — ready to review
            </div>
          )}
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-2">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm w-full">
              <p className="font-medium text-red-900 mb-2">Validation failed — {errors.length} error{errors.length !== 1 ? 's' : ''}</p>
              <ul className="text-red-700 space-y-1 list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Parsed preview */}
      {isValid && validatedDrafts && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b">
            <p className="text-sm font-semibold">Plan Preview — {validatedDrafts.length} days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-12">Day</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-28">Date</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-48">Media File</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-36">Primary Topic</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Title</th>
                </tr>
              </thead>
              <tbody>
                {validatedDrafts.map((draft, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium text-center">{draft.day}</td>
                    <td className="px-3 py-2 text-muted-foreground">{draft.date}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground truncate max-w-[180px]">{draft.mediaFilename}</td>
                    <td className="px-3 py-2 text-muted-foreground">{draft.primaryTopic ?? '—'}</td>
                    <td className="px-3 py-2 font-medium">{draft.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
