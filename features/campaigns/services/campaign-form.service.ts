/**
 * Campaign Form Client Service
 * Client-side wrapper for campaign form data fetching
 * Provides organization-specific examples and defaults
 */

export interface CampaignFormUIProps {
  objectiveExamples: string
  targetAudienceExamples: string
  targetMarketExamples: string
  defaultTimezone: string
}

/**
 * Get campaign form data for UI components
 * Server action wrapper to avoid direct server imports in client
 */
export async function getCampaignFormUIProps(organizationId: string): Promise<CampaignFormUIProps> {
  try {
    const response = await fetch(`/api/campaigns/form-data?organizationId=${organizationId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch campaign form data')
    }
    
    const data = await response.json()
    return data.formData
  } catch (error) {
    console.error('Failed to get campaign form UI props:', error)
    
    // Safe fallback to generic examples
    return {
      objectiveExamples: 'Increase brand awareness, Generate qualified leads',
      targetAudienceExamples: 'General consumers, Business professionals',
      targetMarketExamples: 'Local market, National market',
      defaultTimezone: 'UTC'
    }
  }
}
