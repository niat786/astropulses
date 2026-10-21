import { normalizeDegrees } from './signs'
import type { PlanetPosition } from './positions'

export type AspectName =
  | 'Conjunction'
  | 'Sextile'
  | 'Square'
  | 'Trine'
  | 'Opposition'
  | 'Quincunx'
  | 'Semi-sextile'

export type AspectHit = {
  a: string
  b: string
  type: AspectName
  angle: number
  orb: number
  exact: number
}

const ASPECT_DEFS: { type: AspectName; exact: number; orb: number }[] = [
  { type: 'Conjunction', exact: 0, orb: 8 },
  { type: 'Opposition', exact: 180, orb: 8 },
  { type: 'Trine', exact: 120, orb: 7 },
  { type: 'Square', exact: 90, orb: 7 },
  { type: 'Sextile', exact: 60, orb: 5 },
  { type: 'Quincunx', exact: 150, orb: 3 },
  { type: 'Semi-sextile', exact: 30, orb: 2 },
]

function angularDistance(a: number, b: number): number {
  let d = Math.abs(normalizeDegrees(a) - normalizeDegrees(b))
  if (d > 180) d = 360 - d
  return d
}

export function findAspects(planets: PlanetPosition[], majorOnly = false): AspectHit[] {
  const defs = majorOnly
    ? ASPECT_DEFS.filter((d) => !['Quincunx', 'Semi-sextile'].includes(d.type))
    : ASPECT_DEFS

  const core = planets.filter((p) =>
    ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(
      p.id,
    ),
  )

  const hits: AspectHit[] = []
  for (let i = 0; i < core.length; i++) {
    for (let j = i + 1; j < core.length; j++) {
      const dist = angularDistance(core[i].longitude, core[j].longitude)
      for (const def of defs) {
        const orb = Math.abs(dist - def.exact)
        if (orb <= def.orb) {
          hits.push({
            a: core[i].name,
            b: core[j].name,
            type: def.type,
            angle: dist,
            orb,
            exact: def.exact,
          })
          break
        }
      }
    }
  }
  return hits.sort((x, y) => x.orb - y.orb)
}

export function findAspectPatterns(aspects: AspectHit[]): string[] {
  const patterns: string[] = []
  const byType = (t: AspectName) => aspects.filter((a) => a.type === t)

  // Grand Trine: 3 planets all trine
  const trines = byType('Trine')
  if (trines.length >= 3) {
    patterns.push('Grand Trine candidate: several trine aspects link planets in the same element family.')
  }

  // T-square: opposition + two squares
  const opps = byType('Opposition')
  const squares = byType('Square')
  for (const opp of opps) {
    const involved = new Set([opp.a, opp.b])
    const apex = squares.filter(
      (s) =>
        (involved.has(s.a) && !involved.has(s.b)) || (involved.has(s.b) && !involved.has(s.a)),
    )
    if (apex.length >= 2) {
      patterns.push(`T-Square involving ${opp.a}–${opp.b} opposition with square pressure.`)
      break
    }
  }

  // Stellium hint handled elsewhere (same sign cluster)
  if (patterns.length === 0 && aspects.length >= 6) {
    patterns.push('A busy aspect web — several planets are tightly linked.')
  }
  if (patterns.length === 0) {
    patterns.push('No classic Grand Trine or T-Square stood out within standard orbs.')
  }
  return patterns
}
