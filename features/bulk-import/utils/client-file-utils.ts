'use client'

// Client-side file reading utility - only used in browser
export async function readFileAsText(file: File): Promise<string> {
  try {
    return await file.text()
  } catch (error) {
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
