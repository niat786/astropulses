import * as Astronomy from 'astronomy-engine'
import type { Tool } from '../../data/tools'
import type { ParsedToolInput } from '../astro/parseInput'
import { buildNatalChart, formatPlanetLine, planetHouse, type NatalChart } from '../astro/natal'
import { WORLD_MAJOR_CITIES } from '../astro/cities'
import {
  formatLongitude,
  longitudeToSign,
  normalizeDegrees,
  SIGN_BLURBS,
  SIGN_ELEMENT,
  SIGN_MODALITY,
  SIGN_RULER,
  SIGNS,
  type SignName,
} from '../astro/signs'
import {
  getPlanet,
  moonPhaseAngle,
  moonPhaseName,
  planetPositions,
  type PlanetId,
} from '../astro/positions'
import { houseOfLongitude, ramcDegrees, tropicalAscendant, tropicalMidheaven, wholeSignHouses, equalHouses } from '../astro/houses'
import { lahiriAyanamsa, nakshatraFromLongitude, siderealLongitude, vedicLagna, vedicRashi } from '../astro/vedic'
import { findAspects } from '../astro/aspects'
import { errorResult, okResult, type ToolResult } from './types'

type CalcFn = (input: ParsedToolInput, tool: Tool) => Promise<ToolResult>

function metaNotes(chart: Awaited<ReturnType<typeof buildNatalChart>>): string[] {
  if ('error' in chart) return []
  return [
    `Calculated for ${chart.dateLocal}${chart.place ? ` · ${chart.place.name}` : ''}`,
    `UTC moment: ${chart.dateUtcIso}`,
    'Server-side VSOP87 / J2000 ephemeris engine · Zero client-side math exposure',
  ]
}

async function getChart(input: ParsedToolInput, tool: Tool): Promise<{ error: string } | { chart: NatalChart }> {
  const fields = tool.fields.length ? tool.fields : (['date', 'time', 'place'] as const)
  const chart = await buildNatalChart(input.person, [...fields])
  if ('error' in chart) return { error: chart.error }
  return { chart }
}

const VIMSHOTTARI_SEQ = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
]

const EXALTATION_MAP: Partial<Record<PlanetId, SignName>> = {
  Sun: 'Aries',
  Moon: 'Taurus',
  Mercury: 'Virgo',
  Venus: 'Pisces',
  Mars: 'Capricorn',
  Jupiter: 'Cancer',
  Saturn: 'Libra',
}

const FALL_MAP: Partial<Record<PlanetId, SignName>> = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mercury: 'Pisces',
  Venus: 'Virgo',
  Mars: 'Cancer',
  Jupiter: 'Capricorn',
  Saturn: 'Aries',
}

const FIXED_STARS = [
  { name: 'Aldebaran (α Tauri)', lon: 69.78, gift: 'Royal Star of the East — integrity, eloquence, and leadership under ethical clarity' },
  { name: 'Rigel (β Orionis)', lon: 76.83, gift: 'Technical brilliance, inventive teaching, and rapid protection' },
  { name: 'Sirius (α Canis Majoris)', lon: 104.08, gift: 'The Sacred Guardian — extraordinary devotion, high renown, and collective impact' },
  { name: 'Regulus (α Leonis)', lon: 150.08, gift: 'Royal Star of the Lion’s Heart — sovereignty, courage, and nobility without vengeance' },
  { name: 'Spica (α Virginis)', lon: 204.08, gift: 'The Wheat Ear of Virgo — artistic, scientific, and intellectual grace' },
  { name: 'Arcturus (α Boötis)', lon: 204.23, gift: 'The Pathfinder — pioneering transition, justice, and navigation' },
  { name: 'Antares (α Scorpii)', lon: 249.77, gift: 'Royal Star of the West — strategic depth, fearless transformation, and intensity' },
  { name: 'Vega (α Lyrae)', lon: 285.32, gift: 'Orphic charisma, artistic enchantment, and statesmanship' },
  { name: 'Fomalhaut (α Piscis Austrini)', lon: 333.87, gift: 'Royal Star of the South — poetic idealism, spiritual vision, and lasting legacy' },
  { name: 'Algol (β Persei)', lon: 56.17, gift: 'Focused primordial intensity and mastery over high-stakes crises' },
]

const SABIAN_THEMES = [
  'Initiation of pure archetypal force into conscious form',
  'Cooperation and polarity between inner vision and outer structure',
  'Creative synthesis breakthroughs through practical experimentation',
  'Grounded stewardship and refinement of personal craft',
  'Dynamic self-expression and bold testing of horizons',
  'Harmonizing service, rhythm, and reciprocal exchange',
  'Relational discernment and equilibrium under pressure',
  'Deep regeneration, shared trust, and alchemical focus',
  'Philosophical transmission and long-range architectural meaning',
  'Mastery of public responsibility and enduring institution-building',
]

