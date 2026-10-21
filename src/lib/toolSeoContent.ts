import type { Tool, ToolCategory, ToolField } from '../data/tools'
import { toolImageSrc } from '../data/tools'

export type ToolFaq = {
  question: string
  answer: string
}

export type ToolComparisonRow = {
  approach: string
  whatItDoes: string
  whatItCannotDo: string
  bestFor: string
}

export type ToolSeoPackage = {
  serpTitle: string
  metaDescription: string
  definitionLead: string
  boundaryContrast: string
  verdictLine: string
  comparisonIntro: string
  comparisonRows: ToolComparisonRow[]
  limitationsBody: string
  faqs: ToolFaq[]
}

const fieldCopy: Record<ToolField, { label: string; example: string; why: string }> = {
  name: {
    label: 'your name (optional)',
    example: 'Maya',
    why: 'Labels your report. It never alters the planet math.',
  },
  date: {
    label: 'birth date',
    example: 'September 18, 1992',
    why: 'Locks the calendar day so we can find each planet on the ecliptic.',
  },
  time: {
    label: 'birth time',
    example: '8:42 AM',
    why: 'Fixes the eastern horizon, the Ascendant degree, and all 12 house cusps.',
  },
  place: {
    label: 'birth city',
    example: 'London, UK',
    why: 'Provides exact latitude, longitude, and historical time zone offset.',
  },
  partnerName: {
    label: 'partner name (optional)',
    example: 'Liam',
    why: 'Labels the second chart in a relationship comparison.',
  },
  partnerDate: {
    label: 'partner birth date',
    example: 'March 24, 1990',
    why: 'Computes the second person’s planetary longitudes.',
  },
  partnerTime: {
    label: 'partner birth time',
    example: '2:15 PM',
    why: 'Unlocks accurate house overlays and composite angles.',
  },
  partnerPlace: {
    label: 'partner birth city',
    example: 'New York, USA',
    why: 'Sets the second person’s local horizon and UTC conversion.',
  },
}

function uniqueFields(tool: Tool): ToolField[] {
  const seen = new Set<ToolField>()
  const out: ToolField[] = []
  for (const f of tool.fields) {
    if (!seen.has(f)) {
      seen.add(f)
      out.push(f)
    }
  }
  return out
}

function cleanPeriod(text: string): string {
  return text.trim().replace(/\.$/, '')
}

function lowerFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/**
 * Generates a punchy <title> tag strictly under 58 characters (no brand suffix)
 * so Google SERPs never truncate the headline with ellipses.
 */
export function buildToolSerpTitle(tool: Tool): string {
  const base = tool.name.trim()
  const withFree = `Free ${base} (Instant & Accurate)`
  if (withFree.length <= 57) return withFree

  const withInstant = `${base}: Free Instant Calculator`
  if (withInstant.length <= 57) return withInstant

  const withYear = `${base} (Free 2026 Tool)`
  if (withYear.length <= 57) return withYear

  if (base.length <= 57) return base
  return `${base.slice(0, 54).trim()}...`
}

/**
 * Generates a complete, click-worthy meta description (120–155 chars)
 * with power words and the primary keyword front-loaded.
 */
export function buildToolMetaDescription(tool: Tool): string {
  const desc = cleanPeriod(tool.description)
  const candidate = `${desc}. Run our free ${tool.name} for instant, accurate server ephemeris results in plain English.`
  if (candidate.length >= 120 && candidate.length <= 155) return candidate

  const shortCandidate = `${desc}. Use this free ${tool.name} for fast, accurate results in plain language.`
  if (shortCandidate.length <= 155) {
    if (shortCandidate.length < 115) {
      return `${shortCandidate} Zero sign-up required.`
    }
    return shortCandidate
  }

  return `${desc.slice(0, 112).trim()}. Free instant ${tool.name} with plain-English results.`
}

/**
 * Builds the GEO Definition Engineering paragraph, Comparison Table, Limitations, and 5 Direct-Answer FAQs.
 */
