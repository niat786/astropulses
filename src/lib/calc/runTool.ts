import type { Tool } from '../../data/tools'
import type { ParsedToolInput } from '../astro/parseInput'
import { buildNatalChart, formatPlanetLine, elementCounts, modalityCounts, chartRuler, planetHouse, type NatalChart } from '../astro/natal'
import { chineseZodiac } from '../astro/chinese'
import { vedicRashi, vedicLagna, lahiriAyanamsa, siderealLongitude } from '../astro/vedic'
import {
  formatLongitude,
  longitudeToSign,
  SIGN_BLURBS,
  SIGN_ELEMENT,
  SIGN_MODALITY,
  SIGN_RULER,
  normalizeDegrees,
  type SignName,
} from '../astro/signs'
import {
  getPlanet,
  moonPhaseAngle,
  moonPhaseName,
  illuminationPercent,
  planetPositions,
  sunLongitude,
  type PlanetId,
} from '../astro/positions'
import { findAspects, findAspectPatterns } from '../astro/aspects'
import { houseOfLongitude } from '../astro/houses'
import { errorResult, okResult, type ToolResult } from './types'
import { SPECIALIZED_REGISTRY, domainSmartCalculator } from './specializedCalculators'

function metaFootnotes(chart: Awaited<ReturnType<typeof buildNatalChart>>): string[] {
  if ('error' in chart) return []
  const notes = [
    `Calculated for ${chart.dateLocal}${chart.place ? ` · ${chart.place.name}` : ''}`,
    `UTC moment: ${chart.dateUtcIso}`,
    'Tropical zodiac · Equal house system (when rising/houses shown)',
  ]
  if (chart.unknownTime) {
    notes.push('Birth time unknown — noon local was used. Rising sign and houses may be inaccurate.')
  }
  return notes
}

function signResult(title: string, sign: SignName, role: string, extra?: { label: string; value: string }[]): ToolResult {
  return okResult({
    title,
    summary: `Your ${role} is ${sign}. ${SIGN_BLURBS[sign]}`,
    highlights: [
      { label: role, value: sign, note: `${SIGN_ELEMENT[sign]} · ${SIGN_MODALITY[sign]}` },
      { label: 'Traditional ruler', value: SIGN_RULER[sign] },
      ...(extra ?? []).map((e) => ({ label: e.label, value: e.value })),
    ],
    sections: [
      {
        heading: `What ${sign} ${role.toLowerCase()} tends to emphasize`,
        body: SIGN_BLURBS[sign],
      },
    ],
  })
}

async function natalOrError(input: ParsedToolInput, tool: Tool): Promise<{ error: string } | { chart: NatalChart }> {
  const chart = await buildNatalChart(input.person, tool.fields)
  if ('error' in chart) return { error: chart.error }
  return { chart }
}

function planetFinder(toolName: string, planetId: PlanetId, role: string) {
  return async (input: ParsedToolInput, tool: Tool): Promise<ToolResult> => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const p = getPlanet(chart.planets, planetId)
    const sign = longitudeToSign(p.longitude)
    const house = planetHouse(chart, planetId)
    const result = signResult(`${tool.name} result`, sign, role, [
      { label: 'Exact position', value: `${formatLongitude(p.longitude)}${p.retrograde ? ' ℞' : ''}` },
      ...(house ? [{ label: 'House', value: String(house) }] : []),
    ])
    result.footnotes = metaFootnotes(chart)
    result.sections.push({
      heading: 'Placement details',
      items: [
        { label: planetId, value: formatPlanetLine(p, house) },
        { label: 'Element', value: SIGN_ELEMENT[sign] },
        { label: 'Modality', value: SIGN_MODALITY[sign] },
      ],
    })
    return result
  }
}

