import * as Astronomy from 'astronomy-engine'
import { normalizeDegrees } from './signs'

export type PlanetId =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'NorthNode'
  | 'SouthNode'
  | 'Chiron'

export type PlanetPosition = {
  id: PlanetId
  name: string
  longitude: number
  latitude: number
  retrograde: boolean
}

const CLASSIC_BODIES: { id: PlanetId; body: Astronomy.Body }[] = [
  { id: 'Sun', body: Astronomy.Body.Sun },
  { id: 'Moon', body: Astronomy.Body.Moon },
  { id: 'Mercury', body: Astronomy.Body.Mercury },
  { id: 'Venus', body: Astronomy.Body.Venus },
  { id: 'Mars', body: Astronomy.Body.Mars },
  { id: 'Jupiter', body: Astronomy.Body.Jupiter },
  { id: 'Saturn', body: Astronomy.Body.Saturn },
  { id: 'Uranus', body: Astronomy.Body.Uranus },
  { id: 'Neptune', body: Astronomy.Body.Neptune },
  { id: 'Pluto', body: Astronomy.Body.Pluto },
]

function eclipticOf(body: Astronomy.Body, date: Date): { lon: number; lat: number } {
  if (body === Astronomy.Body.Sun) {
    const vec = Astronomy.GeoVector(body, date, true)
    const ecl = Astronomy.Ecliptic(vec)
    return { lon: normalizeDegrees(ecl.elon), lat: ecl.elat }
  }
  if (body === Astronomy.Body.Moon) {
    const moon = Astronomy.EclipticGeoMoon(date)
    return { lon: normalizeDegrees(moon.lon), lat: moon.lat }
  }
  const lon = Astronomy.EclipticLongitude(body, date)
  const vec = Astronomy.GeoVector(body, date, true)
  const ecl = Astronomy.Ecliptic(vec)
  return { lon: normalizeDegrees(lon), lat: ecl.elat }
}

function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false
  const t0 = date.getTime()
  const a = eclipticOf(body, new Date(t0)).lon
  const b = eclipticOf(body, new Date(t0 + 12 * 3600 * 1000)).lon
  let delta = b - a
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return delta < 0
}

/** Mean lunar node (North Node) approximation from Meeus-style formula via astronomy. */
export function meanNorthNodeLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date)
  // Julian centuries from J2000
  const T = time.tt / 36525
  // Meeus mean longitude of ascending node (degrees)
  const omega =
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467000
  return normalizeDegrees(omega)
}

export function planetPositions(date: Date): PlanetPosition[] {
  const planets: PlanetPosition[] = CLASSIC_BODIES.map(({ id, body }) => {
    const { lon, lat } = eclipticOf(body, date)
    return {
      id,
      name: id,
      longitude: lon,
      latitude: lat,
      retrograde: isRetrograde(body, date),
    }
  })

  const nn = meanNorthNodeLongitude(date)
  planets.push({
    id: 'NorthNode',
    name: 'North Node',
    longitude: nn,
    latitude: 0,
    retrograde: true,
  })
  planets.push({
    id: 'SouthNode',
    name: 'South Node',
    longitude: normalizeDegrees(nn + 180),
    latitude: 0,
    retrograde: true,
  })

  // Chiron: coarse mean longitude model (good enough for sign placement)
  const time = Astronomy.MakeTime(date)
  const T = time.tt / 36525
  const chironLon = normalizeDegrees(209.0715 + 50.378 * (time.tt / 365.25) + 0.012 * T)
  planets.push({
    id: 'Chiron',
    name: 'Chiron',
    longitude: chironLon,
    latitude: 0,
    retrograde: false,
  })

  return planets
}

export function getPlanet(planets: PlanetPosition[], id: PlanetId): PlanetPosition {
  const found = planets.find((p) => p.id === id)
  if (!found) throw new Error(`Missing planet ${id}`)
  return found
}

export function sunLongitude(date: Date): number {
  return eclipticOf(Astronomy.Body.Sun, date).lon
}

export function moonLongitude(date: Date): number {
  return eclipticOf(Astronomy.Body.Moon, date).lon
}

export function moonPhaseAngle(date: Date): number {
  return normalizeDegrees(moonLongitude(date) - sunLongitude(date))
}

export function moonPhaseName(angle: number): string {
  const a = normalizeDegrees(angle)
  if (a < 22.5 || a >= 337.5) return 'New Moon'
  if (a < 67.5) return 'Waxing Crescent'
  if (a < 112.5) return 'First Quarter'
  if (a < 157.5) return 'Waxing Gibbous'
  if (a < 202.5) return 'Full Moon'
  if (a < 247.5) return 'Waning Gibbous'
  if (a < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}

export function illuminationPercent(angle: number): number {
  const a = (normalizeDegrees(angle) * Math.PI) / 180
  return Math.round(((1 - Math.cos(a)) / 2) * 100)
}
