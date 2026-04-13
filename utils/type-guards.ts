/**
 * Type guards for runtime validation
 */

export function isNonNullString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.length > 0
}

export function isNonNullStringArray(value: (string | null)[] | null | undefined): value is string[] {
  return Array.isArray(value) && value.every(isNonNullString)
}

export function isValidIndex(index: string | null | undefined): index is string {
  return typeof index === 'string' && index !== 'null'
}

export function sanitizeString(value: string | null | undefined): string {
  return value || ''
}

export function sanitizeStringArray(value: (string | null)[] | null | undefined): string[] {
  return (value || []).filter(isNonNullString)
}
