let secretKey: string | undefined

/** Set from the HMAC_SECRET Worker secret (`wrangler secret put HMAC_SECRET`, or `.dev.vars` locally). */
export function setSecuritySecret(secret: string | undefined) {
  if (secret) secretKey = secret
}

export function hasSecuritySecret(): boolean {
  return Boolean(secretKey)
}

// Sliding-window in-memory rate limiter per IP (protects against automated scraping/cloning)
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

async function hmacHex(message: string): Promise<string> {
  if (!secretKey) throw new Error('HMAC_SECRET is not configured')
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generates a short-lived HMAC-SHA256 token bound to a specific tool slug and 30-minute time bucket.
 * Because the secret lives exclusively on the Cloudflare Worker server, a static scraper or site
 * thief cannot forge valid tokens or run calculations client-side.
 */
export async function generateCalculationToken(slug: string, nowMs = Date.now()): Promise<string> {
  const bucket = Math.floor(nowMs / (30 * 60 * 1000))
  const sig = (await hmacHex(`${slug}:${bucket}`)).slice(0, 24)
  return `${bucket}.${sig}`
}

/**
 * Verifies the HMAC calculation token across the current and previous 4 buckets (up to 2 hours).
 */
export async function verifyCalculationToken(slug: string, token: string, nowMs = Date.now()): Promise<boolean> {
  if (!token || !token.includes('.')) return false
  const [bucketRaw, sigRaw] = token.split('.')
  const bucket = Number(bucketRaw)
  if (!Number.isFinite(bucket) || !sigRaw || sigRaw.length !== 24) return false

  const currentBucket = Math.floor(nowMs / (30 * 60 * 1000))
  if (Math.abs(currentBucket - bucket) > 4) return false

  const expected = (await hmacHex(`${slug}:${bucket}`)).slice(0, 24)
  if (sigRaw.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= sigRaw.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Generates a deterministic short verification seal for a server-calculated result.
 */
export async function createCalculationSeal(slug: string, summary: string, nowMs = Date.now()): Promise<string> {
  const dayBucket = new Date(nowMs).toISOString().slice(0, 10)
  const hash = (await hmacHex(`seal:${slug}:${dayBucket}:${summary}`)).slice(0, 10).toUpperCase()
  return `AP-${hash}`
}

/**
 * Checks rate limit for a client IP address (e.g. 90 calculations per minute).
 */
export function checkRateLimit(ip: string, limit = 90, windowMs = 60_000): boolean {
  const now = Date.now()
  const existing = rateBuckets.get(ip)
  if (!existing || now > existing.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  existing.count += 1
  return existing.count <= limit
}

const SCRAPER_UA_PATTERNS = [
  /httrack/i,
  /sitesucker/i,
  /webzip/i,
  /saveweb2zip/i,
  /cyotek/i,
  /webcopier/i,
  /teleport/i,
  /offline explorer/i,
]

export function isBlockedScraperUserAgent(ua: string | undefined | null): boolean {
  if (!ua) return false
  return SCRAPER_UA_PATTERNS.some((re) => re.test(ua))
}