async function bigThree(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  if (!chart.risingSign) {
    return errorResult('Rising sign needs a birth time and place. Uncheck “I don’t know my birth time” or add a city.')
  }
  return okResult({
    title: 'Your Big Three',
    summary: `Sun in ${chart.sunSign}, Moon in ${chart.moonSign}, Rising in ${chart.risingSign}.`,
    highlights: [
      { label: 'Sun', value: chart.sunSign, note: SIGN_BLURBS[chart.sunSign] },
      { label: 'Moon', value: chart.moonSign, note: SIGN_BLURBS[chart.moonSign] },
      { label: 'Rising', value: chart.risingSign, note: SIGN_BLURBS[chart.risingSign] },
    ],
    sections: [
      {
        heading: 'How to read them together',
        body: `Sun describes core direction (${chart.sunSign}), Moon describes emotional weather (${chart.moonSign}), and Rising shapes first impressions (${chart.risingSign}).`,
      },
      {
        heading: 'Positions',
        items: [
          { label: 'Sun', value: formatPlanetLine(getPlanet(chart.planets, 'Sun')) },
          { label: 'Moon', value: formatPlanetLine(getPlanet(chart.planets, 'Moon')) },
          {
            label: 'Ascendant',
            value: formatLongitude(chart.houses!.ascendant),
          },
        ],
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function fullPlanetTable(input: ParsedToolInput, tool: Tool, title: string): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const ids: PlanetId[] = [
    'Sun',
    'Moon',
    'Mercury',
    'Venus',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Pluto',
    'NorthNode',
    'Chiron',
  ]
  return okResult({
    title,
    summary: `Planetary positions for ${chart.dateLocal}${chart.place ? ` in ${chart.place.name}` : ''}.`,
    highlights: [
      { label: 'Sun', value: chart.sunSign },
      { label: 'Moon', value: chart.moonSign },
      ...(chart.risingSign ? [{ label: 'Rising', value: chart.risingSign }] : []),
    ],
    sections: [
      {
        heading: 'Planets',
        items: ids.map((id) => {
          const p = getPlanet(chart.planets, id)
          return { label: p.name, value: formatPlanetLine(p, planetHouse(chart, id)) }
        }),
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function housesResult(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  if (!chart.houses) return errorResult('Houses require birth place (and ideally birth time).')
  return okResult({
    title: 'House cusps',
    summary: `Ascendant ${formatLongitude(chart.houses.ascendant)} · Midheaven ${formatLongitude(chart.houses.midheaven)} (${chart.houses.system} houses).`,
    highlights: [
      { label: 'Ascendant', value: formatLongitude(chart.houses.ascendant) },
      { label: 'Midheaven (MC)', value: formatLongitude(chart.houses.midheaven) },
      { label: 'IC', value: formatLongitude(normalizeDegrees(chart.houses.midheaven + 180)) },
    ],
    sections: [
      {
        heading: 'Twelve house cusps',
        items: Array.from({ length: 12 }, (_, i) => ({
          label: `House ${i + 1}`,
          value: formatLongitude(chart.houses!.cusps[i + 1]),
        })),
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function aspectsResult(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const aspects = findAspects(chart.planets, false)
  return okResult({
    title: 'Natal aspects',
    summary: aspects.length
      ? `Found ${aspects.length} aspects within standard orbs.`
      : 'No major aspects within standard orbs.',
    highlights: aspects.slice(0, 3).map((a) => ({
      label: a.type,
      value: `${a.a}–${a.b}`,
      note: `orb ${a.orb.toFixed(1)}°`,
    })),
    sections: [
      {
        heading: 'Aspect list',
        items: aspects.slice(0, 24).map((a) => ({
          label: `${a.a} ${a.type} ${a.b}`,
          value: `${a.angle.toFixed(1)}° (orb ${a.orb.toFixed(1)}°)`,
        })),
      },
      {
        heading: 'Patterns',
        body: findAspectPatterns(aspects).join(' '),
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

function balanceFromCounts(title: string, counts: Record<string, number>, summaryLead: string): ToolResult {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = entries[0]
  return okResult({
    title,
    summary: `${summaryLead} Strongest: ${top[0]} (${top[1]}).`,
    highlights: entries.map(([k, v]) => ({ label: k, value: String(v) })),
    sections: [
      {
        heading: 'Counts (personal + social planets)',
        items: entries.map(([k, v]) => ({ label: k, value: `${v} planet${v === 1 ? '' : 's'}` })),
      },
    ],
  })
}

async function compatibility(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  if (!input.partner) return errorResult('Enter both people’s birth details.')
  const a = await buildNatalChart(input.person, tool.fields.filter((f) => !f.startsWith('partner')) as typeof tool.fields)
  const partnerFields = tool.fields.includes('partnerPlace')
    ? (['date', 'time', 'place'] as const)
    : (['date'] as const)
  const bPerson = input.partner
  const b = await buildNatalChart(
    bPerson,
    [...partnerFields],
  )
  if ('error' in a) return errorResult(a.error)
  if ('error' in b) return errorResult(b.error)

  const elementScore = SIGN_ELEMENT[a.sunSign] === SIGN_ELEMENT[b.sunSign] ? 25 : 12
  const modalityScore = SIGN_MODALITY[a.sunSign] === SIGN_MODALITY[b.sunSign] ? 15 : 8
  const moonBlend =
    SIGN_ELEMENT[a.moonSign] === SIGN_ELEMENT[b.moonSign]
      ? 30
      : Math.abs(
            ['Fire', 'Earth', 'Air', 'Water'].indexOf(SIGN_ELEMENT[a.moonSign]) -
              ['Fire', 'Earth', 'Air', 'Water'].indexOf(SIGN_ELEMENT[b.moonSign]),
          ) === 2
        ? 18
        : 12
  let risingScore = 10
  if (a.risingSign && b.risingSign) {
    risingScore = a.risingSign === b.risingSign ? 20 : SIGN_ELEMENT[a.risingSign] === SIGN_ELEMENT[b.risingSign] ? 15 : 10
  }
  const score = Math.min(98, elementScore + modalityScore + moonBlend + risingScore)

  return okResult({
    title: 'Compatibility snapshot',
    summary: `${a.name || 'Person A'} (${a.sunSign}) & ${b.name || 'Person B'} (${b.sunSign}) — score ${score}/100 (symbolic, not predictive).`,
    highlights: [
      { label: 'Score', value: `${score}/100` },
      { label: 'Sun signs', value: `${a.sunSign} · ${b.sunSign}` },
      { label: 'Moon signs', value: `${a.moonSign} · ${b.moonSign}` },
    ],
    sections: [
      {
        heading: 'Side by side',
        items: [
          { label: 'A Sun / Moon / Rising', value: `${a.sunSign} / ${a.moonSign} / ${a.risingSign ?? '—'}` },
          { label: 'B Sun / Moon / Rising', value: `${b.sunSign} / ${b.moonSign} / ${b.risingSign ?? '—'}` },
        ],
      },
      {
        heading: 'How this score is built',
        body: 'Sun element/modality blend, Moon element rapport, and Rising similarity. Use it as a conversation starter, not a verdict.',
      },
    ],
    footnotes: [...metaFootnotes(a), ...metaFootnotes(b)],
  })
}

function momentFromInput(input: ParsedToolInput, useNow: boolean): Date {
  if (useNow) return new Date()
  return new Date(Date.UTC(input.person.year, input.person.month - 1, input.person.day, 12, 0, 0))
}

async function currentSky(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const useNow = tool.slug.includes('current') || tool.slug.includes('today')
  const when = momentFromInput(input, useNow)
  const planets = planetPositions(when)
  return okResult({
    title: tool.name,
    summary: `Sky positions for ${when.toISOString().slice(0, 16).replace('T', ' ')} UTC.`,
    highlights: [
      { label: 'Sun', value: formatLongitude(getPlanet(planets, 'Sun').longitude) },
      { label: 'Moon', value: formatLongitude(getPlanet(planets, 'Moon').longitude) },
      { label: 'Mercury', value: formatLongitude(getPlanet(planets, 'Mercury').longitude) },
    ],
    sections: [
      {
        heading: 'Planets',
        items: planets
          .filter((p) => !['SouthNode'].includes(p.id))
          .map((p) => ({ label: p.name, value: formatPlanetLine(p) })),
      },
    ],
    footnotes: ['Tropical positions calculated on the server with astronomy-engine.'],
  })
}

async function retrogradeCalendar(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const year = input.person.year
  const bodies: PlanetId[] = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  const events: string[] = []
  let prev = planetPositions(new Date(Date.UTC(year - 1, 11, 31, 12)))
  for (let day = 0; day < 366; day++) {
    const date = new Date(Date.UTC(year, 0, 1 + day, 12))
    if (date.getUTCFullYear() !== year) break
    const cur = planetPositions(date)
    for (const id of bodies) {
      const a = getPlanet(prev, id)
      const b = getPlanet(cur, id)
      if (!a.retrograde && b.retrograde) {
        events.push(`${date.toISOString().slice(0, 10)} · ${id} stations retrograde (${formatLongitude(b.longitude)})`)
      }
      if (a.retrograde && !b.retrograde) {
        events.push(`${date.toISOString().slice(0, 10)} · ${id} stations direct (${formatLongitude(b.longitude)})`)
      }
    }
    prev = cur
  }
  return okResult({
    title: tool.name,
    summary: `${events.length} Mercury–Saturn station events in ${year}.`,
    highlights: events.slice(0, 3).map((e) => {
      const [date, rest] = e.split(' · ')
      return { label: date, value: rest }
    }),
    sections: [
      {
        heading: `${year} retrograde stations`,
        items: events.map((e) => {
          const [date, rest] = e.split(' · ')
          return { label: date, value: rest }
        }),
      },
    ],
    footnotes: ['Stations detected by day-to-day longitude motion (noon UTC samples).'],
  })
}

async function moonSignCalendar(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const year = input.person.year
  const month = input.person.month
  const changes: { label: string; value: string }[] = []
  let prevSign: SignName | null = null
  const start = Date.UTC(year, month - 1, 1, 0)
  const end = Date.UTC(year, month, 1, 0)
  for (let t = start; t < end; t += 2 * 3600 * 1000) {
    const date = new Date(t)
    const sign = longitudeToSign(getPlanet(planetPositions(date), 'Moon').longitude)
    if (sign !== prevSign) {
      changes.push({
        label: date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
        value: `Moon enters ${sign}`,
      })
      prevSign = sign
    }
  }
  return okResult({
    title: tool.name,
    summary: `Moon sign changes during ${year}-${String(month).padStart(2, '0')} (2-hour sampling).`,
    highlights: changes.slice(0, 3).map((c) => ({ label: c.value.replace('Moon enters ', ''), value: c.label })),
    sections: [{ heading: 'Ingresses this month', items: changes }],
    footnotes: ['Approximate ingress times from 2-hour UTC samples.'],
  })
}

async function planetIngressCalendar(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const year = input.person.year
  const bodies: PlanetId[] = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  const events: { label: string; value: string }[] = []
  let prev = planetPositions(new Date(Date.UTC(year - 1, 11, 31, 12)))
  for (let day = 0; day < 366; day++) {
    const date = new Date(Date.UTC(year, 0, 1 + day, 12))
    if (date.getUTCFullYear() !== year) break
    const cur = planetPositions(date)
    for (const id of bodies) {
      const a = longitudeToSign(getPlanet(prev, id).longitude)
      const b = longitudeToSign(getPlanet(cur, id).longitude)
      if (a !== b) {
        events.push({ label: date.toISOString().slice(0, 10), value: `${id} → ${b}` })
      }
    }
    prev = cur
  }
  return okResult({
    title: tool.name,
    summary: `${events.length} sign ingresses detected in ${year} (daily noon UTC).`,
    highlights: events.slice(0, 3).map((e) => ({ label: e.label, value: e.value })),
    sections: [{ heading: `${year} ingresses`, items: events.slice(0, 80) }],
    footnotes: ['Ingress day is the UTC date when noon longitude first shows the new sign.'],
  })
}

async function moonPhaseTool(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) {
    // date-only fallback
    const date = new Date(
      Date.UTC(input.person.year, input.person.month - 1, input.person.day, 12, 0, 0),
    )
    const angle = moonPhaseAngle(date)
    const name = moonPhaseName(angle)
    return okResult({
      title: 'Moon phase',
      summary: `${name} · illumination ~${illuminationPercent(angle)}%.`,
      highlights: [
        { label: 'Phase', value: name },
        { label: 'Illumination', value: `${illuminationPercent(angle)}%` },
        { label: 'Sun–Moon angle', value: `${angle.toFixed(1)}°` },
      ],
      sections: [],
    })
  }
  const { chart } = got
  const angle = moonPhaseAngle(chart.dateUtc)
  const name = moonPhaseName(angle)
  return okResult({
    title: 'Moon phase',
    summary: `${name} at the selected moment · ~${illuminationPercent(angle)}% illuminated.`,
    highlights: [
      { label: 'Phase', value: name },
      { label: 'Illumination', value: `${illuminationPercent(angle)}%` },
      { label: 'Moon sign', value: chart.moonSign },
    ],
    sections: [
      {
        heading: 'Details',
        items: [
          { label: 'Sun–Moon elongation', value: `${angle.toFixed(1)}°` },
          { label: 'Moon', value: formatPlanetLine(getPlanet(chart.planets, 'Moon')) },
        ],
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function genericNatalProfile(input: ParsedToolInput, tool: Tool, focus: string): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const venus = getPlanet(chart.planets, 'Venus')
  const mars = getPlanet(chart.planets, 'Mars')
  const mercury = getPlanet(chart.planets, 'Mercury')
  const saturn = getPlanet(chart.planets, 'Saturn')
  const jupiter = getPlanet(chart.planets, 'Jupiter')

  const focusMap: Record<string, { label: string; planet: PlanetId; houseHint: string }> = {
    love: { label: 'Venus', planet: 'Venus', houseHint: '5th/7th' },
    career: { label: 'MC & Saturn', planet: 'Saturn', houseHint: '10th' },
    money: { label: 'Venus & 2nd', planet: 'Venus', houseHint: '2nd/8th' },
    communication: { label: 'Mercury', planet: 'Mercury', houseHint: '3rd' },
    emotion: { label: 'Moon', planet: 'Moon', houseHint: '4th' },
    friendship: { label: '11th & Venus', planet: 'Venus', houseHint: '11th' },
    home: { label: 'Moon & IC', planet: 'Moon', houseHint: '4th' },
    creativity: { label: 'Sun & Venus', planet: 'Sun', houseHint: '5th' },
    leadership: { label: 'Sun & Mars', planet: 'Mars', houseHint: '10th' },
    learning: { label: 'Mercury & Jupiter', planet: 'Mercury', houseHint: '3rd/9th' },
    wellness: { label: 'Mars & 6th', planet: 'Mars', houseHint: '6th' },
    spirituality: { label: 'Neptune & 12th', planet: 'Neptune', houseHint: '9th/12th' },
  }
  const cfg = focusMap[focus] ?? focusMap.love
  const p = getPlanet(chart.planets, cfg.planet)
  const sign = longitudeToSign(p.longitude)

  return okResult({
    title: tool.name,
    summary: `${cfg.label} in ${sign} shapes this ${focus} profile. ${SIGN_BLURBS[sign]}`,
    highlights: [
      { label: cfg.label, value: sign },
      { label: 'Sun', value: chart.sunSign },
      { label: 'Moon', value: chart.moonSign },
    ],
    sections: [
      {
        heading: 'Key placements',
        items: [
          { label: 'Sun', value: formatPlanetLine(getPlanet(chart.planets, 'Sun'), planetHouse(chart, 'Sun')) },
          { label: 'Moon', value: formatPlanetLine(getPlanet(chart.planets, 'Moon'), planetHouse(chart, 'Moon')) },
          { label: 'Mercury', value: formatPlanetLine(mercury, planetHouse(chart, 'Mercury')) },
          { label: 'Venus', value: formatPlanetLine(venus, planetHouse(chart, 'Venus')) },
          { label: 'Mars', value: formatPlanetLine(mars, planetHouse(chart, 'Mars')) },
          { label: 'Jupiter', value: formatPlanetLine(jupiter, planetHouse(chart, 'Jupiter')) },
          { label: 'Saturn', value: formatPlanetLine(saturn, planetHouse(chart, 'Saturn')) },
          ...(chart.risingSign ? [{ label: 'Rising', value: chart.risingSign }] : []),
        ],
      },
      {
        heading: 'Reading tip',
        body: `Look especially at ${cfg.label} and life areas around the ${cfg.houseHint} house themes for ${focus}.`,
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function returnsApprox(input: ParsedToolInput, tool: Tool, planetId: PlanetId, periodYears: number): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const natal = getPlanet(chart.planets, planetId)
  const ageYears = (Date.now() - chart.dateUtc.getTime()) / (365.25 * 24 * 3600 * 1000)
  const nextReturnAge = Math.ceil(ageYears / periodYears) * periodYears
  const nextDate = new Date(chart.dateUtc.getTime() + nextReturnAge * 365.25 * 24 * 3600 * 1000)
  const prevDate = new Date(chart.dateUtc.getTime() + (nextReturnAge - periodYears) * 365.25 * 24 * 3600 * 1000)

  return okResult({
    title: tool.name,
    summary: `${planetId} returns roughly every ${periodYears} years. Next approximate window: ${nextDate.toISOString().slice(0, 10)}.`,
    highlights: [
      { label: `Natal ${planetId}`, value: formatLongitude(natal.longitude) },
      { label: 'Approx. period', value: `${periodYears} years` },
      { label: 'Next return ~', value: nextDate.toISOString().slice(0, 10) },
    ],
    sections: [
      {
        heading: 'Return windows (approximate)',
        items: [
          { label: 'Previous ~', value: prevDate.toISOString().slice(0, 10) },
          { label: 'Next ~', value: nextDate.toISOString().slice(0, 10) },
        ],
        body: 'Exact return charts need iterative ephemeris search to the natal degree; dates here are period-based estimates for planning.',
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

async function vedicBundle(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const moon = getPlanet(chart.planets, 'Moon')
  const rashi = vedicRashi(moon.longitude, chart.dateUtc)
  const ayan = lahiriAyanamsa(chart.dateUtc)
  const lagna = chart.houses
    ? vedicLagna(chart.houses.ascendant, chart.dateUtc)
    : undefined

  const siderealPlanets = chart.planets
    .filter((p) =>
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'NorthNode', 'SouthNode'].includes(p.id),
    )
    .map((p) => {
      const lon = siderealLongitude(p.longitude, chart.dateUtc)
      return { label: p.name === 'North Node' ? 'Rahu' : p.name === 'South Node' ? 'Ketu' : p.name, value: formatLongitude(lon) }
    })

  return okResult({
    title: tool.name,
    summary: `Janma Rashi ${rashi.rashi} · Nakshatra ${rashi.nakshatra.name} (pada ${rashi.nakshatra.pada}) · Lahiri ayanāṁśa ${ayan.toFixed(2)}°.`,
    highlights: [
      { label: 'Rashi (Moon)', value: rashi.rashi },
      { label: 'Nakshatra', value: `${rashi.nakshatra.name} · pada ${rashi.nakshatra.pada}` },
      { label: 'Nakshatra lord', value: rashi.nakshatra.lord },
      ...(lagna ? [{ label: 'Lagna', value: lagna.lagna }] : []),
    ],
    sections: [
      {
        heading: 'Sidereal positions (Lahiri)',
        items: siderealPlanets,
      },
      {
        heading: 'Notes',
        body: 'Sidereal longitudes use a Lahiri ayanāṁśa approximation. Professional Vedic software may differ by arcminutes.',
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

type CalcFn = (input: ParsedToolInput, tool: Tool) => Promise<ToolResult>

const registry: Record<string, CalcFn> = {
  'zodiac-sign-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const r = signResult('Your Sun sign', got.chart.sunSign, 'Sun sign', [
      { label: 'Exact Sun', value: formatLongitude(getPlanet(got.chart.planets, 'Sun').longitude) },
    ])
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'moon-sign-finder': planetFinder('Moon Sign Finder', 'Moon', 'Moon sign'),
  'rising-sign-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    if (!got.chart.risingSign || !got.chart.houses) {
      return errorResult('Rising sign needs birth time and place.')
    }
    if (got.chart.unknownTime) {
      return errorResult('Rising sign changes about every two hours — a known birth time is required.')
    }
    const r = signResult('Your Rising sign', got.chart.risingSign, 'Rising sign', [
      { label: 'Ascendant', value: formatLongitude(got.chart.houses.ascendant) },
      { label: 'Chart ruler', value: chartRuler(got.chart) ?? '—' },
    ])
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'big-three-calculator': bigThree,
  'mercury-sign-finder': planetFinder('Mercury', 'Mercury', 'Mercury sign'),
  'venus-sign-finder': planetFinder('Venus', 'Venus', 'Venus sign'),
  'mars-sign-finder': planetFinder('Mars', 'Mars', 'Mars sign'),
  'jupiter-sign-finder': planetFinder('Jupiter', 'Jupiter', 'Jupiter sign'),
  'saturn-sign-finder': planetFinder('Saturn', 'Saturn', 'Saturn sign'),
  'outer-planet-sign-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const u = getPlanet(chart.planets, 'Uranus')
    const n = getPlanet(chart.planets, 'Neptune')
    const p = getPlanet(chart.planets, 'Pluto')
    return okResult({
      title: 'Outer planet signs',
      summary: `Uranus ${longitudeToSign(u.longitude)}, Neptune ${longitudeToSign(n.longitude)}, Pluto ${longitudeToSign(p.longitude)}.`,
      highlights: [
        { label: 'Uranus', value: longitudeToSign(u.longitude), note: formatLongitude(u.longitude) },
        { label: 'Neptune', value: longitudeToSign(n.longitude), note: formatLongitude(n.longitude) },
        { label: 'Pluto', value: longitudeToSign(p.longitude), note: formatLongitude(p.longitude) },
      ],
      sections: [
        {
          heading: 'Generation markers',
          body: 'Outer planets move slowly and describe generational themes more than day-to-day personality.',
        },
      ],
      footnotes: metaFootnotes(chart),
    })
  },
  'chinese-zodiac-finder': async (input) => {
    const z = chineseZodiac(input.person.year, input.person.month, input.person.day)
    return okResult({
      title: 'Chinese zodiac',
      summary: `You were born in the year of the ${z.label} (${z.yinYang}). ${z.blurb}`,
      highlights: [
        { label: 'Animal', value: z.animal },
        { label: 'Element', value: z.element },
        { label: 'Polarity', value: z.yinYang },
        { label: 'Chinese year', value: String(z.chineseYear) },
      ],
      sections: [{ heading: 'About this animal', body: z.blurb }],
      footnotes: ['Uses Chinese New Year boundaries (approximate table for modern years).'],
    })
  },
  'vedic-rashi-finder': vedicBundle,
  'birth-chart-generator': (i, t) => fullPlanetTable(i, t, 'Birth chart'),
  'interactive-birth-chart': (i, t) => fullPlanetTable(i, t, 'Birth chart placements'),
  'plain-english-birth-chart-report': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    return okResult({
      title: 'Plain-English chart report',
      summary: `You have Sun in ${chart.sunSign}, Moon in ${chart.moonSign}${chart.risingSign ? `, Rising in ${chart.risingSign}` : ''}.`,
      highlights: [
        { label: 'Core identity (Sun)', value: chart.sunSign, note: SIGN_BLURBS[chart.sunSign] },
        { label: 'Inner weather (Moon)', value: chart.moonSign, note: SIGN_BLURBS[chart.moonSign] },
        ...(chart.risingSign
          ? [{ label: 'First impression (Rising)', value: chart.risingSign, note: SIGN_BLURBS[chart.risingSign] }]
          : []),
      ],
      sections: [
        {
          heading: 'How you move through life',
          items: [
            { label: 'Mercury (mind)', value: longitudeToSign(getPlanet(chart.planets, 'Mercury').longitude) },
            { label: 'Venus (values)', value: longitudeToSign(getPlanet(chart.planets, 'Venus').longitude) },
            { label: 'Mars (drive)', value: longitudeToSign(getPlanet(chart.planets, 'Mars').longitude) },
            { label: 'Jupiter (growth)', value: longitudeToSign(getPlanet(chart.planets, 'Jupiter').longitude) },
            { label: 'Saturn (structure)', value: longitudeToSign(getPlanet(chart.planets, 'Saturn').longitude) },
          ],
        },
        {
          heading: 'In everyday words',
          body: `Your ${chart.sunSign} Sun aims outward; your ${chart.moonSign} Moon shows what soothes and unsettles you${chart.risingSign ? `; ${chart.risingSign} Rising is the style others meet first` : ''}.`,
        },
      ],
      footnotes: metaFootnotes(chart),
    })
  },
  'planet-in-sign-calculator': (i, t) => fullPlanetTable(i, t, 'Planets in signs'),
  'planet-in-house-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    if (!chart.houses) return errorResult('Planet-in-house needs birth place and time.')
    const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    return okResult({
      title: 'Planets in houses',
      summary: 'Equal-house placement of the planets from your Ascendant.',
      highlights: ids.slice(0, 3).map((id) => ({
        label: id,
        value: `House ${planetHouse(chart, id)}`,
      })),
      sections: [
        {
          heading: 'House placements',
          items: ids.map((id) => ({
            label: id,
            value: `House ${planetHouse(chart, id)} · ${formatLongitude(getPlanet(chart.planets, id).longitude)}`,
          })),
        },
      ],
      footnotes: metaFootnotes(chart),
    })
  },
  'house-cusp-calculator': housesResult,
  'aspect-calculator': aspectsResult,
  'aspect-pattern-finder': async (input, tool) => {
    const base = await aspectsResult(input, tool)
    if (base.error) return base
    return { ...base, title: 'Aspect patterns' }
  },
  'chart-ruler-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const ruler = chartRuler(got.chart)
    if (!ruler || !got.chart.risingSign) return errorResult('Chart ruler needs a Rising sign (birth time + place).')
    const p = got.chart.planets.find((x) => x.name === ruler || x.id === ruler)
    return okResult({
      title: 'Chart ruler',
      summary: `With ${got.chart.risingSign} Rising, your chart ruler is ${ruler}.`,
      highlights: [
        { label: 'Rising', value: got.chart.risingSign },
        { label: 'Chart ruler', value: ruler },
        ...(p ? [{ label: 'Ruler placement', value: formatPlanetLine(p, planetHouse(got.chart, p.id)) }] : []),
      ],
      sections: [],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'element-balance-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const r = balanceFromCounts('Element balance', elementCounts(got.chart), 'Element tally from Sun through Saturn.')
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'dominant-sign-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const counts: Record<string, number> = {}
    for (const id of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as PlanetId[]) {
      const s = longitudeToSign(getPlanet(got.chart.planets, id).longitude)
      counts[s] = (counts[s] || 0) + 1
    }
    if (got.chart.risingSign) counts[got.chart.risingSign] = (counts[got.chart.risingSign] || 0) + 1
    const r = balanceFromCounts('Dominant sign', counts, 'Weighted by personal planets (+ Rising when known).')
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'dominant-planet-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const scores: Record<string, number> = {
      Sun: 3,
      Moon: 3,
      Mercury: 1,
      Venus: 1,
      Mars: 1,
      Jupiter: 1,
      Saturn: 1,
    }
    if (got.chart.risingSign) {
      const ruler = SIGN_RULER[got.chart.risingSign]
      scores[ruler] = (scores[ruler] || 0) + 4
    }
    for (const a of got.chart.aspects) {
      scores[a.a] = (scores[a.a] || 0) + 0.5
      scores[a.b] = (scores[a.b] || 0) + 0.5
    }
    const ranked = Object.entries(scores).sort((x, y) => y[1] - x[1])
    return okResult({
      title: 'Dominant planet',
      summary: `${ranked[0][0]} leads this chart’s emphasis score.`,
      highlights: ranked.slice(0, 3).map(([k, v]) => ({ label: k, value: v.toFixed(1) })),
      sections: [
        {
          heading: 'How scoring works',
          body: 'Sun/Moon start with weight, chart ruler gains extra points, and major aspects add modest emphasis.',
          items: ranked.map(([k, v]) => ({ label: k, value: v.toFixed(1) })),
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'dominant-house-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    if (!got.chart.houses) return errorResult('Dominant house needs birth time and place.')
    const counts: Record<string, number> = {}
    for (const id of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as PlanetId[]) {
      const h = planetHouse(got.chart, id)!
      counts[`House ${h}`] = (counts[`House ${h}`] || 0) + 1
    }
    const r = balanceFromCounts('Dominant house', counts, 'Personal/social planet concentration by house.')
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'combustion-and-cazimi-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const sun = getPlanet(got.chart.planets, 'Sun').longitude
    const hits: { label: string; value: string }[] = []
    for (const id of ['Mercury', 'Venus', 'Mars'] as PlanetId[]) {
      const p = getPlanet(got.chart.planets, id)
      let d = Math.abs(normalizeDegrees(p.longitude) - normalizeDegrees(sun))
      if (d > 180) d = 360 - d
      if (d <= 0.283) hits.push({ label: id, value: `Cazimi (in the heart of the Sun) · ${d.toFixed(2)}°` })
      else if (d <= 8.5) hits.push({ label: id, value: `Combust · ${d.toFixed(2)}° from Sun` })
      else if (d <= 17) hits.push({ label: id, value: `Under the beams · ${d.toFixed(2)}° from Sun` })
    }
    return okResult({
      title: 'Combustion & cazimi',
      summary: hits.length ? hits.map((h) => `${h.label}: ${h.value}`).join(' · ') : 'No Mercury/Venus/Mars within 17° of the Sun.',
      highlights: hits.slice(0, 3).map((h) => ({ label: h.label, value: h.value })),
      sections: [{ heading: 'Findings', items: hits }],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'mutual-reception-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const pairs: [PlanetId, PlanetId][] = [
      ['Sun', 'Moon'],
      ['Mercury', 'Venus'],
      ['Mercury', 'Mars'],
      ['Venus', 'Mars'],
      ['Sun', 'Saturn'],
      ['Moon', 'Saturn'],
      ['Jupiter', 'Mars'],
      ['Jupiter', 'Saturn'],
      ['Venus', 'Jupiter'],
    ]
    const found: string[] = []
    const signOf = (id: PlanetId) => longitudeToSign(getPlanet(got.chart.planets, id).longitude)
    for (const [a, b] of pairs) {
      if (SIGN_RULER[signOf(a)] === b && SIGN_RULER[signOf(b)] === a) {
        found.push(`${a} in ${signOf(a)} ↔ ${b} in ${signOf(b)}`)
      }
    }
    // Also check classic domicile mutual reception among all
    const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]
        const b = ids[j]
        if (SIGN_RULER[signOf(a)] === b && SIGN_RULER[signOf(b)] === a) {
          const label = `${a} in ${signOf(a)} ↔ ${b} in ${signOf(b)}`
          if (!found.includes(label)) found.push(label)
        }
      }
    }
    return okResult({
      title: 'Mutual reception',
      summary: found.length ? found.join(' · ') : 'No classic domicile mutual reception among the seven traditional planets.',
      highlights: found.slice(0, 3).map((f) => ({ label: 'Reception', value: f })),
      sections: [{ heading: 'Found', items: found.map((f) => ({ label: 'Pair', value: f })) }],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'modality-balance-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const r = balanceFromCounts('Modality balance', modalityCounts(got.chart), 'Cardinal / Fixed / Mutable mix.')
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'polarity-balance-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const els = elementCounts(got.chart)
    const yang = els.Fire + els.Air
    const yin = els.Earth + els.Water
    const r = balanceFromCounts('Polarity balance', { 'Yang (Fire+Air)': yang, 'Yin (Earth+Water)': yin }, 'Active vs receptive emphasis.')
    r.footnotes = metaFootnotes(got.chart)
    return r
  },
  'retrograde-planet-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const rx = got.chart.planets.filter(
      (p) => p.retrograde && !['NorthNode', 'SouthNode', 'Sun', 'Moon'].includes(p.id),
    )
    return okResult({
      title: 'Retrograde planets',
      summary: rx.length ? `${rx.map((p) => p.name).join(', ')} retrograde at birth.` : 'No personal/outer planets were retrograde at birth.',
      highlights: rx.slice(0, 3).map((p) => ({ label: p.name, value: formatLongitude(p.longitude) + ' ℞' })),
      sections: [
        {
          heading: 'Retrograde list',
          items: rx.map((p) => ({ label: p.name, value: formatPlanetLine(p) })),
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'stellium-finder': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const counts: Record<string, string[]> = {}
    for (const id of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as PlanetId[]) {
      const p = getPlanet(got.chart.planets, id)
      const s = longitudeToSign(p.longitude)
      counts[s] = counts[s] || []
      counts[s].push(id)
    }
    const stelliums = Object.entries(counts).filter(([, v]) => v.length >= 3)
    return okResult({
      title: 'Stellium finder',
      summary: stelliums.length
        ? stelliums.map(([s, v]) => `${s}: ${v.join(', ')}`).join(' · ')
        : 'No stellium of 3+ planets in one sign among the ten planets.',
      highlights: stelliums.map(([s, v]) => ({ label: s, value: `${v.length} planets`, note: v.join(', ') })),
      sections: [
        {
          heading: 'Sign occupancy',
          items: Object.entries(counts).map(([s, v]) => ({ label: s, value: v.join(', ') || '—' })),
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'empty-house-explainer': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    if (!got.chart.houses) return errorResult('Needs birth time and place.')
    const occupied = new Set<number>()
    for (const id of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as PlanetId[]) {
      occupied.add(planetHouse(got.chart, id)!)
    }
    const empty = Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => !occupied.has(h))
    return okResult({
      title: 'Empty houses',
      summary: empty.length ? `Empty houses: ${empty.join(', ')}.` : 'Every house has at least one planet.',
      highlights: empty.slice(0, 3).map((h) => ({ label: `House ${h}`, value: 'Empty' })),
      sections: [
        {
          heading: 'Note',
          body: 'Empty houses are normal. Their topics are still active via the sign on the cusp and that sign’s ruler.',
        },
        {
          heading: 'Empty list',
          items: empty.map((h) => ({
            label: `House ${h}`,
            value: `Cusp ${formatLongitude(got.chart.houses!.cusps[h])}`,
          })),
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'love-style-profile': (i, t) => genericNatalProfile(i, t, 'love'),
  'career-astrology-profile': (i, t) => genericNatalProfile(i, t, 'career'),
  'money-profile': (i, t) => genericNatalProfile(i, t, 'money'),
  'communication-style-tool': (i, t) => genericNatalProfile(i, t, 'communication'),
  'emotional-needs-profile': (i, t) => genericNatalProfile(i, t, 'emotion'),
  'friendship-style-profile': (i, t) => genericNatalProfile(i, t, 'friendship'),
  'home-and-family-profile': (i, t) => genericNatalProfile(i, t, 'home'),
  'creativity-profile': (i, t) => genericNatalProfile(i, t, 'creativity'),
  'leadership-style-profile': (i, t) => genericNatalProfile(i, t, 'leadership'),
  'learning-style-profile': (i, t) => genericNatalProfile(i, t, 'learning'),
  'wellness-routine-profile': (i, t) => genericNatalProfile(i, t, 'wellness'),
  'spirituality-profile': (i, t) => genericNatalProfile(i, t, 'spirituality'),
  'current-planet-positions': currentSky,
  'today-s-transit-chart': currentSky,
  'retrograde-calendar': retrogradeCalendar,
  'planet-ingress-calendar': planetIngressCalendar,
  'moon-sign-calendar': moonSignCalendar,
  'ephemeris-generator': currentSky,
  'moon-phase-finder': moonPhaseTool,
  'natal-lunar-phase-profile': moonPhaseTool,
  'saturn-return-calculator': (i, t) => returnsApprox(i, t, 'Saturn', 29.5),
  'jupiter-return-calculator': (i, t) => returnsApprox(i, t, 'Jupiter', 11.86),
  'venus-return-calculator': (i, t) => returnsApprox(i, t, 'Venus', 1.0),
  'mars-return-calculator': (i, t) => returnsApprox(i, t, 'Mars', 1.88),
  'mercury-return-calculator': (i, t) => returnsApprox(i, t, 'Mercury', 1.0),
  'nodal-return-calculator': (i, t) => returnsApprox(i, t, 'NorthNode', 18.6),
  'chiron-return-calculator': (i, t) => returnsApprox(i, t, 'Chiron', 50.4),
  'zodiac-compatibility-calculator': compatibility,
  'love-compatibility-score': compatibility,
  'friendship-compatibility-tool': compatibility,
  'business-partner-compatibility': compatibility,
  'parent-child-compatibility': compatibility,
  'synastry-chart-calculator': compatibility,
  'plain-english-relationship-report': compatibility,
  'janma-kundli-generator': vedicBundle,
  'nakshatra-finder': vedicBundle,
  'lagna-calculator': vedicBundle,
  'lunar-nodes-calculator-rahu-ketu': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const nn = getPlanet(got.chart.planets, 'NorthNode')
    const sn = getPlanet(got.chart.planets, 'SouthNode')
    return okResult({
      title: 'Lunar nodes',
      summary: `North Node ${formatLongitude(nn.longitude)} · South Node ${formatLongitude(sn.longitude)} (mean node).`,
      highlights: [
        { label: 'North Node / Rahu', value: formatLongitude(nn.longitude) },
        { label: 'South Node / Ketu', value: formatLongitude(sn.longitude) },
      ],
      sections: [],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'midheaven-mc-and-imum-coeli-ic-calculator': housesResult,
  'tropical-sidereal-comparison': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const ayan = lahiriAyanamsa(got.chart.dateUtc)
    const sunT = getPlanet(got.chart.planets, 'Sun').longitude
    const moonT = getPlanet(got.chart.planets, 'Moon').longitude
    return okResult({
      title: 'Tropical vs sidereal',
      summary: `Lahiri ayanāṁśa ≈ ${ayan.toFixed(2)}°. Sun tropical ${longitudeToSign(sunT)} vs sidereal ${longitudeToSign(siderealLongitude(sunT, got.chart.dateUtc))}.`,
      highlights: [
        { label: 'Ayanāṁśa', value: `${ayan.toFixed(2)}°` },
        { label: 'Sun tropical', value: formatLongitude(sunT) },
        { label: 'Sun sidereal', value: formatLongitude(siderealLongitude(sunT, got.chart.dateUtc)) },
        { label: 'Moon tropical', value: formatLongitude(moonT) },
        { label: 'Moon sidereal', value: formatLongitude(siderealLongitude(moonT, got.chart.dateUtc)) },
      ],
      sections: [],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'sect-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const sun = getPlanet(got.chart.planets, 'Sun')
    let sect = 'Day chart (diurnal)'
    if (got.chart.houses) {
      const sunHouse = houseOfLongitude(sun.longitude, got.chart.houses.cusps)
      sect = sunHouse >= 7 && sunHouse <= 12 ? 'Day chart (diurnal)' : 'Night chart (nocturnal)'
    } else {
      const hour = input.person.hour
      sect = hour >= 6 && hour < 18 ? 'Day chart (approx.)' : 'Night chart (approx.)'
    }
    return okResult({
      title: 'Sect',
      summary: sect,
      highlights: [
        { label: 'Sect', value: sect },
        { label: 'Sun', value: formatLongitude(sun.longitude) },
      ],
      sections: [
        {
          heading: 'Traditional note',
          body: 'Day charts emphasize the Sun, Jupiter, and Saturn; night charts emphasize the Moon, Venus, and Mars.',
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'lot-of-fortune-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    if (!got.chart.houses) return errorResult('Lot of Fortune needs Ascendant (birth time + place).')
    const sun = getPlanet(got.chart.planets, 'Sun').longitude
    const moon = getPlanet(got.chart.planets, 'Moon').longitude
    const asc = got.chart.houses.ascendant
    const sunHouse = houseOfLongitude(sun, got.chart.houses.cusps)
    const day = sunHouse >= 7 && sunHouse <= 12
    const fortune = day
      ? normalizeDegrees(asc + moon - sun)
      : normalizeDegrees(asc + sun - moon)
    return okResult({
      title: 'Lot of Fortune',
      summary: `Pars Fortuna at ${formatLongitude(fortune)} (${day ? 'day' : 'night'} formula).`,
      highlights: [
        { label: 'Lot of Fortune', value: formatLongitude(fortune) },
        { label: 'Formula', value: day ? 'ASC + Moon − Sun' : 'ASC + Sun − Moon' },
      ],
      sections: [],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'part-of-spirit-pars-spiritus-calculator': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    if (!got.chart.houses) return errorResult('Needs Ascendant (birth time + place).')
    const sun = getPlanet(got.chart.planets, 'Sun').longitude
    const moon = getPlanet(got.chart.planets, 'Moon').longitude
    const asc = got.chart.houses.ascendant
    const sunHouse = houseOfLongitude(sun, got.chart.houses.cusps)
    const day = sunHouse >= 7 && sunHouse <= 12
    const spirit = day
      ? normalizeDegrees(asc + sun - moon)
      : normalizeDegrees(asc + moon - sun)
    return okResult({
      title: 'Lot of Spirit',
      summary: `Pars Spiritus at ${formatLongitude(spirit)}.`,
      highlights: [{ label: 'Lot of Spirit', value: formatLongitude(spirit) }],
      sections: [],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'personal-daily-horoscope': async (input, tool) => {
    const got = await natalOrError(input, tool)
    if ('error' in got) return errorResult(got.error)
    const now = new Date()
    const transitMoon = longitudeToSign(getPlanet(planetPositions(now), 'Moon').longitude)
    const transitSun = longitudeToSign(sunLongitude(now))
    return okResult({
      title: 'Personal daily snapshot',
      summary: `Today’s sky: Sun in ${transitSun}, Moon in ${transitMoon}. Your natal Sun is ${got.chart.sunSign}.`,
      highlights: [
        { label: 'Transit Sun', value: transitSun },
        { label: 'Transit Moon', value: transitMoon },
        { label: 'Your Sun', value: got.chart.sunSign },
        { label: 'Your Moon', value: got.chart.moonSign },
      ],
      sections: [
        {
          heading: 'Reflect',
          body: `With natal Sun in ${got.chart.sunSign} and Moon in ${got.chart.moonSign}, notice how today’s ${transitMoon} Moon colors your mood.`,
        },
      ],
      footnotes: metaFootnotes(got.chart),
    })
  },
  'weekly-personal-horoscope': (i, t) => registry['personal-daily-horoscope'](i, t),
  'monthly-personal-horoscope': (i, t) => registry['personal-daily-horoscope'](i, t),
  'planetary-day-and-planetary-hour-calculator': async (input) => {
    const date = new Date(
      Date.UTC(input.person.year, input.person.month - 1, input.person.day, 12, 0, 0),
    )
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const rulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    const dow = date.getUTCDay()
    return okResult({
      title: 'Planetary day',
      summary: `${days[dow]} is traditionally ruled by ${rulers[dow]}.`,
      highlights: [
        { label: 'Weekday', value: days[dow] },
        { label: 'Day ruler', value: rulers[dow] },
      ],
      sections: [
        {
          heading: 'Chaldean order reminder',
          body: 'Planetary hours follow Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon, repeating from sunrise.',
        },
      ],
    })
  },
}

/** Fallback: build a useful natal summary for any remaining tool. */
async function fallbackCalculator(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  const needsPartner = tool.fields.some((f) => f.startsWith('partner'))
  if (needsPartner) return compatibility(input, tool)

  if (tool.categoryId.includes('vedic') || tool.slug.includes('nakshatra') || tool.slug.includes('dasha') || tool.slug.includes('sade')) {
    return vedicBundle(input, tool)
  }

  if (tool.fields.length === 0 || (tool.fields.length === 1 && tool.fields[0] === 'date' && tool.slug.includes('calendar'))) {
    return currentSky(input, tool)
  }

  const got = await natalOrError(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got

  return okResult({
    title: `${tool.name} — calculated snapshot`,
    summary: `Sun ${chart.sunSign} · Moon ${chart.moonSign}${chart.risingSign ? ` · Rising ${chart.risingSign}` : ''}. Core chart factors for this tool.`,
    highlights: [
      { label: 'Sun', value: chart.sunSign },
      { label: 'Moon', value: chart.moonSign },
      ...(chart.risingSign ? [{ label: 'Rising', value: chart.risingSign }] : []),
      { label: 'Mercury', value: longitudeToSign(getPlanet(chart.planets, 'Mercury').longitude) },
      { label: 'Venus', value: longitudeToSign(getPlanet(chart.planets, 'Venus').longitude) },
      { label: 'Mars', value: longitudeToSign(getPlanet(chart.planets, 'Mars').longitude) },
    ],
    sections: [
      {
        heading: 'Full planetary list',
        items: chart.planets
          .filter((p) => p.id !== 'SouthNode')
          .map((p) => ({ label: p.name, value: formatPlanetLine(p, planetHouse(chart, p.id)) })),
      },
      {
        heading: 'About this tool',
        body: `${tool.description} This result uses the same ephemeris engine as our dedicated calculators. Specialized timelines (exact returns, dashas, maps) may be refined further over time.`,
      },
    ],
    footnotes: metaFootnotes(chart),
  })
}

export async function runToolCalculation(tool: Tool, input: ParsedToolInput): Promise<ToolResult> {
  const fn = registry[tool.slug] ?? SPECIALIZED_REGISTRY[tool.slug] ?? domainSmartCalculator
  try {
    return await fn(input, tool)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Calculation failed.'
    return errorResult(message)
  }
}

export function hasDedicatedCalculator(slug: string): boolean {
  return slug in registry || slug in SPECIALIZED_REGISTRY
}