export function getToolSeoPackage(tool: Tool, category: ToolCategory): ToolSeoPackage {
  const fields = uniqueFields(tool)
  const needsTime = fields.includes('time') || fields.includes('partnerTime')
  const needsPlace = fields.includes('place') || fields.includes('partnerPlace')
  const needsPartner = fields.some((f) => f.startsWith('partner'))
  const isVedic = tool.categoryId.includes('vedic') || tool.slug.includes('nakshatra') || tool.slug.includes('dasha') || tool.slug.includes('rashi')

  const purpose = lowerFirst(cleanPeriod(tool.description))

  // Step 2 Definition Engineering: [X] is a [category noun] that [verb1], [verb2], and [verb3] to [purpose]
  const definitionLead = `The ${tool.name} is a precision ${category.name.toLowerCase().replace(/tools$/i, '').trim()} calculator that reads your birth data, computes exact planetary longitudes on our server ephemeris, and translates the math to ${purpose}.`

  const boundaryContrast = isVedic
    ? `Not a generic Western sun-sign widget that ignores Earth's axial wobble, but a true sidereal Jyotish engine calibrated to the Lahiri Chitrapaksha ayanamsha (~24°13′ offset in 2026).`
    : needsPartner
      ? `Not a one-size-fits-all sign match table, but a two-chart astronomical comparison that measures exact degree angles between both people.`
      : `Not a static date-range lookup table that guesses your sign on cusp days, but a live astronomical solver powered by VSOP87 and J2000 orbital elements.`

  const verdictLine = `Real sky math. Plain English.`

  const comparisonIntro = `Most astrology pages rely on static date tables or expose raw client-side scripts. Here is how the AstroPulses ${tool.name} compares to standard tools.`

  const comparisonRows: ToolComparisonRow[] = [
    {
      approach: `AstroPulses ${tool.name}`,
      whatItDoes: `Computes exact sub-arcminute positions on the server (${isVedic ? 'Lahiri Sidereal' : 'VSOP87 Tropical'}) and explains your result in clear, everyday language.`,
      whatItCannotDo: `Cannot predict fixed fate or replace licensed medical, legal, or financial counsel.`,
      bestFor: `Readers who want fast, accurate chart math without learning dense jargon.`,
    },
    {
      approach: 'Newspaper Date Tables',
      whatItDoes: 'Estimates your sign from a rough 30-day calendar window.',
      whatItCannotDo: 'Cannot handle cusp days, birth times, city coordinates, or Moon and Rising shifts.',
      bestFor: 'Casual entertainment when you only know a birth month.',
    },
    {
      approach: 'Raw Desktop Ephemeris Grids',
      whatItDoes: 'Prints degree tables and aspect glyphs for technical astrologers.',
      whatItCannotDo: 'Does not translate what those degrees mean for your daily life, relationships, or timing.',
      bestFor: 'Advanced practitioners who already read raw degree notation.',
    },
  ]

  const limitationsBody = needsTime
    ? `This calculator depends on an accurate birth time. Because the eastern horizon shifts 1° every 4 minutes, a birth time that is off by 30 minutes can move house cusps by 7.5°. If you do not know your birth time, check the "unknown time" box. We will run a noon chart and flag which angles are estimates.`
    : `This calculator uses astronomical positions for self-reflection and pattern recognition. While the planetary coordinates are mathematically exact, how you work with those themes in real life is always your choice.`

  const requiredList = fields
    .filter((f) => f !== 'name' && f !== 'partnerName')
    .map((f) => `${fieldCopy[f].label} (e.g. ${fieldCopy[f].example})`)
    .join(', ')

  const faqs: ToolFaq[] = [
    {
      question: `What is the ${tool.name} and how does it work?`,
      answer: `${definitionLead} ${boundaryContrast} You enter your birth details once, and the server returns a cryptographic verification seal with a plain-English breakdown.`,
    },
    {
      question: `What birth details do I need for the ${tool.name}?`,
      answer: requiredList
        ? `You need ${requiredList}. ${needsTime ? 'Check your birth certificate or hospital record for the closest minute, because the Ascendant and houses shift every four minutes.' : 'You do not need an exact birth time for this specific tool.'}`
        : `You only need the birth date and time shown on the form above to run an instant calculation.`,
    },
    {
      question: `How accurate is the ${tool.name} compared to desktop software?`,
      answer: `The ${tool.name} uses the VSOP87 planetary theory and J2000 astronomical frame on the server, matching professional ephemeris tables within 1 arcminute (0.016°). Additionally, our geocoder resolves your exact birth city coordinates and historical IANA time zone before running the math.`,
    },
    {
      question: `What if I don't know my exact birth time?`,
      answer: needsTime
        ? `Check the "I don't know my birth time" box on the form. The calculator will default to 12:00 PM local time so you can still read your planetary signs, while noting that your Rising sign and 12 house cusps require a verified time.`
        : `No problem at all. The ${tool.name} works accurately from your birth date alone, though adding a birth time unlocks deeper house context on related tools.`,
    },
    {
      question: `Is my birth data stored when I use the ${tool.name}?`,
      answer: `No. Your birth date, time, and city are processed in memory on our Cloudflare Worker solely to render your result page and are discarded immediately after the response is sent.`,
    },
  ]

  return {
    serpTitle: buildToolSerpTitle(tool),
    metaDescription: buildToolMetaDescription(tool),
    definitionLead,
    boundaryContrast,
    verdictLine,
    comparisonIntro,
    comparisonRows,
    limitationsBody,
    faqs,
  }
}

export function getToolFaqs(tool: Tool, category?: ToolCategory): ToolFaq[] {
  const fallbackCat: ToolCategory = category ?? {
    id: tool.categoryId,
    name: 'Astrology',
    homeCategoryId: 'start-here',
  }
  return getToolSeoPackage(tool, fallbackCat).faqs
}

export function toolSchemaGraph(tool: Tool, category: ToolCategory, faqs: ToolFaq[]) {
  const url = `https://astropulses.com/tools/${tool.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: 'LifestyleApplication',
      applicationSubCategory: category.name,
      operatingSystem: 'All (Web-based Server Ephemeris)',
      url,
      image: `https://astropulses.com${toolImageSrc(tool.slug)}`,
      description: buildToolMetaDescription(tool),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: 'AstroPulses',
        url: 'https://astropulses.com',
        logo: 'https://astropulses.com/images/brand/icon-512.png',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://astropulses.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: 'https://astropulses.com/tools',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://astropulses.com/tools#${category.id}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: tool.name,
          item: url,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ]
}
