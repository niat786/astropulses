import type { Child } from 'hono/jsx'

// Matches [label](/internal/path#optional-hash). External URLs are deliberately not supported.
const LINK_PATTERN = /\[([^\]]+)\]\((\/[a-z0-9\-/#]*)\)/g

/** Renders `[label](/path)` markers in content strings as internal links. */
export function renderInline(text: string): Child[] {
  const out: Child[] = []
  let last = 0
  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0
    if (index > last) out.push(text.slice(last, index))
    out.push(
      <a href={match[2]} class="inline-link">
        {match[1]}
      </a>,
    )
    last = index + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Plain-text version for structured data and meta tags. */
export function stripInlineLinks(text: string): string {
  return text.replace(LINK_PATTERN, '$1')
}
