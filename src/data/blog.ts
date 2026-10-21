import { moreBlogPosts } from './blogPostsMore'
import { toolImageSrc } from './tools'

export type BlogComparisonRow = {
  item: string
  whatItDoes: string
  whatItCannotDo: string
  bestFor: string
}

export type BlogPostSection = {
  id: string
  heading: string
  paragraphs: string[]
  verdict?: string
  callout?: {
    eyebrow: string
    text: string
  }
  quote?: string
  bullets?: {
    title: string
    body: string
  }[]
  comparisonTable?: {
    intro: string
    headers: [string, string, string, string]
    rows: BlogComparisonRow[]
  }
  toolSlug?: string
}

export type BlogPost = {
  slug: string
  serpTitle: string
  title: string
  subtitle: string
  description: string
  category: string
  categorySlug: string
  publishedAt: string
  modifiedAt: string
  readingMinutes: number
  featured?: boolean
  heroToolSlug: string
  primaryToolSlug: string
  relatedToolSlugs: string[]
  keyTakeaways: string[]
  lead: string
  sections: BlogPostSection[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const blogAuthor = {
  name: 'AstroPulses Editorial Team',
  role: 'Guides checked against live ephemeris data',
  url: 'https://astropulses.com/about',
}

export function formatBlogDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export const blogCategories = [
  { id: 'all', label: 'All Guides' },
  { id: 'chart-basics', label: 'Chart Basics' },
  { id: 'zodiac-signs', label: 'Zodiac Signs' },
  { id: 'moon-cycles', label: 'Moon Phases & Cycles' },
  { id: 'planetary-cycles', label: 'Planetary Cycles & Timing' },
  { id: 'relationships', label: 'Synastry & Relationships' },
  { id: 'vedic-jyotish', label: 'Vedic & Sidereal' },
  { id: 'relocation', label: 'Astrocartography & Space' },
  { id: 'hellenistic', label: 'Hellenistic & Traditional' },
] as const

const corePosts: BlogPost[] = [
  {
    slug: 'your-big-three-where-to-begin',
    serpTitle: 'What Is Your Big Three in Astrology? Complete Guide [2026]',
    title: 'What Is Your Big Three in Astrology? How Sun, Moon, and Rising Work Together',
    subtitle: 'Your Sun sign is only one-third of your story. Learn how your Sun, Moon, and Rising signs interact—and why two people born on the same day can feel worlds apart.',
    description: 'What is your Big Three in astrology? Learn how your Sun, Moon, and Rising signs work together, then find all three free in seconds, in plain English.',
    category: 'Chart Basics',
    categorySlug: 'chart-basics',
    publishedAt: '2026-09-08',
    modifiedAt: '2026-10-21',
    readingMinutes: 8,
    featured: true,
    heroToolSlug: 'big-three-calculator',
    primaryToolSlug: 'big-three-calculator',
    relatedToolSlugs: [
      'big-three-calculator',
      'birth-chart-generator',
      'rising-sign-finder',
      'moon-sign-finder',
    ],
    keyTakeaways: [
      'Your Sun moves 1° per day and shows your core drive and conscious direction.',
      'Your Moon moves 13.2° per day and rules your gut reactions, memory, and emotional safety.',
      'Your Rising sign shifts 1° every 4 minutes and sets all 12 house cusps in your birth chart.',
    ],
    lead: 'Most of us meet astrology through a single newspaper column. You read a blurb for your birth month, shrug because half of it sounds nothing like you, and close the tab. Here is why that happens. In astrology, the Big Three is a foundational natal triad that measures your solar position, tracks your lunar orbit, and fixes your eastern horizon to map your core personality.',
    sections: [
      {
        id: 'what-is-big-three',
        heading: 'What is the Big Three in astrology?',
        paragraphs: [
          'The Big Three in astrology is a three-point coordinate system that combines your Sun sign, Moon sign, and Rising sign (Ascendant) to summarize your natal chart.',
          'Not a one-line newspaper horoscope that lumps 650 million people into a single bucket, but a three-axis snapshot anchored to your exact birth minute and city.',
          'Why do these three points carry so much weight? Because each one tracks a different astronomical motion.',
          'The Sun tracks Earth’s 365.25-day orbit. The Moon tracks a fast 27.3-day loop around Earth. And the Rising sign tracks Earth’s 24-hour spin on its own axis.',
          'Three speeds. Three jobs.',
        ],
        verdict: 'Three speeds. Three jobs.',
        comparisonTable: {
          intro: 'Each member of your Big Three moves at a different speed and governs a distinct layer of your daily life. Compare what each placement can and cannot tell you below.',
          headers: ['Placement', 'Astronomical Motion', 'What It Shows', 'What It Cannot Show'],
          rows: [
            {
              item: 'Sun Sign',
              whatItDoes: 'Moves ~1° per day along the ecliptic (30 days per sign).',
              whatItCannotDo: 'Cannot explain your private emotional habits or your 12 house cusps.',
              bestFor: 'Long-term purpose, vitality, and conscious willpower.',
            },
            {
              item: 'Moon Sign',
              whatItDoes: 'Moves ~13.2° per day (2.25 days per sign).',
              whatItCannotDo: 'Cannot set your chart angles or public career house.',
              bestFor: 'Emotional safety, gut instincts, and what you need when stressed.',
            },
            {
              item: 'Rising Sign (Ascendant)',
              whatItDoes: 'Moves ~1° every 4 minutes on the eastern horizon.',
              whatItCannotDo: 'Cannot be calculated without a birth time and city.',
              bestFor: 'First impressions, physical posture, and your 12-house grid.',
            },
          ],
        },
        toolSlug: 'big-three-calculator',
      },
      {
        id: 'how-sun-works',
        heading: 'What does your Sun sign actually do?',
        paragraphs: [
          'Think of your chart like a long road trip. Your Sun sign is the destination on the map and the fuel in the tank.',
          'Astronomically, the Sun marks where Earth stood in its yearly orbit when you took your first breath. In plain English, it shows what recharges your battery when nobody is forcing you to perform.',
          'You don’t always act like your Sun sign at breakfast. Instead, you grow into your Sun sign year by year.',
          'It is your deliberate fuel.',
        ],
        verdict: 'It is your deliberate fuel.',
        callout: {
          eyebrow: 'Quick Self-Check',
          text: 'Ask yourself: What kind of work makes me feel proud and wide awake even after a long day? That is your Sun sign talking.',
        },
        toolSlug: 'zodiac-sign-finder',
      },
      {
        id: 'how-moon-works',
        heading: 'Why does your Moon sign feel more private than your Sun?',
        paragraphs: [
          'If the Sun is who you are at noon in a meeting, the Moon is who you are at 11:00 PM in your kitchen.',
          'Because the Moon travels 13.2° every 24 hours, it shifts signs every two and a half days. Consequently, two people born in the same week share a Sun sign yet process stress in opposite ways.',
          'A Fire Moon (Aries, Leo, Sagittarius) burns off tension through movement and direct talk. An Air Moon (Gemini, Libra, Aquarius) needs conversation and mental breathing room. An Earth Moon (Taurus, Virgo, Capricorn) steadies itself by fixing practical details. A Water Moon (Cancer, Scorpio, Pisces) needs quiet space to feel things all the way through.',
          'The Moon rules your reflexes.',
        ],
        verdict: 'The Moon rules your reflexes.',
        toolSlug: 'moon-sign-finder',
      },
      {
        id: 'how-rising-works',
        heading: 'How does your Rising sign shape your entire birth chart?',
        paragraphs: [
          'Your Rising sign (or Ascendant) is the exact zodiac sign rising over the eastern horizon at the minute and city of your birth.',
          'Here is the detail beginners often miss. Your Rising sign does not just describe your "first impression." It locks in all 12 houses of your chart.',
          'For example, if you have Libra Rising, Libra becomes your 1st House of self. Scorpio becomes your 2nd House of money. Aries becomes your 7th House of partnership. On top of that, the planetary ruler of your Rising sign (Venus for Libra) becomes the steering wheel of your entire chart.',
          'Horizon sets the grid.',
        ],
        verdict: 'Horizon sets the grid.',
        bullets: [
          {
            title: '1st House Anchor',
            body: 'The sign on your eastern horizon always defines your 1st House of body, approach, and personal agency.',
          },
          {
            title: 'The Chart Ruler',
            body: 'The traditional planet that rules your Rising sign acts as the captain of your birth chart.',
          },
          {
            title: 'Why 4 Minutes Matter',
            body: 'Earth rotates 1° every 4 minutes. A 20-minute shift in birth time moves your Ascendant by 5 full degrees.',
          },
        ],
        toolSlug: 'rising-sign-finder',
      },
      {
        id: 'limitations-big-three',
        heading: 'What are the limitations of reading only your Big Three?',
        paragraphs: [
          'Let’s be honest about where the Big Three falls short. Stopping at your Sun, Moon, and Rising leaves out Mercury (how you speak), Venus (how you love), Mars (how you fight), and Saturn (where you build grit).',
          'Second, if your birth time comes from a rough family memory ("sometime around dinner"), your Rising sign could be off by an entire sign. Always verify your birth certificate before trusting house placements.',
          'Treat the Big Three as your headline, not the whole book.',
        ],
        verdict: 'Headline, not the whole book.',
        toolSlug: 'birth-chart-generator',
      },
    ],
    faqs: [
      {
        question: 'What is the Big Three in astrology?',
        answer: 'The Big Three in astrology refers to your Sun sign, Moon sign, and Rising sign (Ascendant). Together, they summarize your conscious drive (Sun), emotional instincts (Moon), and the 12-house structure of your birth chart (Rising).',
      },
      {
        question: 'Which of the Big Three is most important?',
        answer: 'All three work as a single system, but ancient Hellenistic astrologers prioritized the Rising sign and Moon because the Rising sign sets all 12 houses and the Moon changes degrees every two hours.',
      },
      {
        question: 'Can I find my Big Three without a birth time?',
        answer: 'You can find your Sun sign and usually your Moon sign with just a birth date, unless the Moon changed signs that day. However, you cannot calculate an accurate Rising sign without a birth time and city because the horizon shifts a full sign roughly every two hours.',
      },
      {
        question: 'Why do I relate to my Moon or Rising sign more than my Sun sign?',
        answer: 'You feel your Moon sign in private moods and use your Rising sign in everyday social interactions. In contrast, if you were born at night (with the Sun below the horizon), your Moon and Rising sign often feel much louder in daily life.',
      },
      {
        question: 'Can two people have the exact same Big Three and still be different?',
        answer: 'Yes. Even with identical Sun, Moon, and Rising signs, people born in different years have completely different Mercury, Venus, Mars, Jupiter, and Saturn placements, plus different degree aspects.',
      },
    ],
  },
  {
    slug: 'why-your-exact-birth-time-matters',
    serpTitle: 'Why Does Exact Birth Time Matter in Astrology? [2026 Guide]',
    title: 'Why Does Exact Birth Time Matter in Astrology? The 4-Minute Rule Explained',
    subtitle: 'Planets move slowly across the sky, but Earth spins fast. See what changes every 4 minutes on your chart—and what you can still calculate when your birth time is unknown.',
    description: 'Why does birth time matter in astrology? Learn the 4-minute rule, see which placements change without an exact time, and test your own chart free.',
    category: 'Chart Basics',
    categorySlug: 'chart-basics',
    publishedAt: '2026-09-14',
    modifiedAt: '2026-10-21',
    readingMinutes: 9,
    featured: true,
    heroToolSlug: 'birth-time-accuracy-checker',
    primaryToolSlug: 'birth-time-accuracy-checker',
    relatedToolSlugs: [
      'birth-time-accuracy-checker',
      'birth-time-rectification-assistant',
      'rising-sign-finder',
      'midheaven-calculator',
    ],
    keyTakeaways: [
      'Earth rotates 360° in 24 hours, which shifts the eastern horizon by 1° every 4 minutes.',
      'The Moon travels 13.2° per day and can cross into a new zodiac sign on ~45% of calendar days.',
      'Even without a birth time, your Sun, Mercury, Venus, Mars, Jupiter, and Saturn signs stay 99% reliable.',
    ],
    lead: 'You text your mom to ask when you were born. She replies, "Around 3:00 PM, I think, right after shift change." Should you type 3:00 PM into a birth chart calculator? Birth time accuracy in astrology is the diurnal horizon measurement that converts a general planetary date table into a location-specific 12-house sky map.',
    sections: [
      {
        id: 'what-is-four-minute-rule',
        heading: 'What is the 4-minute rule in birth chart calculation?',
        paragraphs: [
          'The 4-minute rule is the astronomical fact that Earth’s rotation moves the eastern horizon (Ascendant) and meridian (Midheaven) forward by 1° of zodiacal longitude every 4 minutes of clock time.',
          'Not a slow planetary drift that takes weeks, but a rapid local rotation that sweeps through all 12 zodiac signs every single day.',
          'Let’s do the math. There are 1,440 minutes in a 24-hour day and 360 degrees in a circle. Divide 1,440 by 360 and you get 4.0 minutes per degree.',
          'Therefore, a 16-minute hospital rounding error shifts your Ascendant and Midheaven by 4 full degrees. If your true Ascendant sits at 28° Leo, a 15-minute guess pushes it into Virgo.',
          'One sign shift flips every house.',
        ],
        verdict: 'One sign shift flips every house.',
        comparisonTable: {
          intro: 'Not every part of your chart breaks when your birth time is missing. Use this table to see which placements require minute-level precision and which ones hold steady all day.',
          headers: ['Chart Factor', 'Speed of Motion', 'Works Without Birth Time?', 'What Happens If Time Is Off by 2 Hours'],
          rows: [
            {
              item: 'Ascendant & 12 Houses',
              whatItDoes: 'Moves 1° every 4 minutes (~15° per hour).',
              whatItCannotDo: 'Cannot be computed without birth time and city.',
              bestFor: 'Shifts by ~30° (an entire zodiac sign and house grid).',
            },
            {
              item: 'Moon Sign & Degree',
              whatItDoes: 'Moves ~0.55° per hour (~13.2° per day).',
              whatItCannotDo: 'Cannot verify exact aspect orbs or cusp-day sign changes.',
              bestFor: 'Drifts by ~1.1° (matters if Moon is at 29° of a sign).',
            },
            {
              item: 'Sun, Mercury, Venus, Mars',
              whatItDoes: 'Moves 0.5° to 1.6° per 24 hours.',
              whatItCannotDo: 'Cannot show which house they occupy without a time.',
              bestFor: 'Sign stays locked on 97% of days; only house placement is hidden.',
            },
          ],
        },
        toolSlug: 'birth-time-accuracy-checker',
      },
      {
        id: 'what-can-you-read-without-time',
        heading: 'What can you still calculate if your birth time is unknown?',
        paragraphs: [
          'Missing a birth time does not lock you out of astrology. On most days of the year, the Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto stay in the exact same zodiac sign from midnight to midnight.',
          'You can also still check most planet-to-planet aspects (except tight Moon ones) and run a Noon Chart to see your sign balance.',
          'Skip the houses. Read the planets.',
        ],
        verdict: 'Skip the houses. Read the planets.',
        toolSlug: 'birth-time-rectification-assistant',
      },
    ],
    faqs: [
      {
        question: 'Why does exact birth time matter in astrology?',
        answer: 'Exact birth time matters because Earth spins 1° every 4 minutes. That rotation determines your Rising sign (Ascendant), your Midheaven (MC), all 12 house cusps, and your exact Moon degree.',
      },
      {
        question: 'How much does a 15-minute difference in birth time change a chart?',
        answer: 'A 15-minute difference moves your Ascendant and Midheaven by roughly 3.75°. If your Rising sign is near the beginning (0°–3°) or end (27°–29°) of a sign, 15 minutes can shift your Rising sign and rotate all 12 Whole Sign houses.',
      },
      {
        question: 'Why should I use 12:00 PM (Noon) if I don’t know my birth time?',
        answer: 'Setting an unknown birth time to 12:00 PM local time places you in the exact middle of the 24-hour day. This minimizes the maximum possible error for the Moon’s degree to ±6.6°.',
      },
      {
        question: 'Where can I find my exact time of birth?',
        answer: 'Request a copy of your long-form (vault) birth certificate from the vital records office in the city or state where you were born, or check original hospital crib cards and baby books.',
      },
    ],
  },
  {
    slug: 'saturn-return-navigation-guide',
    serpTitle: 'Saturn Return Calculator & Guide: Ages 27–30 Explained',
    title: 'What Is a Saturn Return? How to Navigate Your Late-Twenties Reset (Ages 27–30)',
    subtitle: 'Saturn takes 29.5 years to circle the Sun. Discover why your late twenties feel like a structural audit—and how to tell whether you have a single pass or a three-pass retrograde cycle.',
    description: 'What is a Saturn Return? Learn why it hits between ages 27 and 30, how the 29.5-year orbit works, and calculate your exact Saturn Return dates in seconds.',
    category: 'Planetary Cycles & Timing',
    categorySlug: 'planetary-cycles',
    publishedAt: '2026-09-19',
    modifiedAt: '2026-10-21',
    readingMinutes: 10,
    featured: false,
    heroToolSlug: 'saturn-return-calculator',
    primaryToolSlug: 'saturn-return-calculator',
    relatedToolSlugs: [
      'saturn-return-calculator',
      'jupiter-return-calculator',
      'annual-profection-calculator',
      'astrological-age-milestones',
    ],
    keyTakeaways: [
      'Saturn completes one full orbit around the Sun every 29.46 Earth years.',
      'Your first Saturn Return begins when transiting Saturn enters your natal Saturn sign (around age 27–30) and peaks at your exact natal degree.',
      'Roughly 60% of people experience three exact degree hits over 9 months due to Saturn’s annual retrograde loop.',
    ],
    lead: 'Somewhere around your 28th birthday, the life you built at 21 starts feeling two sizes too small. A job you tolerated suddenly drains you, or a relationship demands a real commitment. A Saturn Return is a 29.5-year orbital alignment that occurs when transiting Saturn returns to the exact ecliptic degree and sign it occupied at the moment of your birth.',
    sections: [
      {
        id: 'what-is-saturn-return',
        heading: 'What is a Saturn Return and when does it happen?',
        paragraphs: [
          'A Saturn Return is an astrological milestone that happens every 29.46 years when the planet Saturn completes one full orbit around the Sun and aligns with its birth position.',
          'Not a random streak of bad luck, but a scheduled structural audit of your time, boundaries, and long-term commitments.',
          'Because Saturn spends about 2.5 years in each zodiac sign, you feel the "sign ingress" first. Then, as transiting Saturn closes within 2° of your natal Saturn degree, the pressure peaks.',
          'Your first window lands between ages 27 and 30. Your second arrives between ages 56 and 60. Your third arrives around ages 86 to 89.',
          'Saturn tests load-bearing walls.',
        ],
        verdict: 'Saturn tests load-bearing walls.',
        comparisonTable: {
          intro: 'Because Earth orbits the Sun faster than Saturn, Saturn appears to move backward (retrograde) for 4.5 months every year. Here is how a single-pass Saturn Return compares to a three-pass retrograde cycle.',
          headers: ['Cycle Pattern', 'How It Works', 'Duration', 'How It Feels in Real Life'],
          rows: [
            {
              item: 'Single-Pass Return (~40% of people)',
              whatItDoes: 'Saturn crosses your natal degree once at direct speed and keeps moving.',
              whatItCannotDo: 'Does not drag the exact degree crisis across multiple seasons.',
              bestFor: 'One decisive turning point, contract, or clean break.',
            },
            {
              item: 'Three-Pass Return (~60% of people)',
              whatItDoes: 'Crosses direct (Pass 1), retrogrades back across (Pass 2), then finishes direct (Pass 3).',
              whatItCannotDo: 'Cannot be rushed in a single week; requires a 9-month process.',
              bestFor: '1) Notice the flaw, 2) Redesign the plan, 3) Lock in the new foundation.',
            },
          ],
        },
        toolSlug: 'saturn-return-calculator',
      },
      {
        id: 'day-vs-night-saturn',
        heading: 'Why do day charts and night charts experience Saturn differently?',
        paragraphs: [
          'In traditional Hellenistic astrology, sect (whether you were born during the day or at night) changes how Saturn behaves.',
          'If you were born during the day (with the Sun in Houses 7 through 12), Saturn belongs to your daytime team. Day-chart Saturn returns often look like heavy promotions, taking ownership of a business, or earning a hard credential.',
          'If you were born at night (Sun in Houses 1 through 6), Saturn is out of sect. Night-chart returns often feel sharper at first: cutting ties with draining obligations, setting fierce boundaries, or rebuilding from scratch.',
          'Sect sets the tone.',
        ],
        verdict: 'Sect sets the tone.',
        toolSlug: 'sect-calculator',
      },
    ],
    faqs: [
      {
        question: 'What age does your Saturn Return start and end?',
        answer: 'Your first Saturn Return starts between ages 27 and 28 when Saturn enters your natal Saturn sign, peaks near age 29.5 at your exact natal degree, and ends around age 30 when Saturn leaves that sign.',
      },
      {
        question: 'Does a Saturn Return always mean a breakup or career change?',
        answer: 'No. Saturn removes weak structures and cements strong ones. Solid relationships often get married or buy a home during a Saturn Return, while fragile arrangements that you have outgrown tend to end.',
      },
      {
        question: 'How do I know which area of life my Saturn Return will affect?',
        answer: 'Check the Whole Sign house where your natal Saturn lives. For example, Saturn in the 10th house tests your career and public reputation, while Saturn in the 7th house tests one-on-one partnerships and contracts.',
      },
    ],
  },
  {
    slug: 'synastry-vs-composite-charts-explained',
    serpTitle: 'Synastry vs Composite Chart: Key Differences Explained',
    title: 'Synastry vs. Composite Charts: What Is the Difference in Relationship Astrology?',
    subtitle: 'Why some couples have electric chemistry on a first date but struggle to share a calendar—and how comparing Synastry with a Composite chart reveals both sides.',
    description: 'Synastry vs Composite chart: learn the exact difference between two-chart overlays and midpoint relationship charts, plus when to use each calculator.',
    category: 'Synastry & Relationships',
    categorySlug: 'relationships',
    publishedAt: '2026-09-25',
    modifiedAt: '2026-10-21',
    readingMinutes: 9,
    featured: false,
    heroToolSlug: 'synastry-chart-calculator',
    primaryToolSlug: 'synastry-chart-calculator',
    relatedToolSlugs: [
      'synastry-chart-calculator',
      'composite-chart-calculator',
      'davison-relationship-chart',
      'love-compatibility-score',
    ],
    keyTakeaways: [
      'Synastry overlays Person A’s planets onto Person B’s chart to measure chemistry, triggers, and attraction.',
      'A Composite chart calculates the exact mathematical midpoints between both charts to treat the relationship as a third entity.',
      'Strong synastry sparks the bond; a supported composite chart sustains it over decades.',
    ],
    lead: 'Have you ever met someone where the conversation sparked in five minutes, yet planning a simple weekend trip together felt impossible? Relationship astrology uses two distinct tools to explain that gap. Synastry is a two-chart comparison method that overlays one person’s natal planets onto a partner’s houses to measure direct chemistry, while a Composite chart calculates the exact shortest-arc midpoints between both charts to map the relationship itself.',
    sections: [
      {
        id: 'synastry-vs-composite-difference',
        heading: 'How is a Synastry chart different from a Composite chart?',
        paragraphs: [
          'Think of two musicians playing a duet. Synastry measures how your guitar sounds next to their piano. A Composite chart is the actual song you record together.',
          'In Synastry, neither chart changes. We simply measure the angle between your Venus and their Mars, or see which of your houses holds their Moon.',
          'In a Composite chart, we add your Sun degree to their Sun degree and divide by two to find the shortest-arc midpoint. That creates a brand-new third chart.',
          'Synastry is chemistry. Composite is structure.',
        ],
        verdict: 'Synastry is chemistry. Composite is structure.',
        comparisonTable: {
          intro: 'Both methods use exact planetary degrees, but they answer completely different relationship questions. Compare Synastry and Composite charts side by side below.',
          headers: ['Method', 'How It Is Calculated', 'What It Can Tell You', 'What It Cannot Tell You'],
          rows: [
            {
              item: 'Synastry Chart',
              whatItDoes: 'Overlays Chart A and Chart B to measure inter-chart aspects and house overlays.',
              whatItCannotDo: 'Cannot show the shared "third entity" purpose of a long-term marriage or business.',
              bestFor: 'Attraction, emotional triggers, communication style, and early dating.',
            },
            {
              item: 'Composite Chart',
              whatItDoes: 'Finds the mathematical shortest-arc midpoint between every planet pair.',
              whatItCannotDo: 'Cannot show who triggers whom in one-on-one disagreements.',
              bestFor: 'Long-term marriage weather, shared goals, and how the couple acts as a team.',
            },
          ],
        },
        toolSlug: 'composite-chart-calculator',
      },
    ],
    faqs: [
      {
        question: 'Should I check Synastry or the Composite chart first?',
        answer: 'Start with Synastry when you are dating or getting to know someone, because it shows immediate personal chemistry and how you affect each other. Check the Composite chart once you are building a committed partnership, living together, or co-founding a business.',
      },
      {
        question: 'Are squares and oppositions bad in Synastry?',
        answer: 'Not at all. A chart with only soft trines can feel comfortable but flat. A few squares between Mars, Venus, or the Sun create magnetic friction and momentum—as long as Moon and Mercury aspects provide kindness and clear talk.',
      },
    ],
  },
  {
    slug: 'tropical-vs-sidereal-vedic-zodiac',
    serpTitle: 'Tropical vs Sidereal Zodiac: Why Your Vedic Sign Changes',
    title: 'Tropical vs. Sidereal Zodiac: Why Is Your Vedic Astrology Sign Different?',
    subtitle: 'Did a Vedic calculator just tell you that you are one sign earlier than you thought? Here is the exact astronomy of Earth’s axial wobble—and why both systems are mathematically right.',
    description: 'Tropical vs Sidereal zodiac explained: learn why your Vedic Rashi sign shifts back by ~24 degrees, how Lahiri ayanamsha works, and compare both charts live.',
    category: 'Vedic & Sidereal',
    categorySlug: 'vedic-jyotish',
    publishedAt: '2026-10-01',
    modifiedAt: '2026-10-21',
    readingMinutes: 11,
    featured: false,
    heroToolSlug: 'tropical-sidereal-comparison',
    primaryToolSlug: 'tropical-sidereal-comparison',
    relatedToolSlugs: [
      'tropical-sidereal-comparison',
      'vedic-rashi-finder',
      'nakshatra-finder',
      'vimshottari-dasha-calculator',
    ],
    keyTakeaways: [
      'Both Western (Tropical) and Vedic (Sidereal) astrology use the exact same physical planet positions in space.',
      'They differ only in where 0° Aries starts: Tropical locks 0° Aries to the Spring Equinox, while Sidereal locks 0° Aries to fixed stars.',
      'In 2026, the Lahiri ayanamsha gap between the two zodiacs is ~24°13′, which shifts roughly 80% of placements back one sign.',
    ],
    lead: 'It is a classic shock for astrology readers. You spend your whole life knowing you are a Leo, then you run a Vedic Kundli calculator and discover you are a Cancer. Did NASA move the stars, or is one system broken? Neither. The Tropical vs. Sidereal zodiac difference is a reference-frame offset caused by the 25,772-year axial precession of the Earth, separating seasonal equinox coordinates from fixed-star constellations by ~24°13′ in 2026.',
    sections: [
      {
        id: 'why-two-zodiacs-differ',
        heading: 'Why do Tropical and Sidereal astrology give different signs?',
        paragraphs: [
          'Imagine measuring the temperature outside. One thermometer reads 20° Celsius and another reads 68° Fahrenheit. The air outside did not change—only the ruler changed.',
          'Western Tropical astrology anchors 0° Aries to the Northern Hemisphere vernal equinox (the exact moment day and night are equal in March).',
          'Vedic Sidereal astrology (Jyotish) anchors 0° Aries to fixed background stars, specifically opposite the bright star Spica (Chitra) in the Lahiri standard.',
          'Because Earth wobbles like a spinning top once every 25,772 years, the equinox drifts backward against the stars by 50.3 arcseconds a year. Over 2,000 years, that drift has grown to 24°13′.',
          'Same sky. Two rulers.',
        ],
        verdict: 'Same sky. Two rulers.',
        comparisonTable: {
          intro: 'Compare how the Tropical and Sidereal zodiacs define 0° Aries, what each system excels at, and where each one has limits.',
          headers: ['System', '0° Aries Anchor', 'What It Excels At', 'What It Does Not Measure'],
          rows: [
            {
              item: 'Tropical Zodiac (Western & Hellenistic)',
              whatItDoes: 'Locks 0° Aries to the exact Vernal Equinox (Earth–Sun seasonal angle).',
              whatItCannotDo: 'Does not track the 27 fixed-star Nakshatras or Vimshottari Dasha periods.',
              bestFor: 'Psychological portraits, seasonal archetypes, and Hellenistic timing.',
            },
            {
              item: 'Sidereal Zodiac (Vedic / Jyotish)',
              whatItDoes: 'Subtracts the Lahiri ayanamsha (~24°13′) to align with fixed star constellations.',
              whatItCannotDo: 'Should not be mixed with modern Western sign stereotypes without Jyotish rules.',
              bestFor: '27 Lunar Nakshatras, 120-year Vimshottari Dashas, and D9 Navamsa charts.',
            },
          ],
        },
        toolSlug: 'tropical-sidereal-comparison',
      },
    ],
    faqs: [
      {
        question: 'Which zodiac is more accurate: Tropical or Sidereal?',
        answer: 'Both are 100% astronomically accurate within their own coordinate frame. Tropical measures planets relative to Earth’s seasonal equinoxes, while Sidereal measures planets relative to fixed background constellations.',
      },
      {
        question: 'Why did my sign change when I checked my Vedic chart?',
        answer: 'Because the Lahiri ayanamsha subtracts about 24°13′ from every Tropical position. If your Tropical Sun is between 0° and 24° of a sign, subtracting 24° moves it into the previous zodiac sign.',
      },
    ],
  },
  {
    slug: 'astrocartography-planetary-lines-guide',
    serpTitle: 'What Is Astrocartography? How to Read Your World Map [2026]',
    title: 'What Is Astrocartography? How to Read Your Planetary Lines Across the Globe',
    subtitle: 'Why certain cities feel like an instant tailwind for your career or love life—and how your birth chart projects 40 angular lines across Earth.',
    description: 'What is astrocartography? Learn how MC, IC, AC, and DC planetary lines work on your world map, which lines boost career or love, and test any city live.',
    category: 'Astrocartography & Space',
    categorySlug: 'relocation',
    publishedAt: '2026-10-03',
    modifiedAt: '2026-10-21',
    readingMinutes: 10,
    featured: false,
    heroToolSlug: 'astrocartography-map',
    primaryToolSlug: 'astrocartography-map',
    relatedToolSlugs: [
      'astrocartography-map',
      'relocation-chart-calculator',
      'best-city-for-me-explorer',
      'paran-line-finder',
    ],
    keyTakeaways: [
      'Astrocartography maps where each planet was rising (AC), setting (DC), culminating at noon (MC), or at midnight (IC) around the globe at your birth minute.',
      'Sun, Jupiter, and Venus lines bring visibility, ease, and connection—especially when supported in your natal chart.',
      'Always check the full Relocation Chart for a city, not just a single map line.',
    ],
    lead: 'You land in a new city for a three-day trip and immediately feel lighter. Strangers strike up warm conversations, creative ideas flow, and you sleep deeply. Astrocartography is a locational astrology system that projects your birth-moment planetary positions onto a world map, tracing the exact geographic lines where each planet stood on the Ascendant, Descendant, Midheaven, or Imum Coeli.',
    sections: [
      {
        id: 'what-are-four-angles',
        heading: 'What do MC, IC, AC, and DC lines mean on an astrocartography map?',
        paragraphs: [
          'At the exact minute you were born, every planet was at high noon somewhere on Earth, at midnight on the opposite side of the globe, rising on one horizon, and setting on another.',
          'Consequently, each of your 10 planets draws four curves across the world map: Midheaven (MC), Imum Coeli (IC), Ascendant (AC), and Descendant (DC).',
          'Four angles. Forty global corridors.',
        ],
        verdict: 'Four angles. Forty global corridors.',
        comparisonTable: {
          intro: 'Before booking a flight to a Venus or Jupiter line, check which angle that line activates. Each of the four angles channels the planet into a different sphere of life.',
          headers: ['Line Angle', 'Earth Geometry', 'Life Area Activated', 'What to Watch Out For'],
          rows: [
            {
              item: 'MC Line (Midheaven)',
              whatItDoes: 'Runs north–south along a meridian of longitude where the planet stood at zenith.',
              whatItCannotDo: 'Does not govern private home comfort.',
              bestFor: 'Career promotions, public reputation, and leadership.',
            },
            {
              item: 'IC Line (Imum Coeli)',
              whatItDoes: 'Runs north–south 180° opposite the MC line (planetary midnight).',
              whatItCannotDo: 'Does not push loud external fame.',
              bestFor: 'Buying a home, family roots, healing, and deep rest.',
            },
            {
              item: 'AC Line (Ascendant)',
              whatItDoes: 'Curves along the eastern horizon where the planet was rising.',
              whatItCannotDo: 'Cannot be calculated without an accurate birth time.',
              bestFor: 'Personal reinvention, physical vitality, and confidence.',
            },
            {
              item: 'DC Line (Descendant)',
              whatItDoes: 'Curves along the western horizon where the planet was setting.',
              whatItCannotDo: 'Focuses on others rather than solo independence.',
              bestFor: 'Dating, marriage, clients, and business partners.',
            },
          ],
        },
        toolSlug: 'astrocartography-map',
      },
    ],
    faqs: [
      {
        question: 'How close to an astrocartography line do I need to live to feel it?',
        answer: 'You feel a planetary line strongest within 150 to 250 miles (250 to 400 km) on either side of the exact curve, with a noticeable secondary orb up to 350 miles.',
      },
      {
        question: 'Do I have to travel to activate an astrocartography line?',
        answer: 'No. Working with clients from that city, collaborating with people born along that corridor, or launching digital projects aimed at that region also activates the line ("remote activation").',
      },
    ],
  },
  {
    slug: 'annual-profections-time-lord-guide',
    serpTitle: 'Annual Profections Calculator & Time Lord Guide [2026]',
    title: 'What Are Annual Profections? How to Find Your Hellenistic Lord of the Year',
    subtitle: 'Before modern astrologers tracked complex outer-planet transits, ancient practitioners used a 12-year wheel that shifts on every birthday. Learn how to find your Time Lord in 30 seconds.',
    description: 'What are Annual Profections? Learn the ancient 12-house birthday wheel, find your Lord of the Year (Time Lord), and see which transits matter most.',
    category: 'Hellenistic & Traditional',
    categorySlug: 'hellenistic',
    publishedAt: '2026-10-05',
    modifiedAt: '2026-10-21',
    readingMinutes: 8,
    featured: false,
    heroToolSlug: 'annual-profection-calculator',
    primaryToolSlug: 'annual-profection-calculator',
    relatedToolSlugs: [
      'annual-profection-calculator',
      'zodiacal-releasing-calculator',
      'firdaria-calculator',
      'solar-return-chart',
    ],
    keyTakeaways: [
      'Annual Profections move forward one Whole Sign house on every birthday, starting in the 1st House at birth (age 0).',
      'Ages 12, 24, 36, 48, 60, and 72 always reset to a 1st-House personal renewal year.',
      'The traditional planetary ruler of your profected sign becomes your Lord of the Year (Time Lord).',
    ],
    lead: 'When you look at a live transit chart, 10 planets are making dozens of aspects at once. How do you know which transit will actually change your year and which one will pass like background noise? Annual Profections is a Hellenistic time-lord technique that advances your Ascendant by one Whole Sign house on every birthday to identify your active house and ruling planet for the year.',
    sections: [
      {
        id: 'how-profections-wheel-works',
        heading: 'How does the 12-year Annual Profection wheel work?',
        paragraphs: [
          'From the day you are born until your first birthday (Age 0), your 1st House is switched on. On your 1st birthday, the spotlight moves to your 2nd House. On your 2nd birthday, it moves to your 3rd House.',
          'Every 12 years—at ages 12, 24, 36, 48, 60, and 72—you return to your 1st House.',
          'Once you know which house is active for your age, check which zodiac sign sits on that house. The traditional planet that rules that sign becomes your Lord of the Year.',
          'One birthday. One Time Lord.',
        ],
        verdict: 'One birthday. One Time Lord.',
        comparisonTable: {
          intro: 'Quickly find your active profected house and life theme from your current age using this 12-year reference table.',
          headers: ['Ages', 'Activated House', 'Primary Life Theme', 'Why It Matters'],
          rows: [
            {
              item: 'Ages 20, 32, 44, 56',
              whatItDoes: 'Activates the 9th House of travel, higher learning, publishing, and belief.',
              whatItCannotDo: 'Rarely stays quiet or purely local.',
              bestFor: 'Grad school, international relocation, teaching, and big-picture strategy.',
            },
            {
              item: 'Ages 21, 33, 45, 57',
              whatItDoes: 'Activates the 10th House of career, public authority, and reputation.',
              whatItCannotDo: 'Cannot hide behind the scenes.',
              bestFor: 'Promotions, launching a company, and visible milestones.',
            },
            {
              item: 'Ages 24, 36, 48, 60',
              whatItDoes: 'Resets to the 1st House of identity, body, and personal direction.',
              whatItCannotDo: 'Does not stay stuck in last decade’s habits.',
              bestFor: 'Fresh starts, health upgrades, and personal rebranding.',
            },
            {
              item: 'Ages 25, 37, 49, 61',
              whatItDoes: 'Activates the 2nd House of income, savings, and material resources.',
              whatItCannotDo: 'Ignores vague wishful thinking; demands concrete numbers.',
              bestFor: 'Salary growth, pricing your craft, and financial foundations.',
            },
          ],
        },
        toolSlug: 'annual-profection-calculator',
      },
    ],
    faqs: [
      {
        question: 'Which house system should I use for Annual Profections?',
        answer: 'Always use Whole Sign houses and traditional seven-planet rulerships (Mars for Scorpio, Saturn for Aquarius, and Jupiter for Pisces), because Annual Profections was designed within the Hellenistic Whole Sign framework.',
      },
      {
        question: 'How do I use my Lord of the Year once I find it?',
        answer: 'Check two things: 1) which house your Time Lord occupies in your birth chart, and 2) whenever that planet makes a major transit aspect or goes retrograde during the year, expect key turning points.',
      },
    ],
  },
]

const [leadGuide, ...otherCorePosts] = corePosts

// The Big Three guide stays pinned as the lead story; everything else is newest first.
export const blogPosts: BlogPost[] = [
  leadGuide,
  ...[...otherCorePosts, ...moreBlogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedBlogPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getBlogPost(currentSlug)
  const others = blogPosts.filter((p) => p.slug !== currentSlug)
  if (!current) return others.slice(0, count)
  const sameCategory = others.filter((p) => p.categorySlug === current.categorySlug)
  const rest = others.filter((p) => p.categorySlug !== current.categorySlug)
  return [...sameCategory, ...rest].slice(0, count)
}

export function blogPostImageSrc(post: BlogPost): string {
  return toolImageSrc(post.heroToolSlug)
}