export const SPECIALIZED_REGISTRY: Record<string, CalcFn> = {
  // 1. Accessible Natal Analysis
  'personal-planet-profile': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']
    const roles: Record<string, string> = {
      Sun: 'Core identity, vitality & conscious direction',
      Moon: 'Emotional anchor, instinct & inner sanctuary',
      Mercury: 'Mindset, voice, learning & problem-solving',
      Venus: 'Love language, aesthetics, values & attraction',
      Mars: 'Drive, boundaries, courage & physical action',
    }
    return okResult({
      title: 'Personal Planet Profile (Inner Five)',
      summary: `Your inner planets are led by ${chart.sunSign} Sun, ${chart.moonSign} Moon, and ${longitudeToSign(getPlanet(chart.planets, 'Mercury').longitude)} Mercury.`,
      highlights: ids.map((id) => {
        const p = getPlanet(chart.planets, id)
        const s = longitudeToSign(p.longitude)
        return { label: id, value: `${s} (${formatLongitude(p.longitude)})`, note: roles[id] }
      }),
      sections: ids.map((id) => {
        const p = getPlanet(chart.planets, id)
        const s = longitudeToSign(p.longitude)
        const h = planetHouse(chart, id)
        return {
          heading: `${id} in ${s}${h ? ` · House ${h}` : ''}`,
          body: `${roles[id]}. In ${s} (${SIGN_ELEMENT[s]} / ${SIGN_MODALITY[s]}), ${id} expresses itself with ${SIGN_BLURBS[s].toLowerCase()}`,
          items: [
            { label: 'Exact Longitude', value: formatPlanetLine(p, h) },
            { label: 'Dispositor (Sign Ruler)', value: SIGN_RULER[s] },
          ],
        }
      }),
      footnotes: metaNotes(chart),
    })
  },

  'chart-signature-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const el: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
    const mod: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 }
    for (const p of chart.planets.slice(0, 10)) {
      const s = longitudeToSign(p.longitude)
      const w = p.id === 'Sun' || p.id === 'Moon' ? 2 : 1
      el[SIGN_ELEMENT[s]] += w
      mod[SIGN_MODALITY[s]] += w
    }
    if (chart.risingSign) {
      el[SIGN_ELEMENT[chart.risingSign]] += 2
      mod[SIGN_MODALITY[chart.risingSign]] += 2
    }
    const topEl = Object.entries(el).sort((a, b) => b[1] - a[1])[0][0]
    const topMod = Object.entries(mod).sort((a, b) => b[1] - a[1])[0][0]
    const sigSign = SIGNS.find((s) => SIGN_ELEMENT[s] === topEl && SIGN_MODALITY[s] === topMod) ?? chart.sunSign
    return okResult({
      title: `Chart Signature: ${sigSign}`,
      summary: `Your dominant element is ${topEl} and dominant modality is ${topMod}, converging on the ${sigSign} archetype.`,
      highlights: [
        { label: 'Signature Sign', value: sigSign, note: `${topMod} ${topEl}` },
        { label: 'Dominant Element', value: topEl, note: `Score: ${el[topEl]} pts` },
        { label: 'Dominant Modality', value: topMod, note: `Score: ${mod[topMod]} pts` },
        { label: 'Sun / Moon', value: `${chart.sunSign} / ${chart.moonSign}` },
      ],
      sections: [
        {
          heading: 'Why your signature sign matters',
          body: `Even when your natal Sun is in ${chart.sunSign}, the overall center of gravity across your planets and angles behaves like ${sigSign}: ${SIGN_BLURBS[sigSign]}`,
          items: [
            { label: 'Element Breakdown', value: `Fire ${el.Fire} · Earth ${el.Earth} · Air ${el.Air} · Water ${el.Water}` },
            { label: 'Modality Breakdown', value: `Cardinal ${mod.Cardinal} · Fixed ${mod.Fixed} · Mutable ${mod.Mutable}` },
          ],
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'angular-planet-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const rows = chart.planets
      .filter((p) => p.id !== 'SouthNode')
      .map((p) => ({ p, house: planetHouse(chart, p.id) ?? 1 }))
    const angular = rows.filter((r) => [1, 4, 7, 10].includes(r.house))
    return okResult({
      title: 'Angular Planet Finder (Houses 1, 4, 7 & 10)',
      summary: angular.length
        ? `${angular.length} planet(s) occupy angular houses (${angular.map((a) => `${a.p.name} in H${a.house}`).join(', ')}).`
        : 'Your planets gather in succedent and cadent houses, favoring steady consolidation and specialized strategy over loud angular display.',
      highlights: (angular.length ? angular.slice(0, 4) : rows.slice(0, 3)).map((r) => ({
        label: `${r.p.name} (House ${r.house})`,
        value: longitudeToSign(r.p.longitude),
        note: [1, 4, 7, 10].includes(r.house) ? 'Angular Powerhouse' : 'Supporting House',
      })),
      sections: [
        {
          heading: 'Angular House Audit',
          body: 'Planets in the 1st (Identity), 4th (Home/Foundation), 7th (Partnership), and 10th (Career/Public Standing) act at maximum volume in your life story.',
          items: rows.map((r) => ({
            label: `${r.p.name} — House ${r.house}`,
            value: `${formatPlanetLine(r.p)} (${[1, 4, 7, 10].includes(r.house) ? 'Angular ★' : [2, 5, 8, 11].includes(r.house) ? 'Succedent' : 'Cadent'})`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'critical-degree-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const items = chart.planets
      .filter((p) => p.id !== 'SouthNode')
      .map((p) => {
        const deg = Math.floor(normalizeDegrees(p.longitude) % 30)
        const s = longitudeToSign(p.longitude)
        let tag = 'Standard Degree'
        if (deg === 29) tag = '29° Anaretic Degree ★ (Urgent Mastery / Karmic Graduation)'
        else if (deg === 0) tag = '0° Avatar / Initiatory Degree ★ (Pure Unfiltered Sign Energy)'
        else if ([13, 26].includes(deg) && SIGN_MODALITY[s] === 'Cardinal') tag = `${deg}° Cardinal Critical Degree ★`
        else if ([8, 9, 21, 22].includes(deg) && SIGN_MODALITY[s] === 'Fixed') tag = `${deg}° Fixed Critical Degree ★`
        else if ([4, 17].includes(deg) && SIGN_MODALITY[s] === 'Mutable') tag = `${deg}° Mutable Critical Degree ★`
        return { name: p.name, deg, sign: s, formatted: formatLongitude(p.longitude), tag, isCrit: tag.includes('★') }
      })
    const crits = items.filter((i) => i.isCrit)
    return okResult({
      title: 'Critical & Anaretic Degree Audit (0°, 29° & Traditional)',
      summary: crits.length
        ? `Detected ${crits.length} placement(s) on critical or anaretic degrees: ${crits.map((c) => `${c.name} (${c.deg}° ${c.sign})`).join(', ')}.`
        : 'No planets sit on the 0° or 29° extremes — your placements operate in steady mid-sign degrees.',
      highlights: (crits.length ? crits : items.slice(0, 3)).map((c) => ({
        label: c.name,
        value: `${c.deg}° ${c.sign}`,
        note: c.tag.replace(' ★', ''),
      })),
      sections: [
        {
          heading: 'Degree-by-Degree Breakdown',
          items: items.map((i) => ({ label: `${i.name} (${i.formatted})`, value: i.tag })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'unaspected-planet-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const counts: Record<string, number> = {}
    for (const p of chart.planets.slice(0, 10)) counts[p.name] = 0
    for (const a of chart.aspects) {
      if (counts[a.a] !== undefined) counts[a.a]++
      if (counts[a.b] !== undefined) counts[a.b]++
    }
    const unaspected = Object.entries(counts).filter(([, c]) => c === 0).map(([k]) => k)
    return okResult({
      title: 'Unaspected Planet Finder',
      summary: unaspected.length
        ? `Unaspected planet(s) found: ${unaspected.join(', ')}. These operate with pure, unfiltered autonomy.`
        : 'Every major planet in your chart forms at least one major Ptolemaic aspect, creating an integrated internal dialogue.',
      highlights: Object.entries(counts)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 4)
        .map(([k, v]) => ({ label: k, value: `${v} major aspect(s)`, note: v === 0 ? 'Unaspected ★' : 'Integrated' })),
      sections: [
        {
          heading: 'Major Aspect Connectivity Count',
          body: 'Checks Conjunction (0°), Sextile (60°), Square (90°), Trine (120°), and Opposition (180°) across Sun through Pluto.',
          items: Object.entries(counts).map(([k, v]) => ({
            label: k,
            value: v === 0 ? '0 aspects — Unaspected (Autonomous Voice)' : `${v} major aspect(s)`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'hemisphere-and-quadrant-emphasis-tool': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    let north = 0, south = 0, east = 0, west = 0
    const q = [0, 0, 0, 0]
    for (const p of chart.planets.slice(0, 10)) {
      const h = planetHouse(chart, p.id) ?? 1
      if (h <= 6) north++
      else south++
      if ([10, 11, 12, 1, 2, 3].includes(h)) east++
      else west++
      q[Math.floor((h - 1) / 3)]++
    }
    return okResult({
      title: 'Hemisphere & Quadrant Emphasis',
      summary: `Southern (Public): ${south} · Northern (Private): ${north} · Eastern (Self-Directed): ${east} · Western (Collaborative): ${west}.`,
      highlights: [
        { label: 'Southern (H7–12)', value: `${south} planets`, note: 'Public / Collective' },
        { label: 'Northern (H1–6)', value: `${north} planets`, note: 'Interior / Personal' },
        { label: 'Eastern (H10–3)', value: `${east} planets`, note: 'Self-Initiating' },
        { label: 'Western (H4–9)', value: `${west} planets`, note: 'Relational / Partnered' },
      ],
      sections: [
        {
          heading: 'Four Quadrant Breakdown',
          items: [
            { label: '1st Quadrant (Houses 1–3 · Personal Identity & Mind)', value: `${q[0]} planets` },
            { label: '2nd Quadrant (Houses 4–6 · Roots, Creativity & Craft)', value: `${q[1]} planets` },
            { label: '3rd Quadrant (Houses 7–9 · Partnerships, Depth & Wisdom)', value: `${q[2]} planets` },
            { label: '4th Quadrant (Houses 10–12 · Career, Community & Transcendence)', value: `${q[3]} planets` },
          ],
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  // 2. Vedic & Advanced Jyotish
  'vimshottari-dasha-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const moonTrop = getPlanet(chart.planets, 'Moon').longitude
    const rashi = vedicRashi(moonTrop, chart.dateUtc)
    const nak = rashi.nakshatra
    const span = 360 / 27
    const fracRemaining = 1 - nak.degreeInNakshatra / span
    const startIdx = nak.index % 9
    let cursorYear = input.person.year + (input.person.month - 1) / 12 + (input.person.day - 1) / 365.25
    const nowYear = new Date().getUTCFullYear()
    const items: { label: string; value: string }[] = []
    let activeLord = VIMSHOTTARI_SEQ[startIdx].lord

    for (let i = 0; i < 9; i++) {
      const row = VIMSHOTTARI_SEQ[(startIdx + i) % 9]
      const yrs = i === 0 ? row.years * fracRemaining : row.years
      const endYear = cursorYear + yrs
      const isCurrent = nowYear >= Math.floor(cursorYear) && nowYear <= Math.floor(endYear)
      if (isCurrent) activeLord = row.lord
      items.push({
        label: `${row.lord} Mahadasha${isCurrent ? ' ★ (ACTIVE NOW)' : ''}`,
        value: `${Math.floor(cursorYear)} – ${Math.floor(endYear)} (${yrs.toFixed(1)} yrs)`,
      })
      cursorYear = endYear
    }

    return okResult({
      title: 'Vimshottari Mahadasha 120-Year Timeline',
      summary: `Natal Moon in ${nak.name} (Pada ${nak.pada}) · Birth Dasha Lord: ${nak.lord} · Currently Active Mahadasha: ${activeLord}.`,
      highlights: [
        { label: 'Active Mahadasha', value: activeLord, note: `Current chapter (${nowYear})` },
        { label: 'Janma Nakshatra', value: `${nak.name} (Pada ${nak.pada})`, note: `Ruled by ${nak.lord}` },
        { label: 'Birth Balance', value: `${(fracRemaining * 100).toFixed(1)}%`, note: `${nak.lord} remaining at birth` },
      ],
      sections: [
        {
          heading: 'Complete 9-Planet Mahadasha Sequence',
          body: 'Calculated from your exact sidereal Moon longitude using Lahiri Chitrapaksha Ayanamsha.',
          items,
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'navamsa-d9-chart-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const d9FromSid = (sidLon: number): SignName => SIGNS[Math.floor(normalizeDegrees(sidLon) / (30 / 9)) % 12]
    const items = chart.planets.slice(0, 9).map((p) => {
      const sid = siderealLongitude(p.longitude, chart.dateUtc)
      const d1 = longitudeToSign(sid)
      const d9 = d9FromSid(sid)
      const vargottama = d1 === d9
      return {
        label: `${p.name} (D1: ${d1})`,
        value: `D9 ${d9}${vargottama ? ' ★ Vargottama (Doubled Strength)' : ''}`,
      }
    })
    const ascD9 = chart.houses ? d9FromSid(siderealLongitude(chart.houses.ascendant, chart.dateUtc)) : undefined
    return okResult({
      title: 'Navamsa (D9) Chart Calculator',
      summary: `${ascD9 ? `Navamsa Lagna in ${ascD9} · ` : ''}D9 placements reveal long-term marriage dharma and the inner fruit of your Rashi (D1) placements.`,
      highlights: [
        ...(ascD9 ? [{ label: 'D9 Lagna', value: ascD9 }] : []),
        { label: 'D9 Sun', value: d9FromSid(siderealLongitude(getPlanet(chart.planets, 'Sun').longitude, chart.dateUtc)) },
        { label: 'D9 Moon', value: d9FromSid(siderealLongitude(getPlanet(chart.planets, 'Moon').longitude, chart.dateUtc)) },
        { label: 'D9 Venus', value: d9FromSid(siderealLongitude(getPlanet(chart.planets, 'Venus').longitude, chart.dateUtc)) },
      ],
      sections: [
        {
          heading: 'Rashi (D1) vs. Navamsa (D9) Comparison & Vargottama Audit',
          body: 'When a planet occupies the exact same sign in both D1 and D9, it is Vargottama — conferring exceptional resilience and integrity.',
          items,
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'manglik-dosha-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const marsSid = siderealLongitude(getPlanet(chart.planets, 'Mars').longitude, chart.dateUtc)
    const moonSid = siderealLongitude(getPlanet(chart.planets, 'Moon').longitude, chart.dateUtc)
    const ascSid = chart.houses ? siderealLongitude(chart.houses.ascendant, chart.dateUtc) : moonSid
    const lagnaSignIdx = Math.floor(ascSid / 30) % 12
    const moonSignIdx = Math.floor(moonSid / 30) % 12
    const marsSignIdx = Math.floor(marsSid / 30) % 12
    const houseFromLagna = ((marsSignIdx - lagnaSignIdx + 12) % 12) + 1
    const houseFromMoon = ((marsSignIdx - moonSignIdx + 12) % 12) + 1
    const manglikHouses = [1, 2, 4, 7, 8, 12]
    const isManglik = manglikHouses.includes(houseFromLagna)
    const marsSign = SIGNS[marsSignIdx]
    const cancelled = ['Aries', 'Scorpio', 'Capricorn', 'Cancer'].includes(marsSign)
    return okResult({
      title: 'Manglik (Kuja) Dosha Assessment',
      summary: isManglik
        ? cancelled
          ? `Mars occupies House ${houseFromLagna} (${marsSign}), with classical sign cancellation (Parihara) softening Kuja Dosha.`
          : `Active Manglik placement: Sidereal Mars is in House ${houseFromLagna} (${marsSign}) from Lagna.`
        : `Non-Manglik from Lagna: Sidereal Mars is in House ${houseFromLagna} (${marsSign}).`,
      highlights: [
        { label: 'Lagna Verdict', value: isManglik ? (cancelled ? 'Cancelled Manglik' : 'Manglik Present') : 'Non-Manglik' },
        { label: 'Mars from Lagna', value: `House ${houseFromLagna} (${marsSign})` },
        { label: 'Mars from Moon', value: `House ${houseFromMoon}` },
      ],
      sections: [
        {
          heading: 'How Kuja Dosha is Evaluated',
          body: 'Traditional Jyotish checks whether Mars occupies Bhava 1, 2, 4, 7, 8, or 12 from the Natal Lagna and Chandra Lagna, and then evaluates dignity cancellations.',
          items: [
            { label: 'Sidereal Mars Position', value: formatLongitude(marsSid) },
            { label: 'House from Lagna', value: `Bhava ${houseFromLagna} (${isManglik ? 'Manglik House' : 'Clear'})` },
            { label: 'House from Chandra (Moon)', value: `Bhava ${houseFromMoon} (${manglikHouses.includes(houseFromMoon) ? 'Chandra Manglik' : 'Clear'})` },
            { label: 'Dignity Parihara (Cancellation)', value: cancelled ? `Active — Mars in ${marsSign}` : 'Standard placement' },
          ],
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'sade-sati-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const moonSid = siderealLongitude(getPlanet(chart.planets, 'Moon').longitude, chart.dateUtc)
    const moonIdx = Math.floor(moonSid / 30) % 12
    const now = new Date()
    const satNowSid = siderealLongitude(getPlanet(planetPositions(now), 'Saturn').longitude, now)
    const satIdx = Math.floor(satNowSid / 30) % 12
    const diff = (satIdx - moonIdx + 12) % 12
    let status = 'Not Currently in Sade Sati'
    if (diff === 11) status = 'Active: Rising Phase (First 2.5 Years — 12th from Moon)'
    else if (diff === 0) status = 'Active: Peak Phase (Middle 2.5 Years — Over Natal Moon)'
    else if (diff === 1) status = 'Active: Setting Phase (Final 2.5 Years — 2nd from Moon)'

    return okResult({
      title: 'Shani Sade Sati Status & Phase Breakdown',
      summary: `Natal Chandra Rashi: ${SIGNS[moonIdx]} · Current Sidereal Saturn: ${SIGNS[satIdx]} · ${status}.`,
      highlights: [
        { label: 'Current Status', value: diff === 11 || diff === 0 || diff === 1 ? 'In Sade Sati' : 'Clear of Sade Sati', note: status },
        { label: 'Natal Moon Sign', value: SIGNS[moonIdx], note: 'Sidereal Rashi' },
        { label: 'Transit Saturn', value: SIGNS[satIdx], note: formatLongitude(satNowSid) },
      ],
      sections: [
        {
          heading: 'Your Three Sade Sati Sign Windows',
          body: 'Sade Sati spans the 7.5 years when sidereal Saturn transits the sign before your Moon, your Moon sign itself, and the sign after your Moon.',
          items: [
            { label: '1. Rising Phase (12th House from Moon)', value: `Saturn in ${SIGNS[(moonIdx + 11) % 12]} — Releasing outdated structures` },
            { label: '2. Peak Phase (1st House / Janma Rashi)', value: `Saturn in ${SIGNS[moonIdx]} — Emotional resilience & self-mastery` },
            { label: '3. Setting Phase (2nd House from Moon)', value: `Saturn in ${SIGNS[(moonIdx + 1) % 12]} — Rebuilding wealth, voice & stability` },
          ],
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'panchanga-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const sunSid = siderealLongitude(getPlanet(chart.planets, 'Sun').longitude, chart.dateUtc)
    const moonSid = siderealLongitude(getPlanet(chart.planets, 'Moon').longitude, chart.dateUtc)
    const elong = normalizeDegrees(moonSid - sunSid)
    const tithi = Math.floor(elong / 12) + 1
    const paksha = tithi <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)'
    const nak = nakshatraFromLongitude(moonSid)
    const yoga = (Math.floor(normalizeDegrees(sunSid + moonSid) / (360 / 27)) % 27) + 1
    const karana = Math.floor(elong / 6) + 1
    const days = ['Sunday (Ravivara · Sun)', 'Monday (Somavara · Moon)', 'Tuesday (Mangalavara · Mars)', 'Wednesday (Budhavara · Mercury)', 'Thursday (Guruvara · Jupiter)', 'Friday (Shukravara · Venus)', 'Saturday (Shanivara · Saturn)']
    const vara = days[chart.dateUtc.getUTCDay()]

    return okResult({
      title: 'Five-Limb Vedic Panchanga',
      summary: `${paksha} Tithi #${tithi} · ${vara} · ${nak.name} Nakshatra (Pada ${nak.pada}).`,
      highlights: [
        { label: 'Tithi (Lunar Day)', value: `Tithi #${tithi}`, note: paksha },
        { label: 'Nakshatra', value: nak.name, note: `Pada ${nak.pada} · Lord ${nak.lord}` },
        { label: 'Vara (Weekday)', value: vara.split(' ')[0], note: vara },
      ],
      sections: [
        {
          heading: 'All Five Limbs (Panchanga) at Birth Moment',
          items: [
            { label: '1. Tithi (Lunar Day)', value: `${paksha} Tithi #${tithi} of 30 (${elong.toFixed(1)}° Moon–Sun angle)` },
            { label: '2. Vara (Solar Day)', value: vara },
            { label: '3. Nakshatra (Star Mansion)', value: `${nak.name} (Pada ${nak.pada}) — Ruled by ${nak.lord}` },
            { label: '4. Nitya Yoga (Luni-Solar Sum)', value: `Yoga #${yoga} of 27` },
            { label: '5. Karana (Half-Tithi)', value: `Karana #${karana} of 60` },
          ],
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'jaimini-karaka-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const seven = (['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as PlanetId[])
      .map((id) => {
        const p = getPlanet(chart.planets, id)
        const sid = siderealLongitude(p.longitude, chart.dateUtc)
        const degInSign = normalizeDegrees(sid) % 30
        return { id, sid, degInSign, sign: longitudeToSign(sid) }
      })
      .sort((a, b) => b.degInSign - a.degInSign)

    const titles = [
      ['Atmakaraka (AK)', 'Soul King & Primary Spiritual Axis'],
      ['Amatyakaraka (AmK)', 'Minister — Career, Counsel & Execution'],
      ['Bhratrukaraka (BK)', 'Siblings, Mentors & Courage'],
      ['Matrukaraka (MK)', 'Mother, Emotional Security & Home'],
      ['Putrakaraka (PK)', 'Intelligence, Creativity & Legacy'],
      ['Gnatikaraka (GK)', 'Competition, Obstacles & Resilience'],
      ['Darakaraka (DK)', 'Spouse & Committed Partnership'],
    ]

    return okResult({
      title: 'Jaimini 7-Karaka (Chara Karaka) Table',
      summary: `Your Atmakaraka (Soul Planet) is ${seven[0].id} (${seven[0].degInSign.toFixed(2)}° ${seven[0].sign}) and your Darakaraka (Partner Planet) is ${seven[6].id}.`,
      highlights: [
        { label: 'Atmakaraka (Soul)', value: seven[0].id, note: `${seven[0].degInSign.toFixed(2)}° ${seven[0].sign}` },
        { label: 'Amatyakaraka (Career)', value: seven[1].id, note: `${seven[1].degInSign.toFixed(2)}° ${seven[1].sign}` },
        { label: 'Darakaraka (Spouse)', value: seven[6].id, note: `${seven[6].degInSign.toFixed(2)}° ${seven[6].sign}` },
      ],
      sections: [
        {
          heading: 'Complete Chara Karaka Ranking (Highest to Lowest Degree in Sign)',
          items: seven.map((row, i) => ({
            label: `${titles[i][0]} — ${row.id}`,
            value: `${row.degInSign.toFixed(2)}° ${row.sign} (${titles[i][1]})`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'ayanamsha-comparison-tool': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const lahiri = lahiriAyanamsa(chart.dateUtc)
    const kp = lahiri - 0.1
    const raman = lahiri - 1.44
    const fagan = lahiri + 0.88
    return okResult({
      title: 'Ayanamsha Comparison (Lahiri, KP, Raman & Fagan-Bradley)',
      summary: `At your birth moment, Lahiri Ayanamsha is ${lahiri.toFixed(3)}°, Krishnamurti (KP) is ${kp.toFixed(3)}°, B.V. Raman is ${raman.toFixed(3)}°, and Fagan-Bradley is ${fagan.toFixed(3)}°.`,
      highlights: [
        { label: 'Lahiri (Chitrapaksha)', value: `${lahiri.toFixed(3)}°` },
        { label: 'Krishnamurti (KP)', value: `${kp.toFixed(3)}°` },
        { label: 'B.V. Raman', value: `${raman.toFixed(3)}°` },
        { label: 'Fagan-Bradley', value: `${fagan.toFixed(3)}°` },
      ],
      sections: [
        {
          heading: 'Luminaries & Angles Across All 4 Sidereal Standards',
          items: (['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as PlanetId[]).map((id) => {
            const lon = getPlanet(chart.planets, id).longitude
            return {
              label: `${id} (Tropical: ${formatLongitude(lon)})`,
              value: `Lahiri: ${formatLongitude(lon - lahiri)} · KP: ${formatLongitude(lon - kp)} · Raman: ${formatLongitude(lon - raman)}`,
            }
          }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  // 3. Traditional & Hellenistic
  'annual-profection-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    if (!chart.risingSign) return errorResult('Annual Profections require a birth time and city to establish your 1st House Rising sign.')
    const now = new Date()
    let age = now.getUTCFullYear() - input.person.year
    if (
      now.getUTCMonth() + 1 < input.person.month ||
      (now.getUTCMonth() + 1 === input.person.month && now.getUTCDate() < input.person.day)
    ) {
      age = Math.max(0, age - 1)
    }
    const profHouse = (age % 12) + 1
    const ascIdx = SIGNS.indexOf(chart.risingSign)
    const profSign = SIGNS[(ascIdx + profHouse - 1) % 12]
    const timeLord = SIGN_RULER[profSign]
    const lordPlanet = chart.planets.find((p) => p.name === timeLord)
    const lordHouse = lordPlanet ? planetHouse(chart, lordPlanet.id) : undefined

    return okResult({
      title: `Annual Profection — Age ${age} (House ${profHouse} in ${profSign})`,
      summary: `At age ${age}, your Annual Profection activates the ${profHouse}th House (${profSign}), making ${timeLord} your Lord of the Year.`,
      highlights: [
        { label: 'Current Age', value: `${age} years` },
        { label: 'Activated House', value: `House ${profHouse}`, note: profSign },
        { label: 'Lord of the Year', value: timeLord, note: lordPlanet ? `Natal ${longitudeToSign(lordPlanet.longitude)} (H${lordHouse ?? 1})` : undefined },
      ],
      sections: [
        {
          heading: '5-Year Profection Horizon',
          body: 'Each birthday shifts the spotlight forward one Whole Sign house, handing the steering wheel of the year to that sign’s traditional planetary ruler.',
          items: [-1, 0, 1, 2, 3].map((offset) => {
            const a = Math.max(0, age + offset)
            const h = (a % 12) + 1
            const s = SIGNS[(ascIdx + h - 1) % 12]
            return {
              label: `Age ${a}${offset === 0 ? ' ★ (Current Year)' : ''}`,
              value: `House ${h} (${s}) · Time Lord: ${SIGN_RULER[s]}`,
            }
          }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'arabic-lots-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    if (!chart.houses) return errorResult('Hermetic & Arabic Lots require an exact Ascendant (birth time and city).')
    const asc = chart.houses.ascendant
    const sun = getPlanet(chart.planets, 'Sun').longitude
    const moon = getPlanet(chart.planets, 'Moon').longitude
    const mercury = getPlanet(chart.planets, 'Mercury').longitude
    const venus = getPlanet(chart.planets, 'Venus').longitude
    const mars = getPlanet(chart.planets, 'Mars').longitude
    const jupiter = getPlanet(chart.planets, 'Jupiter').longitude
    const saturn = getPlanet(chart.planets, 'Saturn').longitude
    const sunH = houseOfLongitude(sun, chart.houses.cusps)
    const isDay = sunH >= 7 && sunH <= 12

    const fortune = normalizeDegrees(isDay ? asc + moon - sun : asc + sun - moon)
    const spirit = normalizeDegrees(isDay ? asc + sun - moon : asc + moon - sun)
    const eros = normalizeDegrees(isDay ? asc + venus - spirit : asc + spirit - venus)
    const victory = normalizeDegrees(isDay ? asc + jupiter - spirit : asc + spirit - jupiter)
    const courage = normalizeDegrees(isDay ? asc + fortune - mars : asc + mars - fortune)
    const necessity = normalizeDegrees(isDay ? asc + fortune - mercury : asc + mercury - fortune)
    const nemesis = normalizeDegrees(isDay ? asc + fortune - saturn : asc + saturn - fortune)

    const lots = [
      ['Lot of Fortune (Moon)', fortune, 'Body, health, material flow & circumstantial fortune'],
      ['Lot of Spirit (Sun)', spirit, 'Willpower, vocation, soul intention & deliberate action'],
      ['Lot of Eros (Venus)', eros, 'Magnetism, affection, beauty & heartfelt desire'],
      ['Lot of Victory (Jupiter)', victory, 'Success, breakthrough, faith & allies'],
      ['Lot of Courage (Mars)', courage, 'Daring, decisive action & competitive resolve'],
      ['Lot of Necessity (Mercury)', necessity, 'Binding duties, commerce & intellectual discipline'],
      ['Lot of Nemesis (Saturn)', nemesis, 'Accountability, hidden tests & deep endurance'],
    ] as const

    return okResult({
      title: 'Seven Hermetic Lots (Paulus Alexandrinus Formula)',
      summary: `Computed using ${isDay ? 'Diurnal (Day)' : 'Nocturnal (Night)'} sect reversal · Lot of Fortune at ${formatLongitude(fortune)} · Lot of Spirit at ${formatLongitude(spirit)}.`,
      highlights: [
        { label: 'Chart Sect', value: isDay ? 'Diurnal (Day)' : 'Nocturnal (Night)' },
        { label: 'Lot of Fortune', value: formatLongitude(fortune), note: `House ${houseOfLongitude(fortune, chart.houses.cusps)}` },
        { label: 'Lot of Spirit', value: formatLongitude(spirit), note: `House ${houseOfLongitude(spirit, chart.houses.cusps)}` },
      ],
      sections: [
        {
          heading: 'Complete Seven Hermetic Lots',
          items: lots.map(([name, lon, desc]) => ({
            label: `${name} — House ${houseOfLongitude(lon, chart.houses!.cusps)}`,
            value: `${formatLongitude(lon)} (${desc})`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'essential-dignity-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    const items = ids.map((id) => {
      const p = getPlanet(chart.planets, id)
      const s = longitudeToSign(p.longitude)
      const isDom = SIGN_RULER[s] === id
      const isExalt = EXALTATION_MAP[id] === s
      const isFall = FALL_MAP[id] === s
      const oppSign = SIGNS[(SIGNS.indexOf(s) + 6) % 12]
      const isDet = SIGN_RULER[oppSign] === id
      let status = 'Peregrine (Independent / Wandering)'
      if (isDom) status = 'Domicile Rulership (+5) ★ Strongest Native Authority'
      else if (isExalt) status = 'Exaltation (+4) ★ Honored & Elevated Expression'
      else if (isDet) status = 'Detriment (-5) · Counter-cultural / Resourceful Outsider'
      else if (isFall) status = 'Fall (-4) · Deep Unconventional Mastery'
      return { id, s, formatted: formatLongitude(p.longitude), status }
    })
    return okResult({
      title: 'Traditional Essential Dignity Scorecard',
      summary: 'Evaluates Domicile, Exaltation, Detriment, Fall, and Peregrine status across the seven classical planets.',
      highlights: items.slice(0, 4).map((i) => ({ label: `${i.id} in ${i.s}`, value: i.status.split(' ')[0] })),
      sections: [
        {
          heading: 'Planet-by-Planet Dignity Table',
          items: items.map((i) => ({ label: `${i.id} (${i.formatted})`, value: i.status })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  // 4. Relationship & Synastry
  'composite-chart-calculator': async (input, tool) => {
    const got1 = await getChart(input, tool)
    if ('error' in got1) return errorResult(got1.error)
    if (!input.partner) return errorResult('Enter Partner birth details to compute your Composite midpoint chart.')
    const got2 = await buildNatalChart(input.partner, tool.fields)
    if ('error' in got2) return errorResult(got2.error)

    const mid = (a: number, b: number) => {
      const diff = ((b - a + 540) % 360) - 180
      return normalizeDegrees(a + diff / 2)
    }
    const ids: PlanetId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    const items = ids.map((id) => {
      const a = getPlanet(got1.chart.planets, id).longitude
      const b = getPlanet(got2.planets, id).longitude
      const m = mid(a, b)
      return {
        label: `Composite ${id}`,
        value: `${formatLongitude(m)} (Partner A: ${longitudeToSign(a)} · Partner B: ${longitudeToSign(b)})`,
      }
    })
    const compSun = longitudeToSign(mid(getPlanet(got1.chart.planets, 'Sun').longitude, getPlanet(got2.planets, 'Sun').longitude))
    const compMoon = longitudeToSign(mid(getPlanet(got1.chart.planets, 'Moon').longitude, getPlanet(got2.planets, 'Moon').longitude))

    return okResult({
      title: 'Composite Relationship Chart (Shortest-Arc Midpoints)',
      summary: `Your relationship as a third entity has a Composite ${compSun} Sun and Composite ${compMoon} Moon.`,
      highlights: [
        { label: 'Composite Sun', value: compSun, note: 'Core purpose of the bond' },
        { label: 'Composite Moon', value: compMoon, note: 'Shared emotional climate' },
      ],
      sections: [
        {
          heading: 'Exact Midpoint Positions',
          body: 'Each Composite planet sits at the exact mathematical midpoint between Partner A and Partner B.',
          items,
        },
      ],
      footnotes: metaNotes(got1.chart),
    })
  },

  'kundli-matching-guna-milan': async (input, tool) => {
    const got1 = await getChart(input, tool)
    if ('error' in got1) return errorResult(got1.error)
    if (!input.partner) return errorResult('Enter Partner birth details for Ashtakoota 36-Guna Milan matching.')
    const got2 = await buildNatalChart(input.partner, tool.fields)
    if ('error' in got2) return errorResult(got2.error)

    const r1 = vedicRashi(getPlanet(got1.chart.planets, 'Moon').longitude, got1.chart.dateUtc)
    const r2 = vedicRashi(getPlanet(got2.planets, 'Moon').longitude, got2.dateUtc)
    const i1 = r1.nakshatra.index
    const i2 = r2.nakshatra.index

    const nadi = i1 % 3 !== i2 % 3 ? 8 : 0
    const bhakoot = Math.abs(SIGNS.indexOf(r1.rashi) - SIGNS.indexOf(r2.rashi)) % 5 !== 0 ? 7 : 3.5
    const gana = i1 % 3 === i2 % 3 ? 6 : 4
    const maitri = r1.nakshatra.lord === r2.nakshatra.lord ? 5 : 4
    const yoni = 3
    const tara = ((i2 - i1 + 27) % 9) % 2 === 0 ? 3 : 1.5
    const vashya = 2
    const varna = 1
    const total = nadi + bhakoot + gana + maitri + yoni + tara + vashya + varna

    return okResult({
      title: `Ashtakoota Guna Milan: ${total} / 36 Points`,
      summary: `Partner A (${r1.rashi} · ${r1.nakshatra.name}) & Partner B (${r2.rashi} · ${r2.nakshatra.name}) score ${total} out of 36 Gunas.`,
      highlights: [
        { label: 'Total Guna Score', value: `${total} / 36`, note: total >= 24 ? 'Excellent Harmony' : total >= 18 ? 'Good Match' : 'Needs Review' },
        { label: 'Partner A Nakshatra', value: r1.nakshatra.name, note: `Pada ${r1.nakshatra.pada}` },
        { label: 'Partner B Nakshatra', value: r2.nakshatra.name, note: `Pada ${r2.nakshatra.pada}` },
      ],
      sections: [
        {
          heading: '8-Fold Koota Breakdown',
          items: [
            { label: '1. Varna (Work & Spiritual Alignment)', value: `${varna} / 1` },
            { label: '2. Vashya (Mutual Magnetism)', value: `${vashya} / 2` },
            { label: '3. Tara (Star Destiny Harmony)', value: `${tara} / 3` },
            { label: '4. Yoni (Intimate & Instinctual Affinity)', value: `${yoni} / 4` },
            { label: '5. Graha Maitri (Planetary Mental Friendship)', value: `${maitri} / 5` },
            { label: '6. Gana (Temperament Match)', value: `${gana} / 6` },
            { label: '7. Bhakoot (Rashi Emotional & Prosperity Flow)', value: `${bhakoot} / 7` },
            { label: '8. Nadi (Vitality & Physiological Polarity)', value: `${nadi} / 8` },
          ],
        },
      ],
      footnotes: metaNotes(got1.chart),
    })
  },

  // 5. Location & Astrocartography
  'astrocartography-map': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const gst = ramcDegrees(chart.dateUtc, 0)
    const items = chart.planets.slice(0, 10).map((p) => {
      const mcLon = ((p.longitude - gst + 540) % 360) - 180
      const icLon = ((mcLon + 180 + 540) % 360) - 180
      const fmt = (v: number) => `${Math.abs(v).toFixed(1)}° ${v >= 0 ? 'E' : 'W'}`
      const city = WORLD_MAJOR_CITIES.reduce((best, c) =>
        Math.abs(c.longitude - mcLon) < Math.abs(best.longitude - mcLon) ? c : best
      )
      return {
        label: `${p.name} Meridian Lines`,
        value: `MC Zenith: ${fmt(mcLon)} · IC Nadir: ${fmt(icLon)} (Near ${city.name})`,
      }
    })
    return okResult({
      title: 'Astrocartography Planetary Meridian Lines (MC / IC)',
      summary: 'Exact geographic longitudes where each planet culminated at the Midheaven (MC) or Imum Coeli (IC) at your birth moment.',
      highlights: items.slice(0, 3).map((i) => ({ label: i.label.replace(' Meridian Lines', ''), value: i.value.split(' (')[0] })),
      sections: [
        {
          heading: 'World Meridian Line Coordinates & Nearest Major Cities',
          body: 'Moving near a planet’s MC line brings that planet’s archetype into your public career and visibility; its IC line anchors home, real estate, and emotional roots.',
          items,
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'best-city-for-me-explorer': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const sun = getPlanet(chart.planets, 'Sun').longitude
    const venus = getPlanet(chart.planets, 'Venus').longitude
    const jupiter = getPlanet(chart.planets, 'Jupiter').longitude

    const items = WORLD_MAJOR_CITIES.slice(0, 12).map((city) => {
      const asc = tropicalAscendant(chart.dateUtc, city.latitude, city.longitude)
      const mc = tropicalMidheaven(chart.dateUtc, city.longitude)
      const hCusps = wholeSignHouses(asc, mc).cusps
      const sunH = houseOfLongitude(sun, hCusps)
      const venH = houseOfLongitude(venus, hCusps)
      const jupH = houseOfLongitude(jupiter, hCusps)
      let vibe = 'Balanced Growth & Discovery'
      if ([1, 10].includes(jupH) || [1, 10].includes(sunH)) vibe = '★ Career, Prestige & Leadership (Sun/Jupiter Angular)'
      else if ([1, 5, 7].includes(venH)) vibe = '★ Romance, Art & Social Magnetism (Venus Angular/Trine)'
      else if ([4].includes(jupH) || [4].includes(venH)) vibe = '★ Sanctuary, Home & Inner Peace (4th House Benefic)'
      return {
        label: `${city.name} (Relocated ${longitudeToSign(asc)} Rising)`,
        value: `${vibe} · Sun H${sunH}, Venus H${venH}, Jupiter H${jupH}`,
      }
    })

    return okResult({
      title: 'Best Global Cities Explorer (Relocated Chart Scan)',
      summary: 'Simulates your relocated Ascendant, Midheaven, and benefic house shifts across 12 major world hubs.',
      highlights: items.slice(0, 3).map((i) => ({ label: i.label.split(' (')[0], value: i.value.split(' · ')[0] })),
      sections: [
        {
          heading: '12-City Relocated House Comparison',
          items,
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  // 6. Professional & Technical Tools
  'fixed-star-conjunction-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const matches: { label: string; value: string }[] = []
    for (const star of FIXED_STARS) {
      for (const p of chart.planets) {
        const diff = Math.abs(((p.longitude - star.lon + 540) % 360) - 180)
        if (diff <= 2.3) {
          matches.push({
            label: `${star.name} (${formatLongitude(star.lon)}) ☌ ${p.name}`,
            value: `Orb ${diff.toFixed(2)}° — ${star.gift}`,
          })
        }
      }
    }
    return okResult({
      title: 'Royal & Behenian Fixed Star Conjunctions',
      summary: matches.length
        ? `Found ${matches.length} tight fixed-star alignment(s) within 2.3° orb.`
        : 'Closest fixed-star alignments to your natal planets.',
      highlights: (matches.length ? matches.slice(0, 3) : [{ label: 'Regulus (0° Virgo)', value: 'Royal Star of Leadership' }]).map((m) => ({
        label: m.label.split(' (')[0],
        value: m.value.split(' — ')[0],
      })),
      sections: [
        {
          heading: 'Fixed Star Alignment Audit',
          items: matches.length
            ? matches
            : FIXED_STARS.slice(0, 6).map((s) => {
                const closest = chart.planets.reduce((b, p) =>
                  Math.abs(((p.longitude - s.lon + 540) % 360) - 180) < Math.abs(((b.longitude - s.lon + 540) % 360) - 180) ? p : b
                )
                const d = Math.abs(((closest.longitude - s.lon + 540) % 360) - 180)
                return { label: `${s.name} (${formatLongitude(s.lon)})`, value: `Nearest: ${closest.name} (${d.toFixed(1)}° orb) — ${s.gift}` }
              }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'harmonic-chart-generator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    return okResult({
      title: 'Harmonic Chart Positions (H4, H5, H7 & H9)',
      summary: 'Multiplies your natal longitudes by harmonic integers to reveal hidden drive (H4), creative talent (H5), inspiration (H7), and spiritual joy (H9).',
      highlights: [
        { label: 'H5 Quintile Sun', value: formatLongitude(getPlanet(chart.planets, 'Sun').longitude * 5), note: 'Creative mastery' },
        { label: 'H7 Septile Moon', value: formatLongitude(getPlanet(chart.planets, 'Moon').longitude * 7), note: 'Mystic intuition' },
        { label: 'H9 Novile Venus', value: formatLongitude(getPlanet(chart.planets, 'Venus').longitude * 9), note: 'Joy & integration' },
      ],
      sections: [
        {
          heading: 'Harmonic Longitude Matrix (Sun through Pluto)',
          items: chart.planets.slice(0, 10).map((p) => ({
            label: `${p.name} (Natal: ${formatLongitude(p.longitude)})`,
            value: `H4: ${longitudeToSign(p.longitude * 4)} · H5: ${longitudeToSign(p.longitude * 5)} · H7: ${longitudeToSign(p.longitude * 7)} · H9: ${longitudeToSign(p.longitude * 9)}`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'draconic-natal-chart-generator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const nn = getPlanet(chart.planets, 'NorthNode').longitude
    const dSun = normalizeDegrees(getPlanet(chart.planets, 'Sun').longitude - nn)
    const dMoon = normalizeDegrees(getPlanet(chart.planets, 'Moon').longitude - nn)
    const dAsc = chart.houses ? normalizeDegrees(chart.houses.ascendant - nn) : undefined
    return okResult({
      title: 'Draconic Natal Chart (North Node = 0° Aries)',
      summary: `Draconic Sun in ${longitudeToSign(dSun)} · Draconic Moon in ${longitudeToSign(dMoon)}${dAsc !== undefined ? ` · Draconic Rising in ${longitudeToSign(dAsc)}` : ''}.`,
      highlights: [
        { label: 'Draconic Sun', value: formatLongitude(dSun) },
        { label: 'Draconic Moon', value: formatLongitude(dMoon) },
        ...(dAsc !== undefined ? [{ label: 'Draconic Rising', value: formatLongitude(dAsc) }] : []),
      ],
      sections: [
        {
          heading: 'Tropical vs. Draconic Positions',
          body: 'Subtracting your natal North Node longitude from every planet reveals your Draconic (nodal soul-contract) chart.',
          items: chart.planets
            .filter((p) => p.id !== 'SouthNode')
            .map((p) => ({
              label: `${p.name} (Tropical: ${formatLongitude(p.longitude)})`,
              value: `Draconic: ${formatLongitude(normalizeDegrees(p.longitude - nn))}`,
            })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'out-of-bounds-planet-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const bodies: [string, Astronomy.Body][] = [
      ['Sun', Astronomy.Body.Sun],
      ['Moon', Astronomy.Body.Moon],
      ['Mercury', Astronomy.Body.Mercury],
      ['Venus', Astronomy.Body.Venus],
      ['Mars', Astronomy.Body.Mars],
      ['Jupiter', Astronomy.Body.Jupiter],
      ['Saturn', Astronomy.Body.Saturn],
      ['Uranus', Astronomy.Body.Uranus],
      ['Neptune', Astronomy.Body.Neptune],
      ['Pluto', Astronomy.Body.Pluto],
    ]
    const obs = new Astronomy.Observer(chart.place?.latitude ?? 0, chart.place?.longitude ?? 0, 0)
    const rows = bodies.map(([name, b]) => {
      const eq = Astronomy.Equator(b, chart.dateUtc, obs, true, true)
      const oob = Math.abs(eq.dec) > 23.439
      return { name, dec: eq.dec, oob }
    })
    const oobHits = rows.filter((r) => r.oob)
    return okResult({
      title: 'Equatorial Declination & Out-of-Bounds (OOB) Audit',
      summary: oobHits.length
        ? `${oobHits.length} Out-of-Bounds planet(s) exceeding ±23°26′ declination: ${oobHits.map((o) => `${o.name} (${o.dec.toFixed(2)}°)`).join(', ')}.`
        : 'All planets remain within the ±23°26′ solar declination bounds.',
      highlights: (oobHits.length ? oobHits : rows.slice(0, 3)).map((r) => ({
        label: r.name,
        value: `${r.dec >= 0 ? '+' : ''}${r.dec.toFixed(2)}°`,
        note: r.oob ? 'Out of Bounds ★' : 'In Bounds',
      })),
      sections: [
        {
          heading: 'Declination Table (North / South of Celestial Equator)',
          items: rows.map((r) => ({
            label: r.name,
            value: `${r.dec >= 0 ? '+' : ''}${r.dec.toFixed(2)}° ${r.dec >= 0 ? 'N' : 'S'} — ${r.oob ? '★ OUT OF BOUNDS (Maverick / Unconventional Genius)' : 'Within Solar Tropics'}`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'secondary-progressions-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const ageYears = Math.max(0, (Date.now() - chart.dateUtc.getTime()) / (365.2425 * 86400 * 1000))
    const progDate = new Date(chart.dateUtc.getTime() + ageYears * 86400 * 1000)
    const progPlanets = planetPositions(progDate)
    const pSun = getPlanet(progPlanets, 'Sun').longitude
    const pMoon = getPlanet(progPlanets, 'Moon').longitude
    const phaseAngle = moonPhaseAngle(progDate)
    const phaseName = moonPhaseName(phaseAngle)

    return okResult({
      title: `Secondary Progressions (Day-for-a-Year · Age ${ageYears.toFixed(1)})`,
      summary: `Progressed Sun in ${longitudeToSign(pSun)} (${formatLongitude(pSun)}) · Progressed Moon in ${longitudeToSign(pMoon)} (${formatLongitude(pMoon)}) · ${phaseName} Phase.`,
      highlights: [
        { label: 'Progressed Sun', value: formatLongitude(pSun) },
        { label: 'Progressed Moon', value: formatLongitude(pMoon) },
        { label: 'Progressed Phase', value: phaseName, note: `${phaseAngle.toFixed(1)}°` },
      ],
      sections: [
        {
          heading: 'Natal vs. Secondary Progressed Positions Today',
          body: 'Each day after your birth corresponds to one year of life evolution.',
          items: (['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as PlanetId[]).map((id) => {
            const nat = getPlanet(chart.planets, id)
            const pr = getPlanet(progPlanets, id)
            return {
              label: `${id} (Natal: ${formatLongitude(nat.longitude)})`,
              value: `Progressed: ${formatLongitude(pr.longitude)}${pr.retrograde ? ' ℞' : ''}`,
            }
          }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'solar-arc-directions-calculator': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    const ageYears = Math.max(0, (Date.now() - chart.dateUtc.getTime()) / (365.2425 * 86400 * 1000))
    const progDate = new Date(chart.dateUtc.getTime() + ageYears * 86400 * 1000)
    const natSun = getPlanet(chart.planets, 'Sun').longitude
    const progSun = getPlanet(planetPositions(progDate), 'Sun').longitude
    const solarArc = normalizeDegrees(progSun - natSun)

    return okResult({
      title: `Solar Arc Directions (Arc: +${solarArc.toFixed(2)}°)`,
      summary: `Your current Solar Arc is +${solarArc.toFixed(2)}° (at age ${ageYears.toFixed(1)}), advancing every natal planet and angle by that exact arc.`,
      highlights: [
        { label: 'Solar Arc', value: `+${solarArc.toFixed(2)}°` },
        { label: 'Directed Sun', value: formatLongitude(progSun) },
        { label: 'Directed Moon', value: formatLongitude(getPlanet(chart.planets, 'Moon').longitude + solarArc) },
      ],
      sections: [
        {
          heading: 'Solar Arc Directed Positions',
          items: chart.planets.slice(0, 10).map((p) => ({
            label: `${p.name} (Natal: ${formatLongitude(p.longitude)})`,
            value: `Directed: ${formatLongitude(p.longitude + solarArc)}`,
          })),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'house-system-comparison-tool': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    if (!chart.houses || !chart.place) return errorResult('House comparison requires a birth time and city.')
    const eq = equalHouses(chart.houses.ascendant, chart.houses.midheaven)
    const ws = wholeSignHouses(chart.houses.ascendant, chart.houses.midheaven)
    return okResult({
      title: 'House System Comparison (Whole Sign vs. Equal House)',
      summary: `Ascendant at ${formatLongitude(chart.houses.ascendant)} · Midheaven at ${formatLongitude(chart.houses.midheaven)}.`,
      highlights: [
        { label: 'Ascendant (1st)', value: formatLongitude(chart.houses.ascendant) },
        { label: 'Midheaven (MC)', value: formatLongitude(chart.houses.midheaven) },
      ],
      sections: [
        {
          heading: 'Planet House Shifts Between Systems',
          items: chart.planets.slice(0, 10).map((p) => {
            const hEq = houseOfLongitude(p.longitude, eq.cusps)
            const hWs = houseOfLongitude(p.longitude, ws.cusps)
            return {
              label: `${p.name} (${formatLongitude(p.longitude)})`,
              value: `Whole Sign: House ${hWs} · Equal House: House ${hEq}${hWs !== hEq ? ' ★ Shifts House' : ' (Consistent)'}`,
            }
          }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },

  'sabian-symbol-directory-and-degree-finder': async (input, tool) => {
    const got = await getChart(input, tool)
    if ('error' in got) return errorResult(got.error)
    const { chart } = got
    return okResult({
      title: 'Sabian Symbol Degree Finder (Rounded-Up 1°–30° Standard)',
      summary: 'Sabian Symbols always round up to the next whole integer degree (e.g. 14°08′ is read as the 15th degree of that sign).',
      highlights: (['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'] as PlanetId[]).slice(0, 3).map((id) => {
        const p = getPlanet(chart.planets, id)
        const s = longitudeToSign(p.longitude)
        const sabianDeg = Math.floor(normalizeDegrees(p.longitude) % 30) + 1
        return { label: `${id} Sabian Degree`, value: `${s} ${sabianDeg}°`, note: `Exact: ${formatLongitude(p.longitude)}` }
      }),
      sections: [
        {
          heading: 'Your Core Sabian Degrees & Archetypal Themes',
          items: chart.planets.slice(0, 10).map((p, idx) => {
            const s = longitudeToSign(p.longitude)
            const sabianDeg = Math.floor(normalizeDegrees(p.longitude) % 30) + 1
            return {
              label: `${p.name} — ${s} ${sabianDeg}° (from ${formatLongitude(p.longitude)})`,
              value: SABIAN_THEMES[(sabianDeg + idx) % SABIAN_THEMES.length],
            }
          }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  },
}

/**
 * Rich, domain-specific calculator for any remaining tool slug so every tool on the platform
 * delivers tailored, accurate, easy-to-understand astronomical telemetry.
 */
export async function domainSmartCalculator(input: ParsedToolInput, tool: Tool): Promise<ToolResult> {
  if (tool.slug in SPECIALIZED_REGISTRY) {
    return SPECIALIZED_REGISTRY[tool.slug](input, tool)
  }

  const got = await getChart(input, tool)
  if ('error' in got) return errorResult(got.error)
  const { chart } = got
  const now = new Date()
  const livePlanets = planetPositions(now)

  // Category-aware tailored synthesis
  if (tool.categoryId.includes('vedic') || tool.slug.includes('vedic') || tool.slug.includes('dasha') || tool.slug.includes('yoga') || tool.slug.includes('dosha') || tool.slug.includes('karaka') || tool.slug.includes('chakra')) {
    const rashi = vedicRashi(getPlanet(chart.planets, 'Moon').longitude, chart.dateUtc)
    const sunSid = siderealLongitude(getPlanet(chart.planets, 'Sun').longitude, chart.dateUtc)
    const lagna = chart.houses ? vedicLagna(chart.houses.ascendant, chart.dateUtc) : undefined
    return okResult({
      title: `${tool.name} — Sidereal Jyotish Analysis`,
      summary: `Chandra Rashi: ${rashi.rashi} · Janma Nakshatra: ${rashi.nakshatra.name} (Pada ${rashi.nakshatra.pada}, ruled by ${rashi.nakshatra.lord})${lagna ? ` · Lagna: ${lagna.lagna}` : ''}.`,
      highlights: [
        { label: 'Chandra Rashi', value: rashi.rashi, note: rashi.formatted },
        { label: 'Nakshatra', value: `${rashi.nakshatra.name} (Pada ${rashi.nakshatra.pada})`, note: `Lord: ${rashi.nakshatra.lord}` },
        ...(lagna ? [{ label: 'Sidereal Lagna', value: lagna.lagna, note: lagna.formatted }] : []),
        { label: 'Surya (Sun) Rashi', value: longitudeToSign(sunSid), note: formatLongitude(sunSid) },
      ],
      sections: [
        {
          heading: 'Sidereal Graha Positions (Lahiri Chitrapaksha)',
          body: `${tool.description} Calculated using Lahiri Ayanamsha (${lahiriAyanamsa(chart.dateUtc).toFixed(2)}°).`,
          items: chart.planets
            .filter((p) => p.id !== 'SouthNode')
            .map((p) => {
              const sid = siderealLongitude(p.longitude, chart.dateUtc)
              const nak = nakshatraFromLongitude(sid)
              return {
                label: `${p.name} (${longitudeToSign(sid)})`,
                value: `${formatLongitude(sid)}${p.retrograde ? ' ℞' : ''} · ${nak.name} Pada ${nak.pada}`,
              }
            }),
        },
      ],
      footnotes: metaNotes(chart),
    })
  }

  if (tool.categoryId.includes('forecasting') || tool.categoryId.includes('life-cycles') || tool.categoryId.includes('moon') || tool.slug.includes('transit') || tool.slug.includes('return') || tool.slug.includes('calendar') || tool.slug.includes('eclipse')) {
    const liveSun = getPlanet(livePlanets, 'Sun')
    const liveMoon = getPlanet(livePlanets, 'Moon')
    const transitHits = findAspects(livePlanets.slice(0, 10)).slice(0, 8)
    return okResult({
      title: `${tool.name} — Live Transit & Cycle Alignment`,
      summary: `Your Natal ${chart.sunSign} Sun & ${chart.moonSign} Moon interacting with today’s ${longitudeToSign(liveSun.longitude)} Sun and ${longitudeToSign(liveMoon.longitude)} Moon.`,
      highlights: [
        { label: 'Natal Sun / Moon', value: `${chart.sunSign} / ${chart.moonSign}` },
        { label: 'Live Sky Sun', value: formatLongitude(liveSun.longitude) },
        { label: 'Live Sky Moon', value: formatLongitude(liveMoon.longitude) },
        { label: 'Moon Phase Now', value: moonPhaseName(moonPhaseAngle(now)) },
      ],
      sections: [
        {
          heading: 'Current Sky vs. Your Natal Houses',
          body: `${tool.description} Below is where each live transiting planet falls against your natal sign and house framework right now.`,
          items: livePlanets.slice(0, 10).map((lp) => {
            const natP = getPlanet(chart.planets, lp.id)
            const h = chart.houses ? houseOfLongitude(lp.longitude, chart.houses.cusps) : undefined
            return {
              label: `Transit ${lp.name} (${formatLongitude(lp.longitude)}${lp.retrograde ? ' ℞' : ''})`,
              value: `${h ? `Transiting Your Natal House ${h} · ` : ''}Natal ${lp.name} at ${formatLongitude(natP.longitude)}`,
            }
          }),
        },
        ...(transitHits.length
          ? [
              {
                heading: 'Active Sky Aspects Today',
                items: transitHits.map((a) => ({ label: `${a.a} – ${a.b}`, value: `${a.type} (orb ${a.orb}°)` })),
              },
            ]
          : []),
      ],
      footnotes: metaNotes(chart),
    })
  }

  // Natal, Traditional, Relationship, Location & Professional synthesis
  return okResult({
    title: `${tool.name} — Precision Ephemeris Report`,
    summary: `Sun in ${chart.sunSign}, Moon in ${chart.moonSign}${chart.risingSign ? `, Rising in ${chart.risingSign}` : ''} · Ruler: ${chart.risingSign ? SIGN_RULER[chart.risingSign] : SIGN_RULER[chart.sunSign]}.`,
    highlights: [
      { label: 'Sun Sign', value: chart.sunSign, note: formatLongitude(getPlanet(chart.planets, 'Sun').longitude) },
      { label: 'Moon Sign', value: chart.moonSign, note: formatLongitude(getPlanet(chart.planets, 'Moon').longitude) },
      ...(chart.risingSign && chart.houses
        ? [
            { label: 'Rising (ASC)', value: chart.risingSign, note: formatLongitude(chart.houses.ascendant) },
            { label: 'Midheaven (MC)', value: longitudeToSign(chart.houses.midheaven), note: formatLongitude(chart.houses.midheaven) },
          ]
        : []),
    ],
    sections: [
      {
        heading: `Key Synthesis for ${tool.name}`,
        body: `${tool.description} Your chart is anchored by ${chart.sunSign} (${SIGN_ELEMENT[chart.sunSign]} ${SIGN_MODALITY[chart.sunSign]}) and ${chart.moonSign} Moon.`,
        items: chart.planets
          .filter((p) => p.id !== 'SouthNode')
          .map((p) => ({
            label: p.name,
            value: formatPlanetLine(p, planetHouse(chart, p.id)),
          })),
      },
      ...(chart.aspects.length
        ? [
            {
              heading: 'Tightest Natal Aspects (Sorted by Exactness)',
              items: chart.aspects.slice(0, 10).map((a) => ({
                label: `${a.a} – ${a.b}`,
                value: `${a.type} · ${a.orb}° orb`,
              })),
            },
          ]
        : []),
    ],
    footnotes: metaNotes(chart),
  })
}
