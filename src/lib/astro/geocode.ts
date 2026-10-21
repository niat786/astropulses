import { lookupOfflineCity } from './cities'

export type GeoPlace = {
  name: string
  latitude: number
  longitude: number
  timezone: string
  country?: string
  admin1?: string
}

type OpenMeteoResult = {
  name: string
  latitude: number
  longitude: number
  timezone?: string
  country?: string
  admin1?: string
}

type OpenMeteoResponse = {
  results?: OpenMeteoResult[]
}

const geoCache = new Map<string, GeoPlace>()

export async function geocodePlace(query: string): Promise<GeoPlace | { error: string }> {
  const q = query.trim()
  if (!q) return { error: 'Enter a place of birth (city and country work best).' }

  const key = q.toLowerCase()
  const cached = geoCache.get(key)
  if (cached) return cached

  // Fast instant match for common world cities (zero external latency)
  const offline = lookupOfflineCity(q)
  if (offline) {
    geoCache.set(key, offline)
    return offline
  }

  // Strip country suffix if Open-Meteo needs just city name
  const cityOnly = q.split(',')[0].trim()

  for (const candidate of [q, cityOnly]) {
    if (!candidate) continue
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', candidate)
    url.searchParams.set('count', '1')
    url.searchParams.set('language', 'en')
    url.searchParams.set('format', 'json')

    try {
      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        const data = (await res.json()) as OpenMeteoResponse
        const hit = data.results?.[0]
        if (hit) {
          const label = [hit.name, hit.admin1, hit.country].filter(Boolean).join(', ')
          const place: GeoPlace = {
            name: label,
            latitude: hit.latitude,
            longitude: hit.longitude,
            timezone: hit.timezone || 'UTC',
            country: hit.country,
            admin1: hit.admin1,
          }
          geoCache.set(key, place)
          return place
        }
      }
    } catch {
      // Fall through to next candidate or fallback
    }
  }

  return { error: `No match found for “${q}”. Try entering a major city name (e.g. London, New York, Karachi).` }
}
