import * as Astronomy from 'astronomy-engine'
import { normalizeDegrees, longitudeToSign, formatLongitude, SIGNS, type SignName } from './signs'

/** Lahiri (Chitrapaksha) ayanamsa approximation. */
export function lahiriAyanamsa(date: Date): number {
  const time = Astronomy.MakeTime(date)
  const T = time.tt / 36525
  // IAU-based Lahiri-style polynomial (degrees)
  return normalizeDegrees(23.85 + 1.396971 * T - 0.000013 * T * T)
}

export function siderealLongitude(tropicalLon: number, date: Date): number {
  return normalizeDegrees(tropicalLon - lahiriAyanamsa(date))
}

const NAKSHATRAS = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
] as const

const NAKSHATRA_LORDS = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury',
] as const

export function nakshatraFromLongitude(siderealLon: number) {
  const lon = normalizeDegrees(siderealLon)
  const size = 360 / 27
  const index = Math.floor(lon / size)
  const within = lon - index * size
  const pada = Math.floor(within / (size / 4)) + 1
  const name = NAKSHATRAS[index]
  const lord = NAKSHATRA_LORDS[index % 9]
  return { name, lord, pada, index, degreeInNakshatra: within }
}

export function vedicRashi(tropicalMoonLon: number, date: Date): {
  rashi: SignName
  longitude: number
  formatted: string
  nakshatra: ReturnType<typeof nakshatraFromLongitude>
} {
  const lon = siderealLongitude(tropicalMoonLon, date)
  return {
    rashi: longitudeToSign(lon),
    longitude: lon,
    formatted: formatLongitude(lon),
    nakshatra: nakshatraFromLongitude(lon),
  }
}

export function vedicLagna(tropicalAsc: number, date: Date): {
  lagna: SignName
  longitude: number
  formatted: string
} {
  const lon = siderealLongitude(tropicalAsc, date)
  return {
    lagna: longitudeToSign(lon),
    longitude: lon,
    formatted: formatLongitude(lon),
  }
}

export { SIGNS }
