import type { PostraImportItem } from '../schemas/bulk-import.schema'
import { postraImportItemSchema, CSV_HEADERS, REQUIRED_FIELDS } from '../schemas/bulk-import.schema'

// Parse JSON file content
export function parseJsonFile(content: string): PostraImportItem[] {
  try {
    const data = JSON.parse(content)
    
    // Handle both single item and array
    const items = Array.isArray(data) ? data : [data]
    
    // Validate each item
    return items.map((item, index) => {
      const result = postraImportItemSchema.safeParse(item)
      if (!result.success) {
        throw new Error(`Row ${index + 1}: ${result.error.message}`)
      }
      return result.data
    })
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Parse CSV file content
export function parseCsvFile(content: string): PostraImportItem[] {
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain headers and at least one data row')
  }
  
  // Parse headers
  const headers = parseCsvLine(lines[0])
  validateHeaders(headers)
  
  // Parse data rows
  const items: PostraImportItem[] = []
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCsvLine(lines[i])
      const item = mapCsvRowToItem(headers, values)
      const result = postraImportItemSchema.safeParse(item)
      
      if (!result.success) {
        throw new Error(`Row ${i + 1}: ${result.error.message}`)
      }
      
      items.push(result.data)
    } catch (error) {
      throw new Error(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  return items
}

// Parse a single CSV line handling quoted values
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Add last field
  result.push(current.trim())
  
  return result
}

// Validate CSV headers
function validateHeaders(headers: string[]): void {
  const missingRequired = REQUIRED_FIELDS.filter(field => !headers.includes(field))
  
  if (missingRequired.length > 0) {
    throw new Error(`Missing required columns: ${missingRequired.join(', ')}`)
  }
}

// Map CSV row to import item
function mapCsvRowToItem(headers: string[], values: string[]): Partial<PostraImportItem> {
  const item: any = {}
  
  headers.forEach((header, index) => {
    const value = values[index] || ''
    
    switch (header) {
      case 'title':
      case 'campaign_slug':
      case 'content_type':
      case 'post_status':
      case 'scheduled_date':
      case 'scheduled_time':
      case 'timezone':
      case 'caption':
      case 'hook':
      case 'cta':
      case 'media_filename':
      case 'format_group':
      case 'visual_prompt':
      case 'target_goal':
        item[header] = value || undefined
        break
        
      case 'platforms':
        // Parse comma-separated platforms
        item.platforms = value ? value.split(',').map(p => p.trim()).filter(p => p) : []
        break
        
      case 'hashtags':
        // Parse comma-separated hashtags
        item.hashtags = value ? value.split(',').map(h => h.trim()).filter(h => h) : []
        break
    }
  })
  
  return item
}

// Validate file type
export function validateFileType(file: File): 'json' | 'csv' | null {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (extension === 'json') return 'json'
  if (extension === 'csv') return 'csv'
  
  return null
}

