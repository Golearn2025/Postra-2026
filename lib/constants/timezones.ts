/**
 * IANA Timezone Constants
 * Commonly used timezones for organization configuration
 */

export const COMMON_TIMEZONES = [
  // Major timezones
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Bucharest',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  
  // Additional common timezones
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Warsaw',
  'Europe/Prague',
  'Europe/Vienna',
  'Europe/Zurich',
  'Europe/Athens',
  'Europe/Istanbul',
  'Asia/Hong_Kong',
  'Asia/Seoul',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Manila',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
] as const

export type Timezone = typeof COMMON_TIMEZONES[number]

export function isValidTimezone(value: string): value is Timezone {
  return COMMON_TIMEZONES.includes(value as Timezone)
}

export function formatTimezoneForDisplay(timezone: Timezone): string {
  // Format timezone names for better display
  return timezone.replace('_', ' ').replace(/\//g, ' - ')
}
