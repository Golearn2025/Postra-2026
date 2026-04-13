import { aiDraftPostSchema, type AIDraftPost } from '../schemas/planner.schema'

export interface ParseResult {
  success: boolean
  data?: AIDraftPost[]
  errors?: string[]
}

/** Strip markdown code fences and trim whitespace from pasted AI output */
function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

/** Generate expected date string for a given day offset from startDate */
function expectedDate(startDate: string, dayIndex: number): string {
  const d = new Date(startDate)
  d.setDate(d.getDate() + dayIndex)
  return d.toISOString().split('T')[0]
}

const REQUIRED_FIELDS = ['day', 'date', 'mediaFilename', 'title', 'caption', 'hook', 'cta', 'hashtags', 'targetGoal'] as const

export function parseAIOutput(raw: string): ParseResult {
  const errors: string[] = []

  try {
    const cleaned = normalizeOutput(raw)
    const parsed = JSON.parse(cleaned)
    const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed]

    if (items.length === 0) {
      return { success: false, errors: ['No items found in AI output'] }
    }

    const validatedPosts: AIDraftPost[] = []

    items.forEach((item, index) => {
      const label = `Item ${index + 1}`
      const result = aiDraftPostSchema.safeParse(item)

      if (!result.success) {
        const fieldErrors = result.error.errors.map(e => {
          const field = e.path.join('.')
          return `${label} — field "${field}": ${e.message}`
        })
        errors.push(...fieldErrors)
      } else {
        validatedPosts.push(result.data)
      }
    })

    if (validatedPosts.length === 0) {
      return { success: false, errors }
    }

    return { success: true, data: validatedPosts, errors: errors.length > 0 ? errors : undefined }
  } catch (error) {
    return {
      success: false,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Could not parse output'}`],
    }
  }
}

export interface PlannerContractParams {
  expectedCount: number
  expectedFilenamesByDay: string[]  // ordered list: index 0 = Day 1
  campaignStartDate: string
}

/** Full planner-contract validation: count, day sequence, dates, asset-to-day mapping, required fields */
export function validatePlannerContract(
  drafts: AIDraftPost[],
  contract: PlannerContractParams
): { valid: boolean; errors: string[] } {
  const { expectedCount, expectedFilenamesByDay, campaignStartDate } = contract
  const errors: string[] = []

  // 1. Item count
  if (drafts.length !== expectedCount) {
    errors.push(`Expected ${expectedCount} items, received ${drafts.length}`)
  }

  drafts.forEach((draft, index) => {
    const label = `Item ${index + 1}`
    const expectedDay = index + 1

    // 2. Required fields
    for (const field of REQUIRED_FIELDS) {
      const value = draft[field as keyof AIDraftPost]
      if (value === undefined || value === null || value === '') {
        errors.push(`${label} is missing "${field}"`)
      }
    }

    // 3. Day sequence
    if (draft.day !== expectedDay) {
      errors.push(`${label} has day=${draft.day}, expected day=${expectedDay}`)
    }

    // 4. Date sequence
    const expDate = expectedDate(campaignStartDate, index)
    if (draft.date !== expDate) {
      errors.push(`${label} date is "${draft.date}", expected "${expDate}"`)
    }

    // 5. mediaFilename exact match
    const expFilename = expectedFilenamesByDay[index]
    if (expFilename && draft.mediaFilename !== expFilename) {
      errors.push(`${label} has mediaFilename "${draft.mediaFilename}", expected "${expFilename}"`)
    }

    // 6. hashtags must be array
    if (!Array.isArray(draft.hashtags)) {
      errors.push(`${label} hashtags must be an array`)
    }
  })

  return { valid: errors.length === 0, errors }
}
