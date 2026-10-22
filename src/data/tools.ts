export type ToolField =
  | 'name'
  | 'date'
  | 'time'
  | 'place'
  | 'partnerName'
  | 'partnerDate'
  | 'partnerTime'
  | 'partnerPlace'

export type ToolCategory = {
  id: string
  name: string
  homeCategoryId: string
}

export type Tool = {
  id: number
  slug: string
  name: string
  description: string
  categoryId: string
  featured?: boolean
  fields: ToolField[]
}

export const toolCategories: ToolCategory[] = [
  {
    "id": "beginner-sign-finders",
    "name": "Beginner sign finders",
    "homeCategoryId": "know-yourself"
  },
  {
    "id": "essential-birth-chart-tools",
    "name": "Essential birth-chart tools",
    "homeCategoryId": "know-yourself"
  },
  {
    "id": "accessible-natal-analysis-tools",
    "name": "Accessible natal-analysis tools",
    "homeCategoryId": "know-yourself"
  },
  {
    "id": "personality-and-life-area-tools",
    "name": "Personality and life-area tools",
    "homeCategoryId": "know-yourself"
  },
  {
    "id": "horoscope-and-forecasting-tools",
    "name": "Horoscope and forecasting tools",
    "homeCategoryId": "forecasting"
  },
  {
    "id": "returns-and-life-cycle-tools",
    "name": "Returns and life-cycle tools",
    "homeCategoryId": "forecasting"
  },
  {
    "id": "moon-and-lunar-planning-tools",
    "name": "Moon and lunar-planning tools",
    "homeCategoryId": "moon-cycles"
  },
  {
    "id": "relationship-astrology-tools",
    "name": "Relationship astrology tools",
    "homeCategoryId": "relationships"
  },
  {
    "id": "vedic-astrology-tools",
    "name": "Vedic astrology tools",
    "homeCategoryId": "vedic"
  },
  {
    "id": "more-advanced-vedic-tools",
    "name": "More advanced Vedic tools",
    "homeCategoryId": "vedic"
  },
  {
    "id": "traditional-and-hellenistic-astrology-tools",
    "name": "Traditional and Hellenistic astrology tools",
    "homeCategoryId": "traditional"
  },
  {
    "id": "location-timing-and-specialist-tools",
    "name": "Location, timing, and specialist tools",
    "homeCategoryId": "places-timing"
  },
  {
    "id": "additional-high-value-professional-tools",
    "name": "Additional high-value professional tools",
    "homeCategoryId": "for-astrologers"
  }
]

