export const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const

export type SignName = (typeof SIGNS)[number]

export const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'] as const
export type ElementName = (typeof ELEMENTS)[number]

export const MODALITIES = ['Cardinal', 'Fixed', 'Mutable'] as const
export type ModalityName = (typeof MODALITIES)[number]

export const SIGN_ELEMENT: Record<SignName, ElementName> = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water',
}

export const SIGN_MODALITY: Record<SignName, ModalityName> = {
  Aries: 'Cardinal',
  Taurus: 'Fixed',
  Gemini: 'Mutable',
  Cancer: 'Cardinal',
  Leo: 'Fixed',
  Virgo: 'Mutable',
  Libra: 'Cardinal',
  Scorpio: 'Fixed',
  Sagittarius: 'Mutable',
  Capricorn: 'Cardinal',
  Aquarius: 'Fixed',
  Pisces: 'Mutable',
}

export const SIGN_RULER: Record<SignName, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
}

export const SIGN_BLURBS: Record<SignName, string> = {
  Aries: 'Bold starts, direct drive, and a pioneering edge.',
  Taurus: 'Steady values, sensory pleasure, and lasting loyalty.',
  Gemini: 'Curious mind, quick connections, and flexible thinking.',
  Cancer: 'Protective feeling, memory, and care for home base.',
  Leo: 'Warm presence, creative pride, and generous heart.',
  Virgo: 'Practical craft, useful detail, and quiet improvement.',
  Libra: 'Balance, beauty, and relating with fairness.',
  Scorpio: 'Depth, intensity, and transformative honesty.',
  Sagittarius: 'Big-picture faith, exploration, and candid truth.',
  Capricorn: 'Ambition, structure, and long-range responsibility.',
  Aquarius: 'Original perspective, community ideals, and future focus.',
  Pisces: 'Empathy, imagination, and permeable boundaries.',
}

export function normalizeDegrees(deg: number): number {
  const n = deg % 360
  return n < 0 ? n + 360 : n
}

export function longitudeToSign(lon: number): SignName {
  return SIGNS[Math.floor(normalizeDegrees(lon) / 30)]
}

export function signDegree(lon: number): number {
  return normalizeDegrees(lon) % 30
}

export function formatLongitude(lon: number): string {
  const sign = longitudeToSign(lon)
  const deg = signDegree(lon)
  const whole = Math.floor(deg)
  const minutes = Math.floor((deg - whole) * 60)
  return `${sign} ${whole}°${String(minutes).padStart(2, '0')}′`
}

export function formatSignOnly(lon: number): string {
  return longitudeToSign(lon)
}
