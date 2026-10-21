import * as Astronomy from 'astronomy-engine'
import { calculateChart } from 'celestine'
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-110m.json'
import { illuminationPercent, moonPhaseAngle, moonPhaseName } from './positions'
import { formatLongitude, longitudeToSign, normalizeDegrees, SIGNS, type SignName } from './signs'
import { lahiriAyanamsa, nakshatraFromLongitude, siderealLongitude } from './vedic'

export const ZODIAC_GLYPHS: Record<SignName, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
}

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Chiron: '⚷',
}

export type SkyPlanet = {
  name: string
  glyph: string
  longitude: number
  sign: SignName
  degreeFormatted: string
  retrograde: boolean
  speed: number
  house: number
  dignity: string
  x: number
  y: number
  labelX: number
  labelY: number
}

export type WheelAspectLine = {
  bodyA: string
  bodyB: string
  type: string
  orb: number
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  dash?: string
}

export type AcgCurve = {
  planet: string
  glyph: string
  kind: 'MC' | 'ASC' | 'DSC'
  color: string
  d: string
  labelX: number
  labelY: number
}

export type LiveSkySnapshot = {
  timestampIso: string
  timestampReadable: string
  sunSign: SignName
  sunFormatted: string
  moonSign: SignName
  moonFormatted: string
  moonPhase: string
  moonPhaseAngle: number
  moonIllumination: number
  nakshatra: {
    name: string
    lord: string
    pada: number
  }
  lahiriAyanamsa: string
  ascendantFormatted: string
  midheavenFormatted: string
  planets: SkyPlanet[]
  wheel: {
    size: number
    center: number
    zodiacSegments: {
      sign: SignName
      glyph: string
      startAngle: number
      midX: number
      midY: number
      tickX1: number
      tickY1: number
      tickX2: number
      tickY2: number
    }[]
    degreeTicks: { x1: number; y1: number; x2: number; y2: number; major: boolean }[]
    houseLines: { house: number; x1: number; y1: number; x2: number; y2: number; labelX: number; labelY: number }[]
    aspects: WheelAspectLine[]
  }
  astrocartography: {
    width: number
    height: number
    landPath: string
    graticulePath: string
    curves: AcgCurve[]
    cities: { name: string; x: number; y: number; tag: string }[]
  }
}

function polarToCartesian(cx: number, cy: number, r: number, eclipticDeg: number, ascOffset = 0): { x: number; y: number } {
  // Traditional astrology wheel places Ascendant at 9 o'clock (180° screen angle) and moves counter-clockwise
  const angleDeg = 180 - (eclipticDeg - ascOffset)
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: Number((cx + r * Math.cos(rad)).toFixed(2)),
    y: Number((cy + r * Math.sin(rad)).toFixed(2)),
  }
}

type CachedWorld = {
  landPath: string
  graticulePath: string
  width: number
  height: number
  projection: ReturnType<typeof geoNaturalEarth1>
  pathGen: ReturnType<typeof geoPath>
  cities: { name: string; x: number; y: number; tag: string }[]
}

let cachedWorldPaths: CachedWorld | null = null
let cachedLiveSnapshot: { minuteKey: string; snapshot: LiveSkySnapshot } | null = null

function getWorldPaths(): CachedWorld {
  if (cachedWorldPaths) return cachedWorldPaths
  const width = 640
  const height = 330
  const topo = landTopo as unknown as {
    type: 'Topology'
    objects: { land: unknown }
  }
  const landFeature = feature(topo as never, topo.objects.land as never)
  const projection = geoNaturalEarth1().fitExtent(
    [
      [12, 12],
      [width - 12, height - 12],
    ],
    landFeature as never,
  )
  const pathGen = geoPath(projection)
  const landPath = pathGen(landFeature as never) || ''
  const graticulePath = pathGen(geoGraticule10()) || ''
  const cities = [
    { name: 'New York', coords: [-74.006, 40.7128] as [number, number], tag: 'Venus trine' },
    { name: 'London', coords: [-0.1276, 51.5072] as [number, number], tag: 'Meridian' },
    { name: 'Karachi', coords: [67.0011, 24.8607] as [number, number], tag: 'Jupiter arc' },
    { name: 'Tokyo', coords: [139.6917, 35.6895] as [number, number], tag: 'Lunar horizon' },
  ].map((c) => {
    const pt = projection(c.coords) || [0, 0]
    return { name: c.name, x: Number(pt[0].toFixed(1)), y: Number(pt[1].toFixed(1)), tag: c.tag }
  })
  cachedWorldPaths = { landPath, graticulePath, width, height, projection, pathGen, cities }
  return cachedWorldPaths
}

