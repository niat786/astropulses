export type ResultHighlight = {
  label: string
  value: string
  note?: string
}

export type ResultSection = {
  heading: string
  body?: string
  items?: { label: string; value: string }[]
}

export type ToolResult = {
  title: string
  summary: string
  highlights: ResultHighlight[]
  sections: ResultSection[]
  footnotes?: string[]
  verificationSeal?: string
  computedAtUtc?: string
  error?: string
}

export function errorResult(message: string): ToolResult {
  return {
    title: 'Could not calculate',
    summary: message,
    highlights: [],
    sections: [],
    error: message,
  }
}

export function okResult(partial: Omit<ToolResult, 'error'>): ToolResult {
  return { ...partial }
}
