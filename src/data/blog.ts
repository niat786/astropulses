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
  /** Supports internal links written as [label](/path). */
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

/** Reading time is derived from the text, so it stays honest as posts change. */
export type BlogPostInput = Omit<BlogPost, 'readingMinutes'>

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

const corePosts: BlogPostInput[] = [
  {
    slug: 'your-big-three-where-to-begin',
    serpTitle: 'What Is Your Big Three in Astrology? Complete Guide [2026]',
    title: 'What Is Your Big Three in Astrology? How Sun, Moon, and Rising Work Together',
    subtitle: 'Your Sun sign is only one part of the story. Learn how your Sun, Moon, and Rising signs work together, and why two people born on the same day can feel so different.',
    description: 'What is your Big Three in astrology? Learn how your Sun, Moon, and Rising signs work together, then find all three free in seconds, in plain English.',
    category: 'Chart Basics',
    categorySlug: 'chart-basics',
    publishedAt: '2026-09-08',
    modifiedAt: '2026-10-22',
    featured: true,
    heroToolSlug: 'big-three-calculator',
    primaryToolSlug: 'big-three-calculator',
    relatedToolSlugs: ['big-three-calculator', 'birth-chart-generator', 'rising-sign-finder', 'moon-sign-finder'],
    keyTakeaways: [
      'Your Sun moves about 1° a day. It shows your core drive and what you grow toward.',
      'Your Moon moves about 13° a day. It shows your moods, comfort needs, and gut reactions.',
      'Your Rising sign changes about every two hours. It sets all 12 houses in your chart.',
    ],
    lead: 'Most people meet astrology through a horoscope column. You read the blurb for your birth month, half of it sounds nothing like you, and you close the tab. That mismatch has a simple cause. The column only uses your Sun sign. Your Big Three adds your Moon sign and your Rising sign, and together they give a much truer first picture of you.',
    sections: [
      {
        id: 'what-is-big-three',
        heading: 'What is the Big Three in astrology?',
        paragraphs: [
          'The Big Three is your Sun sign, Moon sign, and Rising sign. Astrologers read these three first because they sum up the core of a birth chart.',
          'A horoscope column puts about 675 million people into each Sun sign. Your Big Three narrows that down a lot, because the Moon and Rising sign depend on your exact birth day, time, and place.',
          'Each of the three follows a different motion in the sky. The Sun follows Earth’s yearly trip around the Sun. The Moon follows its own 27-day loop around Earth. The Rising sign follows Earth’s daily spin.',
          'Different speeds give each one a different job.',
        ],
        comparisonTable: {
          intro: 'Each part of your Big Three moves at its own speed and covers a different part of life.',
          headers: ['Placement', 'How Fast It Moves', 'What It Shows', 'What It Can’t Show'],
          rows: [
            {
              item: 'Sun Sign',
              whatItDoes: 'About 1° a day, so about 30 days in each sign.',
              whatItCannotDo: 'Your private moods or your 12 houses.',
              bestFor: 'Purpose, energy, and what you choose to become.',
            },
            {
              item: 'Moon Sign',
              whatItDoes: 'About 13° a day, so about 2.5 days in each sign.',
              whatItCannotDo: 'Your chart angles or your career house.',
              bestFor: 'Feelings, comfort, and how you react under stress.',
            },
            {
              item: 'Rising Sign (Ascendant)',
              whatItDoes: 'About 1° every 4 minutes on the eastern horizon.',
              whatItCannotDo: 'Anything without a birth time and city.',
              bestFor: 'First impressions, your style, and your house layout.',
            },
          ],
        },
        toolSlug: 'big-three-calculator',
      },
      {
        id: 'how-sun-works',
        heading: 'What does your Sun sign do?',
        paragraphs: [
          'Your Sun sign shows where you are headed. It’s the energy you build on over a lifetime.',
          'In the sky, it marks where Earth was in its yearly orbit when you were born. In daily life, it shows what makes you feel alive when nobody is telling you what to do.',
          'You won’t always act like your Sun sign at breakfast. You grow into it, year by year. That’s why many people say their Sun sign fits them better at 35 than at 15.',
        ],
        callout: {
          eyebrow: 'Quick Self-Check',
          text: 'What kind of work leaves you proud and wide awake, even after a long day? That answer usually points to your Sun sign.',
        },
        toolSlug: 'zodiac-sign-finder',
      },
      {
        id: 'how-moon-works',
        heading: 'Why does your Moon sign feel more private than your Sun?',
        paragraphs: [
          'If your Sun is you at noon in a meeting, your Moon is you at 11 PM in the kitchen.',
          'The Moon changes sign every two and a half days. So two people born in the same week often share a Sun sign but handle stress in very different ways.',
          'A Fire Moon (Aries, Leo, Sagittarius) burns off tension by moving and talking it out. An Air Moon (Gemini, Libra, Aquarius) needs conversation and room to think. An Earth Moon (Taurus, Virgo, Capricorn) calms down by fixing practical things. A Water Moon (Cancer, Scorpio, Pisces) needs quiet time to feel things all the way through.',
          'For a sign-by-sign look, read our guide to [Moon sign meanings and emotional needs](/blog/moon-sign-meaning-emotional-needs).',
        ],
        toolSlug: 'moon-sign-finder',
      },
      {
        id: 'how-rising-works',
        heading: 'How does your Rising sign shape your whole chart?',
        paragraphs: [
          'Your Rising sign, also called the Ascendant, is the sign that was coming up over the eastern horizon at the minute and place you were born.',
          'Many beginners think it only shows your first impression. It does more than that. It sets the order of all 12 houses in your chart.',
          'Say you have Libra Rising. Libra becomes your 1st house of self. Scorpio becomes your 2nd house of money. Aries lands in your 7th house of partners. Venus rules Libra, so Venus becomes your chart ruler.',
          'Our [guide to the 12 houses](/blog/12-houses-in-astrology-explained) explains what each house covers.',
        ],
        bullets: [
          {
            title: 'Your 1st house',
            body: 'The sign on the eastern horizon always becomes your 1st house of body, style, and approach to life.',
          },
          {
            title: 'Your chart ruler',
            body: 'The planet that rules your Rising sign acts like the captain of your chart. You can look yours up with the [chart ruler finder](/tools/chart-ruler-finder).',
          },
          {
            title: 'Why minutes matter',
            body: 'The horizon moves about 1° every 4 minutes. A 20-minute error moves your Rising sign by around 5°. [Here’s why exact birth time matters](/blog/why-your-exact-birth-time-matters).',
          },
        ],
        toolSlug: 'rising-sign-finder',
      },
      {
        id: 'limitations-big-three',
        heading: 'What does the Big Three leave out?',
        paragraphs: [
          'The Big Three is a great start, but it isn’t your whole chart. It skips Mercury (how you think and talk), [Venus](/blog/venus-sign-love-language) (how you love), Mars (how you act), and [Saturn](/blog/saturn-return-navigation-guide) (where you learn patience).',
          'Birth time is the other weak spot. If yours comes from a family memory like “sometime around dinner,” your Rising sign could be off by a whole sign. Check your birth certificate before you trust your houses.',
          'Ready for the next step? Our [beginner guide to reading a birth chart](/blog/how-to-read-your-birth-chart) walks you through the rest in five steps.',
        ],
        toolSlug: 'birth-chart-generator',
      },
    ],
    faqs: [
      {
        question: 'What is the Big Three in astrology?',
        answer: 'It’s your Sun, Moon, and Rising signs. Your Sun shows your core drive. Your Moon shows your emotional needs. Your Rising sign shows your outward style and sets your 12 houses.',
      },
      {
        question: 'Which of the Big Three is most important?',
        answer: 'They work as a team, so none of them wins on its own. Many traditional astrologers gave extra weight to the Rising sign and the Moon, because they depend most on your exact birth time.',
      },
      {
        question: 'Can I find my Big Three without a birth time?',
        answer: 'You can find your Sun sign from your birth date. Your Moon sign is usually clear too, unless the Moon changed signs that day. Your Rising sign needs a birth time and city, because it changes about every two hours.',
      },
      {
        question: 'Why do I relate to my Moon or Rising sign more than my Sun?',
        answer: 'You feel your Moon in private and use your Rising sign in daily social life, so both can feel louder than your Sun. Some astrologers also find that people born at night relate more to their Moon.',
      },
      {
        question: 'Can two people have the same Big Three and still be different?',
        answer: 'Yes. People born in different years have different Mercury, Venus, Mars, Jupiter, and Saturn signs. Their houses and aspects also differ, so their charts read very differently.',
      },
    ],
  },
  {
    slug: 'why-your-exact-birth-time-matters',
    serpTitle: 'Why Does Exact Birth Time Matter in Astrology? [2026 Guide]',
    title: 'Why Does Exact Birth Time Matter in Astrology? The 4-Minute Rule Explained',
    subtitle: 'Planets move slowly, but Earth spins fast. See what changes on your chart every few minutes, and what you can still read if you don’t know your birth time.',
    description: 'Why does birth time matter in astrology? Learn the 4-minute rule, see which placements change without an exact time, and test your own chart free.',
    category: 'Chart Basics',
    categorySlug: 'chart-basics',
    publishedAt: '2026-09-14',
    modifiedAt: '2026-10-22',
    featured: true,
    heroToolSlug: 'birth-time-accuracy-checker',
    primaryToolSlug: 'birth-time-accuracy-checker',
    relatedToolSlugs: [
      'birth-time-accuracy-checker',
      'birth-time-rectification-assistant',
      'rising-sign-finder',
      'midheaven-mc-and-imum-coeli-ic-calculator',
    ],
    keyTakeaways: [
      'Earth turns 360° in 24 hours. So the horizon in your chart moves about 1° every 4 minutes.',
      'The Moon moves about 13° a day and changes sign every two to three days.',
      'Without a birth time, your Sun and most planet signs are still reliable on most days.',
    ],
    lead: 'You text your mom to ask when you were born. She writes back, “Around 3 PM, I think. Right after the shift change.” Should you type 3:00 PM into a chart calculator? It depends on what you want to read. Planet signs barely move in an hour. Your Rising sign and houses move a lot.',
    sections: [
      {
        id: 'what-is-four-minute-rule',
        heading: 'What is the 4-minute rule?',
        paragraphs: [
          'The 4-minute rule is simple. As Earth spins, the eastern horizon in your chart (the Ascendant) and the top of your chart (the Midheaven) move forward about 1° every 4 minutes.',
          'The math is easy to check. A day has 1,440 minutes, and a circle has 360°. Divide one by the other and you get 4 minutes per degree. It’s an average, because some signs rise faster than others, but it’s a good rule of thumb.',
          'So a 16-minute rounding error moves your Ascendant and Midheaven by about 4°. If your true Ascendant is 28° Leo, a 15-minute error could push it into Virgo.',
          'That one change shifts every house in your chart. Your [Rising sign](/blog/your-big-three-where-to-begin) and your career house would both be wrong.',
        ],
        comparisonTable: {
          intro: 'Not every part of your chart breaks when your birth time is missing. This table shows what needs the exact minute and what holds steady all day.',
          headers: ['Chart Factor', 'How Fast It Moves', 'Works Without Birth Time?', 'If the Time Is Off by 2 Hours'],
          rows: [
            {
              item: 'Ascendant and 12 houses',
              whatItDoes: 'About 1° every 4 minutes, or 15° an hour.',
              whatItCannotDo: 'No. It needs a time and a city.',
              bestFor: 'Moves about 30°, often a whole sign and every house.',
            },
            {
              item: 'Moon sign and degree',
              whatItDoes: 'About 0.5° an hour, or 13° a day.',
              whatItCannotDo: 'Mostly. It can be unclear on days the Moon changes sign.',
              bestFor: 'Moves about 1°. That matters if your Moon sits near 29°.',
            },
            {
              item: 'Sun, Mercury, Venus, Mars',
              whatItDoes: 'From about 0.5° to 1.6° a day.',
              whatItCannotDo: 'Yes for signs. No for houses.',
              bestFor: 'The sign almost always stays the same. Only the house is unknown.',
            },
          ],
        },
        toolSlug: 'birth-time-accuracy-checker',
      },
      {
        id: 'what-can-you-read-without-time',
        heading: 'What can you still read without a birth time?',
        paragraphs: [
          'A missing birth time doesn’t lock you out of astrology. On most days, the Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto stay in the same sign from midnight to midnight.',
          'You can also read most planet-to-planet aspects. The fast-moving Moon is the main exception. Many astrologers use a noon chart, which keeps the Moon within about 6.5° of its true spot.',
          'So skip the houses for now and focus on the planets. Our guide on [how to read a birth chart](/blog/how-to-read-your-birth-chart) shows what to look at first.',
        ],
        toolSlug: 'birth-time-rectification-assistant',
      },
      {
        id: 'finding-your-birth-time',
        heading: 'How can you find your real birth time?',
        paragraphs: [
          'Start with paperwork. A long-form birth certificate often lists the time. Hospital records, baby books, and old letters can help too.',
          'If none of those exist, ask relatives who were there. Write down every answer, even rough ones like “just before lunch.” Two separate memories that agree are worth more than one confident guess.',
          'Birth time matters even more for [astrocartography](/blog/astrocartography-planetary-lines-guide), where a small error can move map lines by hundreds of miles.',
          'As a last step, an astrologer can test likely times against big life events. That process is called rectification. Our [rectification assistant](/tools/birth-time-rectification-assistant) can help you narrow down the options.',
        ],
        callout: {
          eyebrow: 'Try This',
          text: 'Run your chart at two possible times, 30 minutes apart. If your Rising sign stays the same, you can read your houses with more confidence.',
        },
      },
    ],
    faqs: [
      {
        question: 'Why does exact birth time matter in astrology?',
        answer: 'Earth spins about 1° every 4 minutes. That spin sets your Rising sign, your Midheaven, all 12 house cusps, and the exact degree of your Moon.',
      },
      {
        question: 'How much does a 15-minute difference change a chart?',
        answer: 'It moves your Ascendant and Midheaven by about 4°. If your Rising sign sits near the start or end of a sign, that can change your Rising sign and shift every house.',
      },
      {
        question: 'Why use 12:00 PM if I don’t know my birth time?',
        answer: 'Noon sits in the middle of the day, so the Moon can’t be more than about 6.5° away from its true spot. Your houses will still be unknown, so don’t read them from a noon chart.',
      },
      {
        question: 'Where can I find my exact time of birth?',
        answer: 'Ask for a long-form birth certificate from the records office where you were born. Hospital records and baby books are good backups.',
      },
    ],
  },
  {
    slug: 'saturn-return-navigation-guide',
    serpTitle: 'Saturn Return Guide: What Happens at Ages 27 to 30',
    title: 'What Is a Saturn Return? A Calm Guide to Your Late-Twenties Reset',
    subtitle: 'Saturn takes about 29.5 years to circle the Sun. Learn why your late twenties can feel like a big review of your life, and how to work with it.',
    description: 'What is a Saturn Return? Learn why it hits between ages 27 and 30, how Saturn’s 29.5-year orbit works, and find your exact Saturn Return dates in seconds.',
    category: 'Planetary Cycles & Timing',
    categorySlug: 'planetary-cycles',
    publishedAt: '2026-09-19',
    modifiedAt: '2026-10-22',
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
      'Saturn takes about 29.5 years to travel once around the Sun.',
      'Your first Saturn Return starts when Saturn reaches its birth sign, around age 27 to 29.',
      'Saturn often crosses your birth degree three times because of retrograde, so the theme can unfold over most of a year.',
    ],
    lead: 'Around your 28th birthday, the life you built at 21 can start to feel two sizes too small. A job you put up with suddenly wears you out. A relationship asks for a real decision. Astrologers call this stretch your Saturn Return. It happens when Saturn comes back to the place it held when you were born.',
    sections: [
      {
        id: 'what-is-saturn-return',
        heading: 'What is a Saturn Return, and when does it happen?',
        paragraphs: [
          'Saturn takes about 29.5 years to circle the Sun. Your Saturn Return is the period when it comes back to the same sign and degree it was in at your birth.',
          'Think of it less as bad luck and more as a yearly review on a much bigger scale. Saturn asks what in your life is solid, and what was only temporary.',
          'Saturn spends about two and a half years in each sign. You often feel the theme start when Saturn enters your birth sign. It gets stronger as Saturn closes in on your exact birth degree.',
          'Your first return comes in your late twenties. The second arrives around 57 to 60, and the third around 87 to 89.',
        ],
        comparisonTable: {
          intro: 'Each year, Saturn seems to move backward for about four and a half months. This is called retrograde, the same effect behind Mercury retrograde. Because of it, some people get one clean pass and others get three.',
          headers: ['Pattern', 'How It Works', 'How Long', 'How It Often Feels'],
          rows: [
            {
              item: 'One pass',
              whatItDoes: 'Saturn crosses your birth degree once and keeps going.',
              whatItCannotDo: 'Usually a few weeks around the exact date.',
              bestFor: 'One clear turning point, decision, or ending.',
            },
            {
              item: 'Three passes',
              whatItDoes: 'Saturn crosses forward, backs up over the degree, then crosses forward again.',
              whatItCannotDo: 'Often 9 to 10 months from the first pass to the last.',
              bestFor: 'First you notice the problem, then you rethink the plan, then you lock in the change.',
            },
          ],
        },
        toolSlug: 'saturn-return-calculator',
      },
      {
        id: 'what-saturn-return-feels-like',
        heading: 'What does a Saturn Return usually bring?',
        paragraphs: [
          'Saturn rewards effort and removes what doesn’t hold weight. So the common themes are commitment, career, money, and boundaries.',
          'For some people, that means a promotion, a marriage, a degree, or buying a home. For others, it means leaving a job, ending a relationship that ran its course, or moving cities.',
          'Where Saturn sits in your chart tells you which area gets the most attention. Saturn in the 10th house points to career. Saturn in the 7th points to partners. Our [12 houses guide](/blog/12-houses-in-astrology-explained) explains each area.',
          'The year before also matters. Your [annual profection](/blog/annual-profections-time-lord-guide) can show whether Saturn is already running your year.',
        ],
      },
      {
        id: 'day-vs-night-saturn',
        heading: 'Why do day and night charts feel Saturn differently?',
        paragraphs: [
          'In traditional astrology, whether you were born by day or by night is called sect. It changes how Saturn tends to behave.',
          'If you were born during the day, with the Sun above the horizon, Saturn is on your team. Day-chart Saturn Returns often look like heavy but useful growth. You might take on a big role or earn a hard credential.',
          'If you were born at night, Saturn is out of sect. Night-chart returns can feel sharper at first. You might cut ties, set firm limits, or rebuild something from scratch.',
          'You can check yours with the [sect calculator](/tools/sect-calculator).',
        ],
        toolSlug: 'sect-calculator',
      },
    ],
    faqs: [
      {
        question: 'At what age does a Saturn Return start and end?',
        answer: 'Your first Saturn Return usually starts around 27 to 28, when Saturn enters your birth sign. It peaks near 29 or 30 at your exact birth degree. It ends when Saturn leaves that sign, often around 30 or 31.',
      },
      {
        question: 'Does a Saturn Return always mean a breakup or career change?',
        answer: 'No. Saturn tends to remove weak structures and strengthen good ones. Many solid couples get engaged or buy a home during a Saturn Return.',
      },
      {
        question: 'How do I know which part of life my Saturn Return will affect?',
        answer: 'Check the house where Saturn sits in your birth chart. Saturn in the 10th house tests career. Saturn in the 7th tests partnerships. The [Saturn sign finder](/tools/saturn-sign-finder) is a quick place to start.',
      },
    ],
  },
  {
    slug: 'synastry-vs-composite-charts-explained',
    serpTitle: 'Synastry vs Composite Chart: Key Differences Explained',
    title: 'Synastry vs. Composite Charts: What Is the Difference in Relationship Astrology?',
    subtitle: 'Why do some couples have instant chemistry but struggle with everyday life? Synastry and composite charts each answer one half of that question.',
    description: 'Synastry vs Composite chart: learn the difference between comparing two charts and blending them into one, plus when to use each calculator.',
    category: 'Synastry & Relationships',
    categorySlug: 'relationships',
    publishedAt: '2026-09-25',
    modifiedAt: '2026-10-22',
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
      'Synastry compares two birth charts to show chemistry, attraction, and friction.',
      'A composite chart blends both charts into one, using the midpoint of each planet pair.',
      'Synastry shows the spark. The composite shows how the two of you work as a team.',
    ],
    lead: 'Have you ever clicked with someone in five minutes, then found that planning a weekend away together felt impossible? Relationship astrology has two tools for that gap. Synastry compares your chart with your partner’s chart. A composite chart blends the two into one new chart for the relationship itself.',
    sections: [
      {
        id: 'synastry-vs-composite-difference',
        heading: 'How is synastry different from a composite chart?',
        paragraphs: [
          'Picture two musicians playing together. Synastry is how your guitar sounds next to their piano. The composite chart is the song you record together.',
          'In synastry, both charts stay as they are. You look at how one person’s planets touch the other’s. For example, does your Venus make an easy angle to their Mars? Which of your houses does their Moon fall in?',
          'In a composite chart, you find the halfway point between each pair of planets. Your Sun and their Sun make one composite Sun. Your Moon and their Moon make one composite Moon. The result is a third chart that describes the couple.',
          'So synastry describes chemistry, and the composite describes structure.',
        ],
        comparisonTable: {
          intro: 'Both methods use exact planet positions, but they answer different questions.',
          headers: ['Method', 'How It Works', 'What It Can Tell You', 'What It Can’t Tell You'],
          rows: [
            {
              item: 'Synastry',
              whatItDoes: 'Lays one chart over the other and checks the angles between them.',
              whatItCannotDo: 'What the relationship is “for” as a shared unit.',
              bestFor: 'Attraction, triggers, communication, and early dating.',
            },
            {
              item: 'Composite chart',
              whatItDoes: 'Finds the midpoint of each matching planet pair to build one chart.',
              whatItCannotDo: 'Who sets off whom in a one-on-one argument.',
              bestFor: 'Long-term goals, shared life, and how you act as a team.',
            },
          ],
        },
        toolSlug: 'composite-chart-calculator',
      },
      {
        id: 'what-to-look-for-first',
        heading: 'What should you look at first?',
        paragraphs: [
          'In synastry, start with the Sun, Moon, Venus, and Mars. Easy angles between your Moon and their planets often feel like comfort. Venus and Mars contacts often show attraction.',
          'Then check Mercury. It shows how easily you talk, plan, and solve problems together. Many couples with great chemistry struggle here.',
          'In the composite chart, look at the composite Sun and Moon first. Their signs and houses describe what the relationship focuses on and how it feels day to day.',
          'If you’re new to this, the [zodiac compatibility guide](/blog/zodiac-sign-compatibility-guide) is a gentle first step, and the [Venus sign guide](/blog/venus-sign-love-language) shows how each of you likes to be loved.',
        ],
        toolSlug: 'synastry-chart-calculator',
      },
    ],
    faqs: [
      {
        question: 'Should I check synastry or the composite chart first?',
        answer: 'Start with synastry while you’re getting to know someone. It shows personal chemistry and how you affect each other. Look at the composite once you are building a life or a business together.',
      },
      {
        question: 'Are squares and oppositions bad in synastry?',
        answer: 'Not at all. A chart with only easy angles can feel comfortable but flat. A few squares between Mars, Venus, or the Sun add spark and drive, especially when Moon and Mercury contacts help you stay kind and clear.',
      },
      {
        question: 'Do I need both birth times?',
        answer: 'Planet-to-planet contacts work with birth dates alone. House overlays and the composite Ascendant need both birth times. Without them, skip the houses and focus on the planets.',
      },
    ],
  },
  {
    slug: 'tropical-vs-sidereal-vedic-zodiac',
    serpTitle: 'Tropical vs Sidereal Zodiac: Why Your Vedic Sign Changes',
    title: 'Tropical vs. Sidereal Zodiac: Why Is Your Vedic Astrology Sign Different?',
    subtitle: 'Did a Vedic calculator just say you’re one sign earlier than you thought? Nothing is broken. The two systems start the zodiac at different points.',
    description: 'Tropical vs Sidereal zodiac explained: learn why your Vedic sign often shifts back by about 24 degrees, how the Lahiri ayanamsha works, and compare both charts.',
    category: 'Vedic & Sidereal',
    categorySlug: 'vedic-jyotish',
    publishedAt: '2026-10-01',
    modifiedAt: '2026-10-22',
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
      'Western and Vedic astrology use the same planet positions in the sky.',
      'They start the zodiac at different points. Western uses the March equinox. Vedic uses the fixed stars.',
      'In 2026 the gap is about 24°, so most placements move back one sign in a Vedic chart.',
    ],
    lead: 'It’s a common shock. You’ve known you’re a Leo all your life. Then a Vedic calculator says you’re a Cancer. Did the stars move, or is one system wrong? Neither. The two systems measure from different starting points, and in 2026 those points sit about 24° apart.',
    sections: [
      {
        id: 'why-two-zodiacs-differ',
        heading: 'Why do Tropical and Sidereal astrology give different signs?',
        paragraphs: [
          'Think about temperature. One thermometer reads 20° Celsius and another reads 68° Fahrenheit. The air is the same. Only the scale is different.',
          'Western (Tropical) astrology starts 0° Aries at the March equinox, the day when day and night are about equal.',
          'Vedic (Sidereal) astrology starts 0° Aries against the fixed stars. The common Lahiri standard places the bright star Spica at 0° Libra.',
          'Earth wobbles slowly on its axis, like a spinning top. One full wobble takes about 25,800 years. Because of it, the equinox slides back against the stars by about 1° every 72 years. The two zodiacs lined up roughly 1,700 years ago. Today they are about 24° apart.',
        ],
        comparisonTable: {
          intro: 'The table compares where each zodiac starts and what each one is best at.',
          headers: ['System', 'Where 0° Aries Starts', 'What It’s Best At', 'What It Doesn’t Cover'],
          rows: [
            {
              item: 'Tropical (Western)',
              whatItDoes: 'At the March equinox, tied to Earth’s seasons.',
              whatItCannotDo: 'Nakshatras and Vedic dasha timing.',
              bestFor: 'Personality, seasonal sign meanings, and Western timing methods.',
            },
            {
              item: 'Sidereal (Vedic)',
              whatItDoes: 'Against the fixed stars, about 24° earlier in 2026.',
              whatItCannotDo: 'Western sign descriptions, which don’t carry over directly.',
              bestFor: 'The 27 nakshatras, Vimshottari dashas, and the D9 Navamsa chart.',
            },
          ],
        },
        toolSlug: 'tropical-sidereal-comparison',
      },
      {
        id: 'which-one-to-use',
        heading: 'Which zodiac should you use?',
        paragraphs: [
          'Use the one that matches the method you’re learning. If you read Western horoscopes or use Western techniques, use Tropical. If you follow Vedic astrology, use Sidereal.',
          'Mixing them causes most of the confusion. A Vedic Cancer Sun isn’t a Western Cancer with a new label. Vedic astrology reads signs through its own rules, especially the Moon and the [nakshatras, or birth stars](/blog/nakshatra-meaning-your-birth-star).',
          'Not everything shifts. If your Tropical planet sits after about 24° of a sign, it stays in the same sign in the Vedic chart. You can check each planet with the [Vedic rashi finder](/tools/vedic-rashi-finder).',
          'If you’re exploring Vedic astrology for a relationship, our guide to [kundli matching](/blog/kundli-matching-guna-milan-36-points) uses Sidereal positions.',
        ],
        toolSlug: 'vedic-rashi-finder',
      },
    ],
    faqs: [
      {
        question: 'Which zodiac is more accurate, Tropical or Sidereal?',
        answer: 'Both are accurate within their own frame. Tropical measures from Earth’s seasons. Sidereal measures from the fixed stars. They answer different questions, so neither is wrong.',
      },
      {
        question: 'Why did my sign change when I checked my Vedic chart?',
        answer: 'The Lahiri ayanamsha subtracts about 24° from each Tropical position. If your planet sits between 0° and about 24° of a sign, it moves back into the sign before.',
      },
      {
        question: 'What is an ayanamsha?',
        answer: 'It’s the gap between the Tropical and Sidereal zodiacs at a given date. Lahiri is the most common one in India. Others, like Raman and KP, differ by about a degree.',
      },
    ],
  },
  {
    slug: 'astrocartography-planetary-lines-guide',
    serpTitle: 'What Is Astrocartography? How to Read Your World Map [2026]',
    title: 'What Is Astrocartography? How to Read Your Planetary Lines Across the Globe',
    subtitle: 'Why do some cities feel easy for your career or love life? Astrocartography maps your birth chart onto the world to suggest where.',
    description: 'What is astrocartography? Learn how MC, IC, AC, and DC planetary lines work on your world map, which lines suit career or love, and check any city.',
    category: 'Astrocartography & Space',
    categorySlug: 'relocation',
    publishedAt: '2026-10-03',
    modifiedAt: '2026-10-22',
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
      'Astrocartography shows where each planet was rising, setting, overhead, or underfoot when you were born.',
      'Each planet draws four lines on the map. Ten planets give you 40 lines.',
      'Always check the full relocation chart for a city, not just the nearest line.',
    ],
    lead: 'You arrive in a new city for a short trip and feel lighter right away. Strangers are friendly. Ideas come easily. You sleep well. Astrocartography tries to explain feelings like that. It takes your birth chart and draws it onto a world map, showing where each planet was strongest at the moment you were born.',
    sections: [
      {
        id: 'what-are-four-angles',
        heading: 'What do the MC, IC, AC, and DC lines mean?',
        paragraphs: [
          'At the minute you were born, every planet was overhead somewhere on Earth. On the far side of the planet, it was directly underfoot. Somewhere it was rising, and somewhere else it was setting.',
          'Each of those four spots becomes a line on your map. They’re called the Midheaven (MC), the Imum Coeli (IC), the Ascendant (AC), and the Descendant (DC).',
          'With ten planets, that’s 40 lines in all. Each one links a planet to a part of life.',
        ],
        comparisonTable: {
          intro: 'Before you book a flight to a Venus or Jupiter line, check which angle it is. Each angle points to a different part of life.',
          headers: ['Line', 'Where It Runs', 'Life Area', 'What to Keep in Mind'],
          rows: [
            {
              item: 'MC line (Midheaven)',
              whatItDoes: 'North to south, where the planet was overhead.',
              whatItCannotDo: 'Less about home comfort.',
              bestFor: 'Career, reputation, and leadership.',
            },
            {
              item: 'IC line (Imum Coeli)',
              whatItDoes: 'North to south, opposite the MC line.',
              whatItCannotDo: 'Less about public fame.',
              bestFor: 'Home, family, roots, and rest.',
            },
            {
              item: 'AC line (Ascendant)',
              whatItDoes: 'A curve where the planet was rising in the east.',
              whatItCannotDo: 'Needs an accurate birth time.',
              bestFor: 'A fresh start, energy, and confidence.',
            },
            {
              item: 'DC line (Descendant)',
              whatItDoes: 'A curve where the planet was setting in the west.',
              whatItCannotDo: 'Focuses on others more than on you alone.',
              bestFor: 'Dating, marriage, clients, and partners.',
            },
          ],
        },
        toolSlug: 'astrocartography-map',
      },
      {
        id: 'reading-your-map',
        heading: 'How do you read your map without getting overwhelmed?',
        paragraphs: [
          'Start with one goal. Are you looking for love, work, or a calm place to live? Then look for the matching lines. Venus and Jupiter lines are popular for love and ease. Sun and Jupiter MC lines are popular for career.',
          'Next, check how that planet behaves in your birth chart. A Venus that struggles in your chart can still bring mixed results on its line. The [birth chart generator](/tools/birth-chart-generator) shows you where each planet stands.',
          'Finally, test the city itself. A [relocation chart](/tools/relocation-chart-calculator) recasts your chart for that place, so you can see which houses your planets move into.',
          'Your birth time matters a lot here. The AC and DC lines can shift by hundreds of miles if your time is off. Our [birth time guide](/blog/why-your-exact-birth-time-matters) explains why.',
        ],
        toolSlug: 'relocation-chart-calculator',
      },
    ],
    faqs: [
      {
        question: 'How close to a line do I need to be to feel it?',
        answer: 'Astrologers disagree on the exact distance. Many say a line is strongest within a few hundred miles and fades the farther away you go. Treat it as a gradient, not an on-off switch.',
      },
      {
        question: 'Do I have to move to use an astrocartography line?',
        answer: 'Not always. Some astrologers believe travel, remote work, or close ties with people from that region can bring out a line too. A short trip is a good way to test a place before you move.',
      },
      {
        question: 'Are Saturn and Mars lines bad?',
        answer: 'They’re more demanding, not bad. A Saturn line can suit serious study or hard work. A Mars line can bring drive and also more conflict. It depends on your goals and your chart.',
      },
    ],
  },
  {
    slug: 'annual-profections-time-lord-guide',
    serpTitle: 'Annual Profections Calculator & Time Lord Guide [2026]',
    title: 'What Are Annual Profections? How to Find Your Lord of the Year',
    subtitle: 'Ancient astrologers used a simple 12-year wheel that turns on every birthday. Learn how to find your active house and your ruling planet for this year.',
    description: 'What are Annual Profections? Learn the ancient 12-house birthday wheel, find your Lord of the Year, and see which transits matter most for you right now.',
    category: 'Hellenistic & Traditional',
    categorySlug: 'hellenistic',
    publishedAt: '2026-10-05',
    modifiedAt: '2026-10-22',
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
      'Profections move forward one house on each birthday, starting with the 1st house at birth.',
      'At ages 12, 24, 36, 48, 60, and 72, you always return to the 1st house.',
      'The planet that rules your active house becomes your Lord of the Year.',
    ],
    lead: 'Open a transit chart and you’ll see dozens of planet contacts at once. Which ones will change your year, and which are background noise? Annual profections give you a simple filter. The method moves through your houses one per birthday and picks one planet to lead each year of your life.',
    sections: [
      {
        id: 'how-profections-wheel-works',
        heading: 'How does the profection wheel work?',
        paragraphs: [
          'From birth until your first birthday, your 1st house is active. On your 1st birthday, the focus moves to your 2nd house. On your 2nd birthday, it moves to your 3rd house, and so on.',
          'After 12 years you’re back at the start. So at ages 12, 24, 36, 48, 60, and 72, your 1st house is active again.',
          'Once you know your active house, find the sign on it. The planet that rules that sign becomes your Lord of the Year. Profections use whole sign houses, which our [12 houses guide](/blog/12-houses-in-astrology-explained) explains in plain English.',
        ],
        comparisonTable: {
          intro: 'Use this table to find a few common profection years by age.',
          headers: ['Ages', 'Active House', 'Main Theme', 'What It Often Brings'],
          rows: [
            {
              item: 'Ages 20, 32, 44, 56',
              whatItDoes: '9th house: travel, study, and beliefs.',
              whatItCannotDo: 'Rarely a quiet, stay-at-home year.',
              bestFor: 'Study, long trips, teaching, and big-picture plans.',
            },
            {
              item: 'Ages 21, 33, 45, 57',
              whatItDoes: '10th house: career and public life.',
              whatItCannotDo: 'Hard to stay out of sight.',
              bestFor: 'Promotions, launches, and visible goals.',
            },
            {
              item: 'Ages 24, 36, 48, 60',
              whatItDoes: '1st house: self, body, and direction.',
              whatItCannotDo: 'Old habits tend to feel tight.',
              bestFor: 'Fresh starts, health changes, and a new look.',
            },
            {
              item: 'Ages 25, 37, 49, 61',
              whatItDoes: '2nd house: income and resources.',
              whatItCannotDo: 'Vague money plans rarely hold up.',
              bestFor: 'Raises, pricing your work, and saving.',
            },
          ],
        },
        toolSlug: 'annual-profection-calculator',
      },
      {
        id: 'using-your-lord-of-the-year',
        heading: 'How do you use your Lord of the Year?',
        paragraphs: [
          'First, find where that planet sits in your birth chart. Its house and sign add detail to the year’s theme.',
          'Next, watch that planet’s transits. When your Lord of the Year changes sign, goes retrograde, or makes a strong contact with your chart, those dates tend to stand out.',
          'Say you’re 29. That’s a 6th-house year. If Capricorn sits on your 6th house, Saturn leads your year. For many people, that lines up with their [Saturn Return](/blog/saturn-return-navigation-guide), which is why that age can feel so intense.',
          'Your birthday chart adds a second layer. Our [solar return guide](/blog/solar-return-chart-birthday-forecast) shows how to read the two together.',
        ],
        toolSlug: 'solar-return-chart',
      },
    ],
    faqs: [
      {
        question: 'Which house system should I use for profections?',
        answer: 'Use whole sign houses and the traditional rulers: Mars for Scorpio, Saturn for Aquarius, and Jupiter for Pisces. The method was built for that system.',
      },
      {
        question: 'How do I use my Lord of the Year once I find it?',
        answer: 'Look at where that planet sits in your birth chart. Then watch its transits during the year. Big moves by that planet often mark the turning points.',
      },
      {
        question: 'Do I need my birth time for profections?',
        answer: 'Yes. Profections start from your Rising sign, so you need a birth time to know which sign sits on each house.',
      },
    ],
  },
]

const WORDS_PER_MINUTE = 220

function estimateReadingMinutes(post: BlogPostInput): number {
  const parts = [post.lead, ...post.keyTakeaways]
  for (const s of post.sections) {
    parts.push(s.heading, ...s.paragraphs)
    if (s.callout) parts.push(s.callout.text)
    if (s.quote) parts.push(s.quote)
    s.bullets?.forEach((b) => parts.push(b.title, b.body))
    s.comparisonTable?.rows.forEach((r) => parts.push(r.item, r.whatItDoes, r.whatItCannotDo, r.bestFor))
  }
  post.faqs.forEach((f) => parts.push(f.question, f.answer))
  const words = parts.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.round(words / WORDS_PER_MINUTE))
}

const withReadingTime = (post: BlogPostInput): BlogPost => ({ ...post, readingMinutes: estimateReadingMinutes(post) })

const [leadGuide, ...otherCorePosts] = corePosts

// The Big Three guide stays pinned as the lead story; everything else is newest first.
export const blogPosts: BlogPost[] = [
  leadGuide,
  ...[...otherCorePosts, ...moreBlogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
].map(withReadingTime)

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
