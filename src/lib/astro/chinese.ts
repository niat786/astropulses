const ANIMALS = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
] as const

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const

const ANIMAL_BLURB: Record<(typeof ANIMALS)[number], string> = {
  Rat: 'Resourceful, quick-witted, and socially agile.',
  Ox: 'Steady, dependable, and quietly determined.',
  Tiger: 'Bold, magnetic, and fiercely independent.',
  Rabbit: 'Gentle, diplomatic, and comfort-seeking.',
  Dragon: 'Ambitious, dramatic, and larger than life.',
  Snake: 'Wise, private, and strategically patient.',
  Horse: 'Energetic, freedom-loving, and expressive.',
  Goat: 'Artistic, kind, and harmony-oriented.',
  Monkey: 'Inventive, playful, and adaptable.',
  Rooster: 'Sharp, organized, and proudly precise.',
  Dog: 'Loyal, principled, and protective.',
  Pig: 'Generous, sincere, and pleasure-loving.',
}

/**
 * Approximate Chinese New Year (Gregorian) for 1900–2100.
 * Uses a compact lookup for common years + fallback Jan 31.
 */
const CNY: Record<number, [number, number]> = {
  1984: [2, 2],
  1985: [2, 20],
  1986: [2, 9],
  1987: [1, 29],
  1988: [2, 17],
  1989: [2, 6],
  1990: [1, 27],
  1991: [2, 15],
  1992: [2, 4],
  1993: [1, 23],
  1994: [2, 10],
  1995: [1, 31],
  1996: [2, 19],
  1997: [2, 7],
  1998: [1, 28],
  1999: [2, 16],
  2000: [2, 5],
  2001: [1, 24],
  2002: [2, 12],
  2003: [2, 1],
  2004: [1, 22],
  2005: [2, 9],
  2006: [1, 29],
  2007: [2, 18],
  2008: [2, 7],
  2009: [1, 26],
  2010: [2, 14],
  2011: [2, 3],
  2012: [1, 23],
  2013: [2, 10],
  2014: [1, 31],
  2015: [2, 19],
  2016: [2, 8],
  2017: [1, 28],
  2018: [2, 16],
  2019: [2, 5],
  2020: [1, 25],
  2021: [2, 12],
  2022: [2, 1],
  2023: [1, 22],
  2024: [2, 10],
  2025: [1, 29],
  2026: [2, 17],
}

function chineseYearForDate(year: number, month: number, day: number): number {
  const cny = CNY[year] ?? [2, 1]
  const before = month < cny[0] || (month === cny[0] && day < cny[1])
  return before ? year - 1 : year
}

export function chineseZodiac(year: number, month: number, day: number) {
  const cy = chineseYearForDate(year, month, day)
  // 1984 = Rat Wood
  const animal = ANIMALS[((cy - 1984) % 12 + 12) % 12]
  const element = ELEMENTS[Math.floor((((cy - 1984) % 10 + 10) % 10) / 2)]
  const yinYang = (cy - 1984) % 2 === 0 ? 'Yang' : 'Yin'
  return {
    animal,
    element,
    yinYang,
    chineseYear: cy,
    label: `${element} ${animal}`,
    blurb: ANIMAL_BLURB[animal],
  }
}
