// Platform presets
export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google_business', label: 'Google Business' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
  { value: 'pinterest', label: 'Pinterest' },
] as const

// Tone of voice presets
export const TONE_OF_VOICE_SUGGESTIONS = [
  'Professional',
  'Premium',
  'Luxury',
  'Friendly',
  'Bold',
  'Trustworthy',
  'Educational',
  'Cinematic',
  'Emotional',
  'Direct',
  'Elegant',
  'Playful',
  'Minimal',
  'Inspiring',
] as const

// Content Direction presets
export const TOPIC_SUGGESTIONS = [
  'Service Highlight',
  'Premium Experience',
  'Airport Transfer',
  'Hotel Arrival',
  'Executive Travel',
  'Event Transport',
  'Brand Story',
  'Lifestyle Moment',
  'Offer / Promotion',
  'Customer Trust',
  'Behind the Scenes',
  'Educational Post',
] as const

// Wizard steps
export const WIZARD_STEPS = [
  { id: 1, title: 'Select Campaign', description: 'Choose the campaign for your content plan' },
  { id: 2, title: 'Choose Campaign Assets', description: 'Review and confirm assets for this campaign' },
  { id: 3, title: 'Set Content Plan', description: 'Confirm platforms, tone, and content direction' },
  { id: 4, title: 'Generate AI Brief', description: 'Get your AI prompt ready' },
  { id: 5, title: 'Paste AI Output', description: 'Add the generated content plan' },
  { id: 6, title: 'Review Drafts', description: 'Review before creating posts' },
  { id: 7, title: 'Create Posts', description: 'Finalize and create draft posts' },
] as const