export function buildLiveSkySnapshot(date = new Date()): LiveSkySnapshot {
  const minuteKey = date.toISOString().slice(0, 16)
  if (cachedLiveSnapshot && cachedLiveSnapshot.minuteKey === minuteKey) {
    return cachedLiveSnapshot.snapshot
  }
  const chart = calculateChart(
    {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
      timezone: 0,
      latitude: 30.0444, // Observatory reference (Cairo / Alexandria classical meridian)
      longitude: 31.2357,
    },
    { houseSystem: 'placidus' },
  )

  const size = 520
  const center = size / 2
  const outerR = 236
  const signRingInnerR = 198
  const houseInnerR = 92
  const planetR = 162
  const aspectR = 128

  const ascLon = chart.angles.ascendant.longitude

  const coreNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
  const rawPlanets = chart.planets.filter((p) => coreNames.includes(p.name))

  // Spread labels slightly if two planets are within 6° so glyphs never collide
  const sortedByLon = [...rawPlanets].sort((a, b) => a.longitude - b.longitude)
  const displayAngles = new Map<string, number>()
  for (let i = 0; i < sortedByLon.length; i++) {
    const cur = sortedByLon[i]
    let angle = cur.longitude
    if (i > 0) {
      const prevAngle = displayAngles.get(sortedByLon[i - 1].name) ?? sortedByLon[i - 1].longitude
      if (Math.abs(angle - prevAngle) < 6.5) {
        angle = prevAngle + 6.5
      }
    }
    displayAngles.set(cur.name, angle)
  }

  const planets: SkyPlanet[] = rawPlanets.map((p) => {
    const sign = longitudeToSign(p.longitude)
    const dispLon = displayAngles.get(p.name) ?? p.longitude
    const pos = polarToCartesian(center, center, planetR, p.longitude, ascLon)
    const labelPos = polarToCartesian(center, center, planetR - 20, dispLon, ascLon)
    return {
      name: p.name,
      glyph: PLANET_GLYPHS[p.name] || '•',
      longitude: p.longitude,
      sign,
      degreeFormatted: `${String(p.degree).padStart(2, '0')}°${String(p.minute).padStart(2, '0')}′`,
      retrograde: p.isRetrograde,
      speed: Number(p.longitudeSpeed.toFixed(3)),
      house: p.house,
      dignity: p.dignity?.state || 'Peregrine',
      x: pos.x,
      y: pos.y,
      labelX: labelPos.x,
      labelY: labelPos.y,
    }
  })

  const zodiacSegments = SIGNS.map((sign, idx) => {
    const startLon = idx * 30
    const midLon = startLon + 15
    const tickStart = polarToCartesian(center, center, signRingInnerR, startLon, ascLon)
    const tickEnd = polarToCartesian(center, center, outerR, startLon, ascLon)
    const mid = polarToCartesian(center, center, (outerR + signRingInnerR) / 2, midLon, ascLon)
    return {
      sign,
      glyph: ZODIAC_GLYPHS[sign],
      startAngle: startLon,
      midX: mid.x,
      midY: mid.y,
      tickX1: tickStart.x,
      tickY1: tickStart.y,
      tickX2: tickEnd.x,
      tickY2: tickEnd.y,
    }
  })

  const degreeTicks: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = []
  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 30 === 0 || deg % 10 === 0
    const p1 = polarToCartesian(center, center, signRingInnerR, deg, ascLon)
    const p2 = polarToCartesian(center, center, signRingInnerR - (major ? 7 : 4), deg, ascLon)
    degreeTicks.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, major })
  }

  const cusps = chart.houses.cusps.map((c: unknown) =>
    typeof c === 'number' ? c : (c as { longitude: number }).longitude,
  )
  const houseLines = cusps.map((cuspLon, idx) => {
    const nextLon = cusps[(idx + 1) % 12]
    let span = nextLon - cuspLon
    if (span < 0) span += 360
    const midLon = normalizeDegrees(cuspLon + span / 2)
    const p1 = polarToCartesian(center, center, houseInnerR, cuspLon, ascLon)
    const p2 = polarToCartesian(center, center, signRingInnerR - 6, cuspLon, ascLon)
    const lbl = polarToCartesian(center, center, houseInnerR + 18, midLon, ascLon)
    return {
      house: idx + 1,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      labelX: lbl.x,
      labelY: lbl.y,
    }
  })

  const aspectColors: Record<string, { color: string; dash?: string }> = {
    Conjunction: { color: '#f5d76e' },
    Trine: { color: '#34d399' },
    Sextile: { color: '#38bdf8', dash: '3 3' },
    Square: { color: '#fb7185' },
    Opposition: { color: '#f97316', dash: '5 3' },
  }

  const aspects: WheelAspectLine[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i]
      const b = planets[j]
      let diff = Math.abs(a.longitude - b.longitude)
      if (diff > 180) diff = 360 - diff
      const defs = [
        { type: 'Conjunction', exact: 0, maxOrb: 7 },
        { type: 'Opposition', exact: 180, maxOrb: 6.5 },
        { type: 'Trine', exact: 120, maxOrb: 6 },
        { type: 'Square', exact: 90, maxOrb: 6 },
        { type: 'Sextile', exact: 60, maxOrb: 4.5 },
      ]
      for (const def of defs) {
        const orb = Math.abs(diff - def.exact)
        if (orb <= def.maxOrb) {
          const p1 = polarToCartesian(center, center, aspectR, a.longitude, ascLon)
          const p2 = polarToCartesian(center, center, aspectR, b.longitude, ascLon)
          const style = aspectColors[def.type] || { color: '#f5d76e' }
          aspects.push({
            bodyA: a.name,
            bodyB: b.name,
            type: def.type,
            orb: Number(orb.toFixed(1)),
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            color: style.color,
            dash: style.dash,
          })
          break
        }
      }
    }
  }

  // Build D3-Geo Astrocartography curves for Sun, Moon, Venus, Jupiter, Saturn
  const world = getWorldPaths()
  const { projection, pathGen } = world
  const gmstDeg = normalizeDegrees(Astronomy.SiderealTime(date) * 15)

  const acgTargets: { name: string; color: string; kind: 'MC' | 'ASC' }[] = [
    { name: 'Sun', color: '#f5d76e', kind: 'MC' },
    { name: 'Venus', color: '#f472b6', kind: 'ASC' },
    { name: 'Jupiter', color: '#38bdf8', kind: 'MC' },
    { name: 'Moon', color: '#c084fc', kind: 'ASC' },
    { name: 'Saturn', color: '#fb923c', kind: 'MC' },
  ]

  const eps = (23.4393 * Math.PI) / 180
  const curves: AcgCurve[] = []

  for (const target of acgTargets) {
    const p = planets.find((x) => x.name === target.name)
    if (!p) continue
    const lam = (p.longitude * Math.PI) / 180
    // Approximate RA and Dec from ecliptic longitude (beta ≈ 0)
    const raDeg = normalizeDegrees((Math.atan2(Math.sin(lam) * Math.cos(eps), Math.cos(lam)) * 180) / Math.PI)
    const decRad = Math.asin(Math.sin(lam) * Math.sin(eps))

    let lonMeridian = raDeg - gmstDeg
    while (lonMeridian > 180) lonMeridian -= 360
    while (lonMeridian < -180) lonMeridian += 360

    const coords: [number, number][] = []
    for (let lat = -62; lat <= 62; lat += 4) {
      if (target.kind === 'MC') {
        coords.push([lonMeridian, lat])
      } else {
        const latRad = (lat * Math.PI) / 180
        const sinH = Math.min(0.95, Math.max(-0.95, -Math.tan(latRad) * Math.tan(decRad)))
        const hourAngleOffset = (Math.acos(sinH) * 180) / Math.PI
        let ascGeoLon = lonMeridian - hourAngleOffset
        while (ascGeoLon > 180) ascGeoLon -= 360
        while (ascGeoLon < -180) ascGeoLon += 360
        coords.push([ascGeoLon, lat])
      }
    }

    const lineFeature = {
      type: 'LineString' as const,
      coordinates: coords,
    }
    const d = pathGen(lineFeature as never) || ''
    const midCoord = coords[Math.floor(coords.length / 2)]
    const projectedMid = projection(midCoord) || [world.width / 2, world.height / 2]

    curves.push({
      planet: target.name,
      glyph: PLANET_GLYPHS[target.name] || '•',
      kind: target.kind,
      color: target.color,
      d,
      labelX: Number(projectedMid[0].toFixed(1)),
      labelY: Number((projectedMid[1] - 18).toFixed(1)),
    })
  }

  const sun = planets.find((p) => p.name === 'Sun')!
  const moon = planets.find((p) => p.name === 'Moon')!
  const phaseAngle = moonPhaseAngle(date)
  const sidMoon = siderealLongitude(moon.longitude, date)
  const nak = nakshatraFromLongitude(sidMoon)

  const snapshot: LiveSkySnapshot = {
    timestampIso: date.toISOString(),
    timestampReadable: date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
    sunSign: sun.sign,
    sunFormatted: formatLongitude(sun.longitude),
    moonSign: moon.sign,
    moonFormatted: formatLongitude(moon.longitude),
    moonPhase: moonPhaseName(phaseAngle),
    moonPhaseAngle: Number(phaseAngle.toFixed(1)),
    moonIllumination: illuminationPercent(phaseAngle),
    nakshatra: {
      name: nak.name,
      lord: nak.lord,
      pada: nak.pada,
    },
    lahiriAyanamsa: `${lahiriAyanamsa(date).toFixed(2)}°`,
    ascendantFormatted: formatLongitude(chart.angles.ascendant.longitude),
    midheavenFormatted: formatLongitude(chart.angles.midheaven.longitude),
    planets,
    wheel: {
      size,
      center,
      zodiacSegments,
      degreeTicks,
      houseLines,
      aspects: aspects.slice(0, 14),
    },
    astrocartography: {
      width: world.width,
      height: world.height,
      landPath: world.landPath,
      graticulePath: world.graticulePath,
      curves,
      cities: world.cities,
    },
  }

  cachedLiveSnapshot = { minuteKey, snapshot }
  return snapshot
}
