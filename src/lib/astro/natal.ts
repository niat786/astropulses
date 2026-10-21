import type { ToolField } from '../../data/tools'
import type { ParsedPerson } from './parseInput'
import { geocodePlace, type GeoPlace } from './geocode'
import { zonedLocalToUtc, formatUtcIso } from './timezone'
import { planetPositions, type PlanetPosition, type PlanetId } from './positions'
import { computeHouses, houseOfLongitude, type HouseCusps } from './houses'
import { findAspects, type AspectHit } from './aspects'
import {
  formatLongitude,
  longitudeToSign,
  SIGN_ELEMENT,
  SIGN_MODALITY,
  SIGN_RULER,
  type SignName,
} from './signs'

export type NatalChart = {
  name?: string
  dateLocal: string
  dateUtc: Date
  dateUtcIso: string
  unknownTime: boolean
  place?: GeoPlace
  planets: PlanetPosition[]
  houses?: HouseCusps
  aspects: AspectHit[]
  sunSign: SignName
  moonSign: SignName
  risingSign?: SignName
}

function needsGeo(fields: ToolField[]): boolean {
  return fields.includes('place') || fields.includes('time')
}

export async function resolveBirthMoment(
  person: ParsedPerson,
  fields: ToolField[],
): Promise<{ date: Date; place?: GeoPlace; error?: string }> {
  const requirePlace = fields.includes('place') || fields.includes('time')

  if (!requirePlace) {
    // Date-only: use noon UTC
    return {
      date: new Date(Date.UTC(person.year, person.month - 1, person.day, 12, 0, 0)),
    }
  }

  if (!person.place) {
    return { date: new Date(), error: 'Enter a place of birth so we can convert local time accurately.' }
  }

  const place = await geocodePlace(person.place)
  if ('error' in place) {
    return { date: new Date(), error: place.error }
  }

  const date = zonedLocalToUtc(
    person.year,
    person.month,
    person.day,
    person.unknownTime ? 12 : person.hour,
    person.unknownTime ? 0 : person.minute,
    place.timezone,
  )

  return { date, place }
}

export async function buildNatalChart(
  person: ParsedPerson,
  fields: ToolField[],
  opts?: { houseSystem?: 'equal' | 'whole-sign' },
): Promise<NatalChart | { error: string }> {
  const resolved = await resolveBirthMoment(person, fields)
  if (resolved.error) return { error: resolved.error }

  const planets = planetPositions(resolved.date)
  const sun = planets.find((p) => p.id === 'Sun')!
  const moon = planets.find((p) => p.id === 'Moon')!

  let houses: HouseCusps | undefined
  let risingSign: SignName | undefined
  if (resolved.place && !person.unknownTime) {
    houses = computeHouses(
      resolved.date,
      resolved.place.latitude,
      resolved.place.longitude,
      opts?.houseSystem ?? 'equal',
    )
    risingSign = longitudeToSign(houses.ascendant)
  } else if (resolved.place && person.unknownTime) {
    // Still compute noon chart houses with a caveat
    houses = computeHouses(
      resolved.date,
      resolved.place.latitude,
      resolved.place.longitude,
      opts?.houseSystem ?? 'equal',
    )
    risingSign = longitudeToSign(houses.ascendant)
  }

  const aspects = findAspects(planets, true)

  return {
    name: person.name,
    dateLocal: `${person.year}-${String(person.month).padStart(2, '0')}-${String(person.day).padStart(2, '0')} ${String(person.hour).padStart(2, '0')}:${String(person.minute).padStart(2, '0')}${person.unknownTime ? ' (time unknown · noon used)' : ''}`,
    dateUtc: resolved.date,
    dateUtcIso: formatUtcIso(resolved.date),
    unknownTime: person.unknownTime,
    place: resolved.place,
    planets,
    houses,
    aspects,
    sunSign: longitudeToSign(sun.longitude),
    moonSign: longitudeToSign(moon.longitude),
    risingSign,
  }
}

export function planetHouse(chart: NatalChart, id: PlanetId): number | undefined {
  if (!chart.houses) return undefined
  const p = chart.planets.find((x) => x.id === id)
  if (!p) return undefined
  return houseOfLongitude(p.longitude, chart.houses.cusps)
}

export function elementCounts(chart: NatalChart) {
  const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  const counts = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const id of ids) {
    const p = chart.planets.find((x) => x.id === id)!
    counts[SIGN_ELEMENT[longitudeToSign(p.longitude)]]++
  }
  return counts
}

export function modalityCounts(chart: NatalChart) {
  const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  const counts = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  for (const id of ids) {
    const p = chart.planets.find((x) => x.id === id)!
    counts[SIGN_MODALITY[longitudeToSign(p.longitude)]]++
  }
  return counts
}

export function chartRuler(chart: NatalChart): string | undefined {
  if (!chart.risingSign) return undefined
  return SIGN_RULER[chart.risingSign]
}

export function formatPlanetLine(p: PlanetPosition, house?: number): string {
  const rx = p.retrograde ? ' ℞' : ''
  const h = house ? ` · house ${house}` : ''
  return `${formatLongitude(p.longitude)}${rx}${h}`
}

export { needsGeo }