export const tools: Tool[] = [
  {
    "id": 1,
    "slug": "zodiac-sign-finder",
    "name": "Zodiac Sign Finder",
    "description": "Find your Sun sign from your birth date.",
    "categoryId": "beginner-sign-finders",
    "featured": true,
    "fields": [
      "date"
    ]
  },
  {
    "id": 2,
    "slug": "moon-sign-finder",
    "name": "Moon Sign Finder",
    "description": "Find your Moon sign and what it says about your feelings.",
    "categoryId": "beginner-sign-finders",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 3,
    "slug": "rising-sign-finder",
    "name": "Rising Sign Finder",
    "description": "Find your Rising sign, the face you show the world.",
    "categoryId": "beginner-sign-finders",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 4,
    "slug": "big-three-calculator",
    "name": "Big Three Calculator",
    "description": "See your Sun, Moon, and Rising signs in one place.",
    "categoryId": "beginner-sign-finders",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 5,
    "slug": "mercury-sign-finder",
    "name": "Mercury Sign Finder",
    "description": "See how you think, talk, and share ideas.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 6,
    "slug": "venus-sign-finder",
    "name": "Venus Sign Finder",
    "description": "See what you value in love, beauty, and connection.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 7,
    "slug": "mars-sign-finder",
    "name": "Mars Sign Finder",
    "description": "See how you take action, chase goals, and handle conflict.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 8,
    "slug": "jupiter-sign-finder",
    "name": "Jupiter Sign Finder",
    "description": "See where growth, luck, and bigger opportunities show up.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 9,
    "slug": "saturn-sign-finder",
    "name": "Saturn Sign Finder",
    "description": "See where life asks for patience, work, and long-term focus.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 10,
    "slug": "outer-planet-sign-finder",
    "name": "Outer Planet Sign Finder",
    "description": "Find your Uranus, Neptune, and Pluto signs.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 11,
    "slug": "chinese-zodiac-finder",
    "name": "Chinese Zodiac Finder",
    "description": "Find your Chinese zodiac animal and element by birth year.",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 12,
    "slug": "vedic-rashi-finder",
    "name": "Vedic Rashi Finder",
    "description": "Find your Vedic Moon sign (Janma Rashi).",
    "categoryId": "beginner-sign-finders",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 13,
    "slug": "birth-chart-generator",
    "name": "Birth Chart Generator",
    "description": "Create your full birth chart with planets and houses.",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 14,
    "slug": "interactive-birth-chart",
    "name": "Interactive Birth Chart",
    "description": "Tap any planet, house, or aspect to learn what it means.",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 15,
    "slug": "plain-english-birth-chart-report",
    "name": "Plain-English Birth Chart Report",
    "description": "Read your chart in clear, everyday language.",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 16,
    "slug": "planet-in-sign-calculator",
    "name": "Planet-in-Sign Calculator",
    "description": "See which zodiac sign each planet was in at birth.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 17,
    "slug": "planet-in-house-calculator",
    "name": "Planet-in-House Calculator",
    "description": "See which life area (house) each planet sits in.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 18,
    "slug": "house-cusp-calculator",
    "name": "House Cusp Calculator",
    "description": "See the starting sign and degree of all 12 houses.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 19,
    "slug": "aspect-calculator",
    "name": "Aspect Calculator",
    "description": "Find the main links between planets in your chart.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 20,
    "slug": "aspect-pattern-finder",
    "name": "Aspect Pattern Finder",
    "description": "Spot big patterns like T-squares or Grand Trines.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 21,
    "slug": "chart-ruler-finder",
    "name": "Chart Ruler Finder",
    "description": "Find the planet that rules your Rising sign.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 22,
    "slug": "dominant-planet-calculator",
    "name": "Dominant Planet Calculator",
    "description": "See which planets are strongest in your chart.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 23,
    "slug": "dominant-sign-calculator",
    "name": "Dominant Sign Calculator",
    "description": "See which zodiac signs show up most in your chart.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 24,
    "slug": "dominant-house-calculator",
    "name": "Dominant House Calculator",
    "description": "See which life areas stand out most for you.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 25,
    "slug": "element-balance-calculator",
    "name": "Element Balance Calculator",
    "description": "See how balanced fire, earth, air, and water are in your chart.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 26,
    "slug": "modality-balance-calculator",
    "name": "Modality Balance Calculator",
    "description": "See if you lean toward starting, staying, or adapting.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 27,
    "slug": "polarity-balance-calculator",
    "name": "Polarity Balance Calculator",
    "description": "Compare outgoing and inward-facing signs in your chart.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 28,
    "slug": "personal-planet-profile",
    "name": "Personal Planet Profile",
    "description": "Get a simple overview of Sun through Mars.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 29,
    "slug": "chart-signature-calculator",
    "name": "Chart Signature Calculator",
    "description": "Find your chart's overall “flavor” from element and style.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 30,
    "slug": "angular-planet-finder",
    "name": "Angular Planet Finder",
    "description": "Find planets near key chart angles that stand out loudly.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 31,
    "slug": "retrograde-planet-finder",
    "name": "Retrograde Planet Finder",
    "description": "See which planets were retrograde when you were born.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 32,
    "slug": "stellium-finder",
    "name": "Stellium Finder",
    "description": "Find clusters of three or more planets in one place.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 33,
    "slug": "empty-house-explainer",
    "name": "Empty House Explainer",
    "description": "Learn what an empty house means and why it still matters.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 34,
    "slug": "intercepted-sign-finder",
    "name": "Intercepted Sign Finder",
    "description": "Find signs tucked inside houses without a cusp.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 35,
    "slug": "critical-degree-finder",
    "name": "Critical Degree Finder",
    "description": "Flag planets on sensitive or “turning point” degrees.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 36,
    "slug": "unaspected-planet-finder",
    "name": "Unaspected Planet Finder",
    "description": "Find planets that make few major links to other planets.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 37,
    "slug": "love-style-profile",
    "name": "Love Style Profile",
    "description": "See how you love, attract, and connect with others.",
    "categoryId": "personality-and-life-area-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 38,
    "slug": "career-astrology-profile",
    "name": "Career Astrology Profile",
    "description": "Explore career themes from your Midheaven and 10th house.",
    "categoryId": "personality-and-life-area-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 39,
    "slug": "money-profile",
    "name": "Money Profile",
    "description": "Explore money, values, and shared resources in your chart.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 40,
    "slug": "communication-style-tool",
    "name": "Communication Style Tool",
    "description": "See how you speak, listen, and process information.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 41,
    "slug": "emotional-needs-profile",
    "name": "Emotional Needs Profile",
    "description": "See what helps you feel safe, cared for, and understood.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 42,
    "slug": "friendship-style-profile",
    "name": "Friendship Style Profile",
    "description": "See how you show up in friendships and groups.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 43,
    "slug": "home-and-family-profile",
    "name": "Home and Family Profile",
    "description": "Explore home, family roots, and what “safe” feels like.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 44,
    "slug": "creativity-profile",
    "name": "Creativity Profile",
    "description": "Explore creative gifts, play, and self-expression.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 45,
    "slug": "leadership-style-profile",
    "name": "Leadership Style Profile",
    "description": "See how you lead, decide, and take charge.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 46,
    "slug": "learning-style-profile",
    "name": "Learning Style Profile",
    "description": "See how you learn best and where curiosity leads you.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 47,
    "slug": "wellness-routine-profile",
    "name": "Wellness-Routine Profile",
    "description": "Explore daily habits and self-care themes (not medical advice).",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 48,
    "slug": "spirituality-profile",
    "name": "Spirituality Profile",
    "description": "Explore belief, meaning, and inner life themes.",
    "categoryId": "personality-and-life-area-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 49,
    "slug": "personal-daily-horoscope",
    "name": "Personal Daily Horoscope",
    "description": "Get a daily forecast based on today's sky and your chart.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 50,
    "slug": "weekly-personal-horoscope",
    "name": "Weekly Personal Horoscope",
    "description": "See the main themes for your next seven days.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 51,
    "slug": "monthly-personal-horoscope",
    "name": "Monthly Personal Horoscope",
    "description": "See the bigger transit themes for the month ahead.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 52,
    "slug": "annual-astrology-forecast",
    "name": "Annual Astrology Forecast",
    "description": "Get a simple overview of your year's major cycles.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 53,
    "slug": "today-s-transit-chart",
    "name": "Today\u2019s Transit Chart",
    "description": "Compare today's sky with your birth chart.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 54,
    "slug": "transit-calendar",
    "name": "Transit Calendar",
    "description": "See upcoming dates when planets touch your chart.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 55,
    "slug": "transit-timeline",
    "name": "Transit Timeline",
    "description": "See when a transit starts, peaks, and fades.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 56,
    "slug": "current-planet-positions",
    "name": "Current Planet Positions",
    "description": "Check where the planets are right now.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 57,
    "slug": "retrograde-calendar",
    "name": "Retrograde Calendar",
    "description": "See retrograde dates and the days around them.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 58,
    "slug": "planet-ingress-calendar",
    "name": "Planet Ingress Calendar",
    "description": "See when planets move into a new sign.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 59,
    "slug": "aspect-calendar",
    "name": "Aspect Calendar",
    "description": "See upcoming planet-to-planet aspects by date.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 60,
    "slug": "personal-important-dates-finder",
    "name": "Personal Important-Dates Finder",
    "description": "Find your most active personal transit dates.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 61,
    "slug": "saturn-return-calculator",
    "name": "Saturn Return Calculator",
    "description": "Find your Saturn Return timing and phases.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 62,
    "slug": "solar-return-chart",
    "name": "Solar Return Chart",
    "description": "Create your birthday-year chart for the year ahead.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 63,
    "slug": "lunar-return-chart",
    "name": "Lunar Return Chart",
    "description": "Create a monthly chart for the Moon's return.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 64,
    "slug": "jupiter-return-calculator",
    "name": "Jupiter Return Calculator",
    "description": "Find your roughly 12-year Jupiter growth cycles.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 65,
    "slug": "venus-return-calculator",
    "name": "Venus Return Calculator",
    "description": "Find when Venus returns to its birth place in your chart.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 66,
    "slug": "mars-return-calculator",
    "name": "Mars Return Calculator",
    "description": "Find when Mars returns to its birth place in your chart.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 67,
    "slug": "mercury-return-calculator",
    "name": "Mercury Return Calculator",
    "description": "Find when Mercury returns to its birth place in your chart.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 68,
    "slug": "nodal-return-calculator",
    "name": "Nodal Return Calculator",
    "description": "Find Lunar Node return and opposition periods.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 69,
    "slug": "chiron-return-calculator",
    "name": "Chiron Return Calculator",
    "description": "Estimate your Chiron Return timing.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 70,
    "slug": "planetary-return-finder",
    "name": "Planetary Return Finder",
    "description": "Find the next exact return for any planet you choose.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 71,
    "slug": "birthday-year-theme-tool",
    "name": "Birthday Year Theme Tool",
    "description": "Get simple themes for the year after your birthday.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 72,
    "slug": "astrological-age-milestones",
    "name": "Astrological Age Milestones",
    "description": "See major life-cycle ages mapped on a timeline.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 73,
    "slug": "moon-phase-finder",
    "name": "Moon Phase Finder",
    "description": "Find the Moon phase for any date you choose.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": true,
    "fields": [
      "date"
    ]
  },
  {
    "id": 74,
    "slug": "personal-moon-calendar",
    "name": "Personal Moon Calendar",
    "description": "Track Moon signs, phases, and links to your chart.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 75,
    "slug": "new-moon-intention-planner",
    "name": "New Moon Intention Planner",
    "description": "See which part of your chart each New Moon lights up.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 76,
    "slug": "full-moon-reflection-tool",
    "name": "Full Moon Reflection Tool",
    "description": "See which part of your chart each Full Moon highlights.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 77,
    "slug": "void-of-course-moon-calendar",
    "name": "Void-of-Course Moon Calendar",
    "description": "See Void-of-Course Moon windows on a calendar.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 78,
    "slug": "moon-sign-calendar",
    "name": "Moon Sign Calendar",
    "description": "See when the Moon changes signs.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 79,
    "slug": "lunar-mansion-finder",
    "name": "Lunar Mansion Finder",
    "description": "Find the lunar mansion for a date in your chosen tradition.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 80,
    "slug": "natal-lunar-phase-profile",
    "name": "Natal Lunar Phase Profile",
    "description": "Learn the Moon phase you were born under.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 81,
    "slug": "progressed-moon-phase-calculator",
    "name": "Progressed Moon Phase Calculator",
    "description": "Find your current progressed Moon phase.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 82,
    "slug": "moon-return-planner",
    "name": "Moon Return Planner",
    "description": "Plan around your monthly Moon Return themes.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 83,
    "slug": "eclipse-calendar",
    "name": "Eclipse Calendar",
    "description": "See upcoming solar and lunar eclipse dates.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 84,
    "slug": "personal-eclipse-impact-tool",
    "name": "Personal Eclipse Impact Tool",
    "description": "See which eclipses land closest to your chart.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 85,
    "slug": "zodiac-compatibility-calculator",
    "name": "Zodiac Compatibility Calculator",
    "description": "Compare two Sun signs for a quick compatibility snapshot.",
    "categoryId": "relationship-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "partnerDate"
    ]
  },
  {
    "id": 86,
    "slug": "synastry-chart-calculator",
    "name": "Synastry Chart Calculator",
    "description": "Compare two full birth charts for relationship insights.",
    "categoryId": "relationship-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 87,
    "slug": "plain-english-relationship-report",
    "name": "Plain-English Relationship Report",
    "description": "Read relationship chart themes in simple language.",
    "categoryId": "relationship-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 88,
    "slug": "love-compatibility-score",
    "name": "Love Compatibility Score",
    "description": "Get separate scores for feelings, romance, and talk style.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 89,
    "slug": "friendship-compatibility-tool",
    "name": "Friendship Compatibility Tool",
    "description": "See how two charts connect as friends.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 90,
    "slug": "business-partner-compatibility",
    "name": "Business Partner Compatibility",
    "description": "See how two charts may work together in business.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 91,
    "slug": "parent-child-compatibility",
    "name": "Parent\u2013Child Compatibility",
    "description": "See communication and care styles between parent and child.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 92,
    "slug": "composite-chart-calculator",
    "name": "Composite Chart Calculator",
    "description": "Create a midpoint “relationship as a third chart.”",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 93,
    "slug": "davison-relationship-chart",
    "name": "Davison Relationship Chart",
    "description": "Create a relationship chart from the midpoint in time and place.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 94,
    "slug": "progressed-synastry-calculator",
    "name": "Progressed Synastry Calculator",
    "description": "Compare how two charts grow and change over time.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 95,
    "slug": "relationship-transit-calendar",
    "name": "Relationship Transit Calendar",
    "description": "Track sky events that touch a couple's charts.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 96,
    "slug": "relationship-strengths-and-friction-map",
    "name": "Relationship Strengths and Friction Map",
    "description": "See where a pair feels easy, tense, or growing.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 97,
    "slug": "janma-kundli-generator",
    "name": "Janma Kundli Generator",
    "description": "Create a Vedic (sidereal) birth chart.",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 98,
    "slug": "nakshatra-finder",
    "name": "Nakshatra Finder",
    "description": "Find your birth star (nakshatra), pada, and ruler.",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 99,
    "slug": "lagna-calculator",
    "name": "Lagna Calculator",
    "description": "Find your Vedic Ascendant (Lagna).",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 100,
    "slug": "vimshottari-dasha-calculator",
    "name": "Vimshottari Dasha Calculator",
    "description": "See your Mahadasha and Antardasha timing periods.",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 101,
    "slug": "kundli-matching-guna-milan",
    "name": "Kundli Matching / Guna Milan",
    "description": "Check traditional marriage-matching (Guna Milan) scores.",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 102,
    "slug": "manglik-dosha-calculator",
    "name": "Manglik Dosha Calculator",
    "description": "Check common Manglik Dosha chart patterns.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 103,
    "slug": "kala-sarpa-yoga-calculator",
    "name": "Kala Sarpa Yoga Calculator",
    "description": "Check for Kala Sarpa Yoga in a Vedic chart.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 104,
    "slug": "yoga-finder",
    "name": "Yoga Finder",
    "description": "Find classic planetary yogas in a Vedic chart.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 105,
    "slug": "dosha-finder",
    "name": "Dosha Finder",
    "description": "Check selected Vedic doshas with plain definitions.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 106,
    "slug": "navamsa-d9-chart-calculator",
    "name": "Navamsa/D9 Chart Calculator",
    "description": "Create the Navamsa (D9) chart used in Vedic practice.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 107,
    "slug": "divisional-chart-generator",
    "name": "Divisional Chart Generator",
    "description": "Explore key Vedic divisional charts (vargas).",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 108,
    "slug": "gochar-transit-calculator",
    "name": "Gochar Transit Calculator",
    "description": "See current Vedic transits (gochara) to your chart.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 109,
    "slug": "sade-sati-calculator",
    "name": "Sade Sati Calculator",
    "description": "Check if Saturn's Sade Sati period is active for you.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 110,
    "slug": "ashtakavarga-calculator",
    "name": "Ashtakavarga Calculator",
    "description": "See Ashtakavarga strength scores by sign and house.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 111,
    "slug": "shadbala-calculator",
    "name": "Shadbala Calculator",
    "description": "See traditional six-fold planetary strength scores.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 112,
    "slug": "bhava-bala-calculator",
    "name": "Bhava Bala Calculator",
    "description": "See house strength scores in a Vedic chart.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 113,
    "slug": "ayanamsha-comparison-tool",
    "name": "Ayanamsha Comparison Tool",
    "description": "Compare how ayanamsha choices change chart positions.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 114,
    "slug": "panchanga-calculator",
    "name": "Panchanga Calculator",
    "description": "Calculate the day's panchanga factors in simple terms.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 115,
    "slug": "muhurta-finder",
    "name": "Muhurta Finder",
    "description": "Find auspicious timing windows (muhurta) for an event.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 116,
    "slug": "kp-astrology-calculator",
    "name": "KP Astrology Calculator",
    "description": "Run key KP astrology calculations for a chart.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 117,
    "slug": "jaimini-karaka-calculator",
    "name": "Jaimini Karaka Calculator",
    "description": "Find Jaimini Chara Karakas (planet significators).",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 118,
    "slug": "arudha-pada-calculator",
    "name": "Arudha Pada Calculator",
    "description": "Calculate Arudha Lagna and related padas.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 119,
    "slug": "upagraha-calculator",
    "name": "Upagraha Calculator",
    "description": "Calculate Gulika, Mandi, and other secondary points.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 120,
    "slug": "vedic-dasha-comparison-tool",
    "name": "Vedic Dasha Comparison Tool",
    "description": "Compare Vimshottari with other dasha systems.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 121,
    "slug": "annual-profection-calculator",
    "name": "Annual Profection Calculator",
    "description": "Find this year's activated house and Time Lord.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 122,
    "slug": "zodiacal-releasing-calculator",
    "name": "Zodiacal Releasing Calculator",
    "description": "Map Zodiacal Releasing timing periods from selected Lots.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 123,
    "slug": "firdaria-calculator",
    "name": "Firdaria Calculator",
    "description": "Calculate medieval Firdaria planetary periods.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 124,
    "slug": "decennials-calculator",
    "name": "Decennials Calculator",
    "description": "Calculate planetary decade (decennial) periods.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 125,
    "slug": "primary-directions-calculator",
    "name": "Primary Directions Calculator",
    "description": "Calculate primary directions for planets and angles.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 126,
    "slug": "secondary-progressions-calculator",
    "name": "Secondary Progressions Calculator",
    "description": "Create a progressed chart using day-for-a-year timing.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 127,
    "slug": "solar-arc-directions-calculator",
    "name": "Solar Arc Directions Calculator",
    "description": "Move chart points by the Sun's progressed arc.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 128,
    "slug": "lot-of-fortune-calculator",
    "name": "Lot of Fortune Calculator",
    "description": "Find your Lot (Part) of Fortune.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 129,
    "slug": "arabic-lots-calculator",
    "name": "Arabic Lots Calculator",
    "description": "Calculate Fortune, Spirit, and other Arabic Lots.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 130,
    "slug": "sect-calculator",
    "name": "Sect Calculator",
    "description": "See if your chart is a day chart or a night chart.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 131,
    "slug": "essential-dignity-calculator",
    "name": "Essential Dignity Calculator",
    "description": "Score how strong planets are in their signs.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 132,
    "slug": "accidental-dignity-calculator",
    "name": "Accidental Dignity Calculator",
    "description": "Score strength from house place, speed, and condition.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 133,
    "slug": "astrocartography-map",
    "name": "Astrocartography Map",
    "description": "See your planetary lines mapped across the world.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 134,
    "slug": "best-city-for-me-explorer",
    "name": "Best City for Me Explorer",
    "description": "Search cities that match themes from your map lines.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 135,
    "slug": "relocation-chart-calculator",
    "name": "Relocation Chart Calculator",
    "description": "Recast your houses and angles for a new city.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 136,
    "slug": "local-space-map",
    "name": "Local Space Map",
    "description": "See planetary directions from a chosen place.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 137,
    "slug": "paran-line-finder",
    "name": "Paran Line Finder",
    "description": "Find places where planets hit angles together.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 138,
    "slug": "travel-transit-planner",
    "name": "Travel Transit Planner",
    "description": "Plan trips using dates, transits, and location charts.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 139,
    "slug": "electional-astrology-finder",
    "name": "Electional Astrology Finder",
    "description": "Search for dates that meet the conditions you set.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 140,
    "slug": "wedding-date-finder",
    "name": "Wedding Date Finder",
    "description": "Compare possible wedding dates with clear election rules.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 141,
    "slug": "business-launch-date-finder",
    "name": "Business Launch Date Finder",
    "description": "Compare possible launch times for a business.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 142,
    "slug": "horary-chart-generator",
    "name": "Horary Chart Generator",
    "description": "Cast a chart for the moment you ask a question.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 143,
    "slug": "birth-time-rectification-assistant",
    "name": "Birth-Time Rectification Assistant",
    "description": "Test possible birth times against known life events.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 144,
    "slug": "birth-time-accuracy-checker",
    "name": "Birth-Time Accuracy Checker",
    "description": "See which chart factors change if birth time is uncertain.",
    "categoryId": "location-timing-and-specialist-tools",
    "featured": false,
    "fields": [
      "date",
      "place"
    ]
  },
  {
    "id": 145,
    "slug": "ephemeris-generator",
    "name": "Ephemeris Generator",
    "description": "Make planet position tables for any date range.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 146,
    "slug": "ephemeris-search-engine",
    "name": "Ephemeris Search Engine",
    "description": "Find dates when a planet reaches a chosen degree.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 147,
    "slug": "aspect-search-engine",
    "name": "Aspect Search Engine",
    "description": "Find dates when a chosen aspect becomes exact.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 148,
    "slug": "planetary-cycle-calculator",
    "name": "Planetary Cycle Calculator",
    "description": "Find major cycles like Jupiter–Saturn conjunctions.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date"
    ]
  },
  {
    "id": 149,
    "slug": "fixed-star-conjunction-finder",
    "name": "Fixed Star Conjunction Finder",
    "description": "Check planets and angles against selected fixed stars.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 150,
    "slug": "asteroid-placement-finder",
    "name": "Asteroid Placement Finder",
    "description": "Find placements for Chiron, Ceres, Juno, Vesta, and more.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 151,
    "slug": "midpoint-calculator",
    "name": "Midpoint Calculator",
    "description": "Calculate planetary midpoints in your chart.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 152,
    "slug": "harmonic-chart-generator",
    "name": "Harmonic Chart Generator",
    "description": "Create harmonic charts such as the 5th, 7th, or 9th.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 153,
    "slug": "declination-aspect-finder",
    "name": "Declination Aspect Finder",
    "description": "Find parallel and contraparallel aspects.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 154,
    "slug": "out-of-bounds-planet-finder",
    "name": "Out-of-Bounds Planet Finder",
    "description": "Find planets beyond the Sun's usual declination range.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 155,
    "slug": "house-system-comparison-tool",
    "name": "House-System Comparison Tool",
    "description": "Compare Placidus, Whole Sign, Equal, Koch, and more.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 156,
    "slug": "tropical-sidereal-comparison",
    "name": "Tropical\u2013Sidereal Comparison",
    "description": "See how placements differ in tropical vs sidereal zodiacs.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 157,
    "slug": "true-vs-mean-black-moon-lilith-calculator",
    "name": "True vs. Mean Black Moon Lilith Calculator",
    "description": "Compare True and Mean Lilith and what each can highlight.",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 158,
    "slug": "lunar-nodes-calculator-rahu-ketu",
    "name": "Lunar Nodes Calculator (Rahu / Ketu)",
    "description": "Find your North and South Nodes (Rahu and Ketu).",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 159,
    "slug": "vertex-anti-vertex-finder",
    "name": "Vertex / Anti-Vertex Finder",
    "description": "Find your Vertex and Anti-Vertex “fated meeting” axis.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 160,
    "slug": "midheaven-mc-and-imum-coeli-ic-calculator",
    "name": "Midheaven (MC) & Imum Coeli (IC) Calculator",
    "description": "Find your Midheaven (public path) and IC (private roots).",
    "categoryId": "essential-birth-chart-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 161,
    "slug": "part-of-spirit-pars-spiritus-calculator",
    "name": "Part of Spirit / Pars Spiritus Calculator",
    "description": "Find the Part of Spirit: focus, will, and directed effort.",
    "categoryId": "essential-birth-chart-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 162,
    "slug": "hemisphere-and-quadrant-emphasis-tool",
    "name": "Hemisphere & Quadrant Emphasis Tool",
    "description": "See which chart half and quarter holds most of your planets.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 163,
    "slug": "chart-shape-pattern-identifier",
    "name": "Chart Shape / Pattern Identifier",
    "description": "Identify chart shapes like Bowl, Bundle, Bucket, or Seesaw.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 164,
    "slug": "mutual-reception-finder",
    "name": "Mutual Reception Finder",
    "description": "Find planets sitting in each other's signs.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 165,
    "slug": "combustion-and-cazimi-finder",
    "name": "Combustion & Cazimi Finder",
    "description": "Find planets very close to the Sun (combust or cazimi).",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 166,
    "slug": "lunar-nodes-aspect-calculator",
    "name": "Lunar Nodes Aspect Calculator",
    "description": "See which planets touch or square your nodal axis.",
    "categoryId": "accessible-natal-analysis-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 167,
    "slug": "tertiary-and-minor-progressions-calculator",
    "name": "Tertiary & Minor Progressions Calculator",
    "description": "Create short-term progressed charts for finer timing.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 168,
    "slug": "converse-transits-converse-progressions-tool",
    "name": "Converse Transits / Converse Progressions Tool",
    "description": "Cast reverse-direction timing charts used in advanced work.",
    "categoryId": "horoscope-and-forecasting-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 169,
    "slug": "uranus-opposition-midlife-transition-calculator",
    "name": "Uranus Opposition / Midlife Transition Calculator",
    "description": "Find dates for the Uranus opposition midlife transit.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 170,
    "slug": "neptune-square-neptune-and-pluto-square-pluto-calculator",
    "name": "Neptune Square Neptune & Pluto Square Pluto Calculator",
    "description": "Find Neptune and Pluto square dates in adult life cycles.",
    "categoryId": "returns-and-life-cycle-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 171,
    "slug": "lunar-fertility-jonas-method-calendar",
    "name": "Lunar Fertility / Jonas Method Calendar",
    "description": "Estimate fertility windows using the Jonas Moon method.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 172,
    "slug": "decumbiture-chart-generator",
    "name": "Decumbiture Chart Generator",
    "description": "Cast a traditional chart for the start of an illness.",
    "categoryId": "moon-and-lunar-planning-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 173,
    "slug": "draconic-synastry-calculator",
    "name": "Draconic Synastry Calculator",
    "description": "Compare two draconic charts for deeper relationship themes.",
    "categoryId": "relationship-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 174,
    "slug": "synastry-house-overlay-explorer",
    "name": "Synastry House Overlay Explorer",
    "description": "See where one person's planets fall in the other's houses.",
    "categoryId": "relationship-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 175,
    "slug": "midpoint-synastry-matrix",
    "name": "Midpoint Synastry Matrix",
    "description": "Compare one person's planets to the other's midpoints.",
    "categoryId": "relationship-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place",
      "partnerName",
      "partnerDate",
      "partnerTime",
      "partnerPlace"
    ]
  },
  {
    "id": 176,
    "slug": "nakshatra-tara-bala-calculator",
    "name": "Nakshatra Tara Bala Calculator",
    "description": "Check Tara Bala day favorability from your birth star.",
    "categoryId": "vedic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 177,
    "slug": "sade-sati-phase-breakdown",
    "name": "Sade Sati Phase Breakdown",
    "description": "Break Sade Sati into rising, peak, and setting phases.",
    "categoryId": "vedic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 178,
    "slug": "jaimini-chara-dasha-calculator",
    "name": "Jaimini Chara Dasha Calculator",
    "description": "Calculate Jaimini Chara (sign-based) dasha periods.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 179,
    "slug": "karakamsha-chart-generator",
    "name": "Karakamsha Chart Generator",
    "description": "Build the Karakamsha chart from the Atmakaraka in D9.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 180,
    "slug": "sarvatobhadra-chakra-tool",
    "name": "Sarvatobhadra Chakra Tool",
    "description": "Explore the Sarvatobhadra transit wheel and vedhas.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 181,
    "slug": "varshaphala-tajika-annual-chart",
    "name": "Varshaphala / Tajika Annual Chart",
    "description": "Create a Vedic annual (Varshaphala / Tajika) chart.",
    "categoryId": "more-advanced-vedic-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 182,
    "slug": "hyleg-and-alcocoden-finder",
    "name": "Hyleg and Alcocoden Finder",
    "description": "Find traditional Hyleg and Alcocoden life significators.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 183,
    "slug": "planetary-day-and-planetary-hour-calculator",
    "name": "Planetary Day and Planetary Hour Calculator",
    "description": "Find today's planetary day and hour from local sunrise.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 184,
    "slug": "bounds-terms-table-comparison",
    "name": "Bounds / Terms Table Comparison",
    "description": "Compare Egyptian, Ptolemaic, and Chaldean bounds/terms.",
    "categoryId": "traditional-and-hellenistic-astrology-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 185,
    "slug": "draconic-natal-chart-generator",
    "name": "Draconic Natal Chart Generator",
    "description": "Create a draconic natal chart with the North Node at 0° Aries.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 186,
    "slug": "90-dial-cosmobiology-wheel",
    "name": "90° Dial / Cosmobiology Wheel",
    "description": "View hard aspects on a 90° cosmobiology dial.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 187,
    "slug": "heliocentric-chart-generator",
    "name": "Heliocentric Chart Generator",
    "description": "Create a Sun-centered (heliocentric) chart.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 188,
    "slug": "sabian-symbol-directory-and-degree-finder",
    "name": "Sabian Symbol Directory & Degree Finder",
    "description": "Look up the Sabian Symbol for any zodiac degree.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": true,
    "fields": [
      "date",
      "time",
      "place"
    ]
  },
  {
    "id": 189,
    "slug": "pre-natal-eclipse-finder",
    "name": "Pre-Natal Eclipse Finder",
    "description": "Find the solar and lunar eclipses just before birth.",
    "categoryId": "additional-high-value-professional-tools",
    "featured": false,
    "fields": [
      "date",
      "time",
      "place"
    ]
  }
]

export const toolsBySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool])) as Record<string, Tool>

export const toolsByCategory = toolCategories.map((category) => ({
  ...category,
  tools: tools.filter((tool) => tool.categoryId === category.id),
}))

export function getTool(slug: string) {
  return toolsBySlug[slug]
}

export function getCategory(id: string) {
  return toolCategories.find((category) => category.id === id)
}

export function relatedTools(tool: Tool, limit = 4) {
  return tools
    .filter((candidate) => candidate.categoryId === tool.categoryId && candidate.slug !== tool.slug)
    .slice(0, limit)
}

/**
 * Image path for tool cards and hero banners.
 * Always uses `/images/tools/${slug}.webp` (matching the tool name slug with `.webp` extension,
 * e.g. "Saturn Sign Finder" -> `/images/tools/saturn-sign-finder.webp`).
 * When a `.webp` file exists in `public/images/tools/`, Cloudflare static assets serve it directly;
 * when not yet added, the Worker route `/images/tools/:filename` serves the clean placeholder image.
 */
export function toolImageSrc(slug: string) {
  return `/images/tools/${slug}.webp`
}
