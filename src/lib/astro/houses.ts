import * as Astronomy from 'astronomy-engine'
import { normalizeDegrees } from './signs'

export type HouseCusps = {
  ascendant: number
  midheaven: number
  /** Index 1..12 */
  cusps: number[]
  system: 'equal' | 'whole-sign'
}

function obliquityDegrees(date: Date): number {
  const tilt = Astronomy.e_tilt(Astronomy.MakeTime(date))
  return tilt.tobl
}

function atan2Deg(y: number, x: number): number {
  return normalizeDegrees((Math.atan2(y, x) * 180) / Math.PI)
}

/** Local sidereal time in degrees (RAMC). */
export function ramcDegrees(date: Date, longitudeEast: number): number {
  const gastHours = Astronomy.SiderealTime(date)
  return normalizeDegrees(gastHours * 15 + longitudeEast)
}

export function tropicalAscendant(date: Date, latitude: number, longitudeEast: number): number {
  const ramc = (ramcDegrees(date, longitudeEast) * Math.PI) / 180
  const eps = (obliquityDegrees(date) * Math.PI) / 180
  const lat = (latitude * Math.PI) / 180

  // ASC = atan2( cos(RAMC), -(sin(RAMC)cos(ε) + tan(φ)sin(ε)) )
  const y = Math.cos(ramc)
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps))
  return atan2Deg(y, x)
}

export function tropicalMidheaven(date: Date, longitudeEast: number): number {
  const ramc = (ramcDegrees(date, longitudeEast) * Math.PI) / 180
  const eps = (obliquityDegrees(date) * Math.PI) / 180
  // MC = atan2( sin(RAMC)cos(ε), cos(RAMC) )
  return atan2Deg(Math.sin(ramc) * Math.cos(eps), Math.cos(ramc))
}

export function equalHouses(ascendant: number, midheaven: number): HouseCusps {
  const cusps = [0]
  for (let i = 0; i < 12; i++) {
    cusps.push(normalizeDegrees(ascendant + i * 30))
  }
  return { ascendant, midheaven, cusps, system: 'equal' }
}

export function wholeSignHouses(ascendant: number, midheaven: number): HouseCusps {
  const start = Math.floor(normalizeDegrees(ascendant) / 30) * 30
  const cusps = [0]
  for (let i = 0; i < 12; i++) {
    cusps.push(normalizeDegrees(start + i * 30))
  }
  return { ascendant, midheaven, cusps, system: 'whole-sign' }
}

export function houseOfLongitude(lon: number, cusps: number[]): number {
  const L = normalizeDegrees(lon)
  for (let h = 1; h <= 12; h++) {
    const a = cusps[h]
    const b = cusps[h === 12 ? 1 : h + 1]
    if (a <= b) {
      if (L >= a && L < b) return h
    } else {
      // wraps 0°
      if (L >= a || L < b) return h
    }
  }
  return 1
}

export function computeHouses(
  date: Date,
  latitude: number,
  longitudeEast: number,
  system: 'equal' | 'whole-sign' = 'equal',
): HouseCusps {
  const asc = tropicalAscendant(date, latitude, longitudeEast)
  const mc = tropicalMidheaven(date, longitudeEast)
  return system === 'whole-sign' ? wholeSignHouses(asc, mc) : equalHouses(asc, mc)
}
