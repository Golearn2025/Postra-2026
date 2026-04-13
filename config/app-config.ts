export const appConfig = {
  name: 'Postra',
  description: 'Enterprise Social Content Platform',
  version: '0.1.0',
  defaultTimezone: 'Europe/London',
  defaultLocale: 'en-GB',
  routes: {
    home: '/dashboard',
    login: '/login',
    logout: '/login',
    authCallback: '/auth/callback',
  },
  pagination: {
    defaultPageSize: 25,
    maxPageSize: 100,
  },
  features: {
    aiStudio: true,
    bulkImport: true,
    publishLogs: true,
    recurringEvents: true,
  },
} as const

export type AppConfig = typeof appConfig
