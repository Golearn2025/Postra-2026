import type { AIBriefParams } from '../schemas/planner.schema'

export function generateAIBrief(params: AIBriefParams): string {
  const {
    campaignName,
    campaignObjective,
    campaignTargetAudience,
    campaignTargetMarket,
    campaignStartDate,
    campaignEndDate,
    mediaAssets,
    platforms,
    toneOfVoice,
    topics,
    additionalNotes,
  } = params

  const daysCount = calculateCampaignDays(campaignStartDate, campaignEndDate)
  const activeDays = Math.min(daysCount, mediaAssets.length)
  const dayDates = generateDateSequence(campaignStartDate, activeDays)

  // Build explicit day → asset mapping
  const dayMappingLines = dayDates.map((date, i) => {
    const asset = mediaAssets[i]
    let mapping = `  Day ${i + 1} (${date}) -> ${asset.filename}`
    if (asset.title) mapping += ` [${asset.title}]`
    if (asset.tags?.length) mapping += ` (tags: ${asset.tags.join(', ')})`
    if (asset.assetTitleShort) mapping += ` (assetTitleShort: ${asset.assetTitleShort})`
    if (asset.assetDescription) mapping += ` (assetDescription: ${asset.assetDescription})`
    if (asset.assetTags?.length) mapping += ` (assetTags: ${asset.assetTags.join(', ')})`
    if (asset.assetAiHint) mapping += ` (assetAiHint: ${asset.assetAiHint})`
    return mapping
  }).join('\n')

  // Build example output using first asset
  const exampleDate = dayDates[0] ?? campaignStartDate
  const exampleFilename = mediaAssets[0]?.filename ?? 'asset-filename.png'
  const exampleTopic = filenameToTopic(mediaAssets[0]?.filename ?? '') || topics[0] || 'Service Highlight'

  return `You are a professional content planner. Generate a ${activeDays}-day social media content plan for the following campaign.

CAMPAIGN DETAILS:
- Name: ${campaignName}
- Objective: ${campaignObjective}
- Target Audience: ${campaignTargetAudience}
- Target Market: ${campaignTargetMarket}
- Duration: ${campaignStartDate} to ${campaignEndDate} (${daysCount} days)
- Platforms: ${platforms.join(', ')}
- Tone of Voice: ${toneOfVoice.join(', ')}
${topics.length > 0 ? `- Focus Areas: ${topics.join(', ')}` : ''}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ''}

ASSET-TO-DAY ASSIGNMENT (fixed — do not reorder or reuse):
${dayMappingLines}

TASK:
Generate exactly ${activeDays} content entries — one per day — strictly following the asset-to-day assignment above.

REQUIRED FIELDS PER ENTRY:
- day: integer starting from 1
- date: YYYY-MM-DD
- mediaFilename: must exactly match the assigned filename for that day
- primaryTopic: the main content angle for this day (e.g. "${exampleTopic}")
- title: short, compelling post title
- hook: attention-grabbing opening line
- caption: full social media caption
- cta: clear call-to-action
- hashtags: array of relevant hashtags (5–10)
- targetGoal: what this post aims to achieve

RULES:
- mediaFilename must exactly match the assigned asset for each day — no substitutions
- Do not reorder assets or assign an asset to a different day
- Do not add extra fields
- Keep copy premium, polished, concise, and brand-safe
- Avoid generic luxury clichés (e.g. "world-class", "unparalleled", "second to none")
- Avoid exaggerated or unverifiable claims
- Keep language suitable for a premium business audience
- Return ONLY a raw JSON array — no markdown, no code fences, no explanation

OUTPUT FORMAT:
[
  {
    "day": 1,
    "date": "${exampleDate}",
    "mediaFilename": "${exampleFilename}",
    "primaryTopic": "${exampleTopic}",
    "title": "...",
    "hook": "...",
    "caption": "...",
    "cta": "...",
    "hashtags": ["#example1", "#example2"],
    "targetGoal": "..."
  }
]`
}

function calculateCampaignDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

function filenameToTopic(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')   // remove extension
    .replace(/-\d+$/, '')      // remove trailing number
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function generateDateSequence(startDate: string, count: number): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}
