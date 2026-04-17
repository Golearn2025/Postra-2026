import type {
  IndustryOption,
  TargetAudienceOption,
  PrimaryGoalOption,
  DefaultToneOption,
  PlatformOption
} from '@/types/onboarding'

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  {
    value: 'ecommerce',
    label: 'E-commerce',
    description: 'You sell products online or have an online store'
  },
  {
    value: 'local_services',
    label: 'Local Services',
    description: 'You provide services in your local area (plumbers, cleaners, etc.)'
  },
  {
    value: 'professional_services',
    label: 'Professional Services',
    description: 'You offer professional services (legal, accounting, consulting, etc.)'
  },
  {
    value: 'hospitality_travel',
    label: 'Travel & Hospitality',
    description: 'Hotels, tourism, chauffeur services, airport transfers, and guest transport'
  },
  {
    value: 'health_wellness',
    label: 'Health & Wellness',
    description: 'Gyms, spas, medical services, or wellness centers'
  },
  {
    value: 'real_estate',
    label: 'Real Estate',
    description: 'Property sales, rentals, or real estate services'
  },
  {
    value: 'education_coaching',
    label: 'Education & Coaching',
    description: 'Schools, training, courses, or coaching services'
  },
  {
    value: 'food_beverage',
    label: 'Food & Beverage',
    description: 'Restaurants, cafes, catering, or food delivery'
  },
  {
    value: 'beauty_personal_care',
    label: 'Beauty & Personal Care',
    description: 'Salons, spas, cosmetics, or personal care services'
  },
  {
    value: 'events_entertainment',
    label: 'Events & Entertainment',
    description: 'Event planning, entertainment, or venue services'
  },
  {
    value: 'finance_insurance',
    label: 'Finance & Insurance',
    description: 'Financial services, banking, or insurance'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'My business doesn\'t fit the categories above'
  }
]

export const TARGET_AUDIENCE_OPTIONS: TargetAudienceOption[] = [
  {
    value: 'general_audience',
    label: 'General audience',
    description: 'Everyone - I want to reach as many people as possible'
  },
  {
    value: 'young_adults',
    label: 'Young adults',
    description: 'People in their 20s and 30s'
  },
  {
    value: 'families',
    label: 'Families',
    description: 'Parents with children'
  },
  {
    value: 'professionals',
    label: 'Professionals',
    description: 'Working professionals and career-focused individuals'
  },
  {
    value: 'business_clients',
    label: 'Business clients',
    description: 'Other businesses (B2B)'
  },
  {
    value: 'luxury_clients',
    label: 'Luxury clients',
    description: 'High-end customers looking for premium products or services'
  },
  {
    value: 'tourists_visitors',
    label: 'Tourists / Visitors',
    description: 'People visiting your area or traveling'
  },
  {
    value: 'local_community',
    label: 'Local community',
    description: 'People living in your local area'
  },
  {
    value: 'students',
    label: 'Students',
    description: 'School or university students'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'A different audience type'
  }
]

export const PRIMARY_GOAL_OPTIONS: PrimaryGoalOption[] = [
  {
    value: 'brand_awareness',
    label: 'Brand awareness',
    description: 'Get more people to know about my brand'
  },
  {
    value: 'more_sales',
    label: 'More sales',
    description: 'Sell more products or increase revenue'
  },
  {
    value: 'more_bookings',
    label: 'More bookings',
    description: 'Get more appointments or reservations'
  },
  {
    value: 'more_leads',
    label: 'More leads',
    description: 'Get more potential customers to contact me'
  },
  {
    value: 'more_engagement',
    label: 'More engagement',
    description: 'Get more likes, comments, and shares on my posts'
  },
  {
    value: 'promote_services',
    label: 'Promote services',
    description: 'Show people what services I offer'
  },
  {
    value: 'product_launch',
    label: 'Product launch',
    description: 'Introduce a new product or service'
  },
  {
    value: 'build_trust',
    label: 'Build trust',
    description: 'Show customers they can trust my business'
  },
  {
    value: 'drive_website_traffic',
    label: 'Drive website traffic',
    description: 'Get more people to visit my website'
  }
]

export const DEFAULT_TONE_OPTIONS: DefaultToneOption[] = [
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable, and conversational - like talking to a friend'
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Polished, business-like, and trustworthy'
  },
  {
    value: 'premium',
    label: 'Premium',
    description: 'Sophisticated, exclusive, and high-end'
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Fun, energetic, and casual'
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
    description: 'Motivating, uplifting, and encouraging'
  },
  {
    value: 'trustworthy',
    label: 'Trustworthy',
    description: 'Reliable, honest, and dependable'
  }
]

export const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    value: 'facebook',
    label: 'Facebook',
    description: 'Good for reaching a wide audience and community building'
  },
  {
    value: 'instagram',
    label: 'Instagram',
    description: 'Perfect for visual content and lifestyle brands'
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    description: 'Great for short videos and reaching younger audiences'
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    description: 'Best for professional services and B2B businesses'
  },
  {
    value: 'google_business',
    label: 'Google Business',
    description: 'Essential for local businesses to appear in Google searches'
  },
  {
    value: 'youtube',
    label: 'YouTube',
    description: 'Ideal for longer videos, tutorials, and product demos'
  }
]
