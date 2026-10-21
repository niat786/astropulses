import type { FC } from 'hono/jsx'
import { tools, toolsByCategory, getCategory, toolImageSrc, type Tool } from '../data/tools'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { Layout } from './Layout'
import { RadixWheelSvg, SkyTelemetryStrip } from './ObservatoryVisuals'

const FLAGSHIP_SLUGS = [
  'big-three-calculator',
  'birth-chart-generator',
  'moon-sign-finder',
  'rising-sign-finder',
  'synastry-chart-calculator',
  'astrocartography-map',
  'vedic-rashi-finder',
  'saturn-return-calculator',
  'chinese-zodiac-finder',
]

const QUICK_LAUNCH_TOOLS = [
  { slug: 'big-three-calculator', label: 'Big Three (Sun, Moon & Rising)' },
  { slug: 'birth-chart-generator', label: 'Full Natal Birth Chart' },
  { slug: 'moon-sign-finder', label: 'Exact Moon Sign & Degree' },
  { slug: 'rising-sign-finder', label: 'Rising Sign (Ascendant)' },
  { slug: 'vedic-rashi-finder', label: 'Vedic Rashi & Nakshatra' },
  { slug: 'saturn-return-calculator', label: 'Saturn Return Timing' },
  { slug: 'dominant-planet-calculator', label: 'Dominant Planet & Element' },
  { slug: 'astrocartography-map', label: 'Astrocartography Relocation' },
]

export const HomePage: FC<{ sky: LiveSkySnapshot }> = ({ sky }) => {
  const nowIsoDate = new Date().toISOString().slice(0, 10)
  const flagshipTools = FLAGSHIP_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(
    (t): t is Tool => Boolean(t),
  )

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AstroPulses',
      url: 'https://astropulses.com',
      description:
        'Free server-calculated astrology tools, birth chart calculators, Vedic Jyotish dashas, synastry, and live sky ephemeris.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://astropulses.com/tools?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AstroPulses',
      url: 'https://astropulses.com',
      logo: 'https://astropulses.com/images/brand/icon-512.png',
    },
  ]

  return (
    <Layout
      title="Free Astrology Calculators & Live Birth Chart [2026]"
      description="Run 189 free, accurate astrology calculators on our live server ephemeris. Get your Big Three, Natal Chart, Vedic Rashi, and Synastry in plain English."
      canonicalPath="/"
      ctaHref="/tools/big-three-calculator"
      ctaLabel="Big Three"
      jsonLd={homeSchemas}
    >
      <div class="celestial-stage" aria-hidden="true"></div>

      <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20 space-y-14 sm:space-y-16">
        {/* LIVE TELEMETRY BAR */}
        <SkyTelemetryStrip sky={sky} />

        {/* HERO: QUICK CALCULATOR LAUNCHER + LIVE RADIX WHEEL */}
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left column: Headline + Multi-Tool Instant Calculator */}
          <div class="lg:col-span-6 space-y-5">
            <div>
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300/20 bg-amber-300/5 text-amber-300 text-xs font-medium mb-3">
                189 Calculators · VSOP87 &amp; Lahiri Sidereal Engine
              </span>
              <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12]">
                Precision astrology tools,{' '}
                <span class="yellow-text">calculated in real time.</span>
              </h1>
              <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Enter your birth details once to run any calculator immediately, or browse all{' '}
                <a href="#all-tools" class="text-amber-300 underline decoration-amber-300/40 hover:decoration-amber-300">
                  189 specialized tools across 13 traditions
                </a>
                .
              </p>
            </div>

            {/* Multi-Tool Instant Launcher Form */}
            <form
              id="quick-launch-form"
              method="post"
              action="/tools/big-three-calculator"
              class="site-card p-5 sm:p-6 space-y-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Instant Calculator Launcher
                </span>
                <span class="text-[11px] text-slate-400">Zero sign-up · Server-calculated</span>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-slate-400 mb-1" for="quick-tool-select">
                  Choose calculator to run
                </label>
                <select
                  id="quick-tool-select"
                  class="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-300"
                >
                  {QUICK_LAUNCH_TOOLS.map((item) => (
                    <option key={item.slug} value={`/tools/${item.slug}`} class="bg-slate-900 text-slate-100">
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-slate-400 mb-1" for="hero-date">
                    Birth Date
                  </label>
                  <input
                    id="hero-date"
                    type="date"
                    name="birthDate"
                    required
                    defaultValue="1996-05-14"
                    max={nowIsoDate}
                    class="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-400 mb-1" for="hero-time">
                    Birth Time
                  </label>
                  <input
                    id="hero-time"
                    type="time"
                    name="birthTime"
                    defaultValue="08:30"
                    class="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-400 mb-1" for="hero-place">
                    Birth City
                  </label>
                  <input
                    id="hero-place"
                    type="text"
                    name="birthPlace"
                    required
                    placeholder="London, UK"
                    defaultValue="London, UK"
                    class="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label class="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="unknownTime"
                    value="1"
                    class="rounded border-white/20 bg-slate-900 text-amber-300"
                  />
                  Exact birth time unknown
                </label>
                <button
                  type="submit"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm yellow-btn transition cursor-pointer"
                >
                  Calculate Now →
                </button>
              </div>
            </form>

            {/* Quick Jump Chips to Major Traditions */}
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-500 font-medium">Popular:</span>
              <a href="/tools/birth-chart-generator" class="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 transition">
                Natal Chart
              </a>
              <a href="/tools/synastry-chart-calculator" class="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 transition">
                Synastry
              </a>
              <a href="/tools/astrocartography-map" class="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 transition">
                Astrocartography
              </a>
              <a href="/tools/vedic-rashi-finder" class="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 transition">
                Vedic Rashi
              </a>
              <a href="/tools/saturn-return-calculator" class="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 transition">
                Saturn Return
              </a>
            </div>
          </div>

          {/* Right column: Clean 2D Live Sky Radix Wheel + Scrubber */}
          <div class="lg:col-span-6">
            <div class="site-card p-4 sm:p-5 flex flex-col justify-between">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-amber-300"></span>
                  <span class="text-xs font-semibold tracking-wide text-slate-200">
                    Live Ecliptic Radix Wheel
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <span id="sky-timestamp-badge" class="font-mono text-slate-400">
                    {sky.timestampReadable}
                  </span>
                  <a href="/tools/interactive-birth-chart" class="text-amber-300 font-semibold hover:underline">
                    Full Wheel →
                  </a>
                </div>
              </div>

                <div class="relative py-3 px-2 rounded-2xl dark-observatory-stage my-2 flex items-center justify-center">
                  <RadixWheelSvg sky={sky} interactiveId={true} />

                <div
                  id="planet-inspector"
                  class="hidden absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 rounded-xl bg-slate-950/95 border border-white/15 p-3 text-xs shadow-xl pointer-events-none"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span id="inspector-name" class="font-bold text-amber-300 text-sm">
                      Sun
                    </span>
                    <span id="inspector-retro" class="text-[10px] font-mono text-slate-400">
                      Direct
                    </span>
                  </div>
                  <p id="inspector-tropical" class="text-slate-200 font-medium"></p>
                  <p id="inspector-sidereal" class="text-slate-400 text-[11px] mt-0.5"></p>
                </div>
              </div>

              {/* Scrubber bar */}
              <div class="pt-3 border-t border-white/10 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium">Scrub Sky Offset (-24h to +24h)</span>
                  <div class="flex items-center gap-3">
                    <span id="scrubber-offset-label" class="font-mono text-amber-300">
                      Live Now
                    </span>
                    <button
                      type="button"
                      id="scrubber-reset"
                      class="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <input
                  id="sky-scrubber"
                  type="range"
                  min="-1440"
                  max="1440"
                  step="15"
                  value="0"
                  aria-label="Scrub live sky time offset in minutes"
                  class="w-full accent-amber-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 9 FLAGSHIP CALCULATORS WITH FEATURED IMAGES */}
        <section id="featured" class="cv-section">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Most Popular Calculators
              </span>
              <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Start with a Flagship Instrument
              </h2>
            </div>
            <a href="/tools" class="text-sm font-semibold text-amber-300 hover:underline">
              View Visual Card Catalog (189) →
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flagshipTools.map((tool) => {
              const catName = getCategory(tool.categoryId)?.name || 'Calculator'
              return (
                <a
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  class="site-card overflow-hidden flex flex-col justify-between group hover:border-amber-300/35 transition"
                >
                  <div>
                    <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-white/5">
                      <img
                        src={toolImageSrc(tool.slug)}
                        alt={tool.name}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="225"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span class="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/85 text-amber-300 border border-white/10">
                        {catName}
                      </span>
                    </div>
                    <div class="p-4">
                      <h3 class="text-base font-bold text-slate-100 group-hover:text-amber-300 transition">
                        {tool.name}
                      </h3>
                      <p class="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div class="px-4 pb-4 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-300">
                    <span>Open Calculator</span>
                    <span>→</span>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* SECTION 3: ALL 189 TOOLS ORGANIZED BY 13 CATEGORIES + INSTANT SEARCH */}
        <section id="all-tools" class="cv-section">
          <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Complete Ephemeris Index · All 189 Calculators
              </span>
              <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Every Tool, Organized by Tradition
              </h2>
              <p class="text-xs sm:text-sm text-slate-400 mt-1">
                Filter instantly across all 189 calculators below, or click any tool to launch its dedicated calculator and live sky chart.
              </p>
            </div>

            <div class="relative w-full lg:w-80">
              <input
                id="tool-search"
                type="search"
                placeholder="Filter all 189 calculators (e.g. Nakshatra, Synastry)..."
                class="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-4 pr-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-300"
              />
              <span id="tool-search-count" class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-500">
                189
              </span>
            </div>
          </div>

          {/* Category Quick-Filter Pills */}
          <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <button
              type="button"
              data-cat-filter="all"
              class="cat-pill active shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-300 text-slate-950 cursor-pointer transition"
            >
              All Categories (189)
            </button>
            {toolsByCategory.map((group) => (
              <button
                key={group.id}
                type="button"
                data-cat-filter={group.name}
                class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] text-slate-300 hover:bg-white/10 border border-white/10 cursor-pointer transition"
              >
                {group.name} ({group.tools.length})
              </button>
            ))}
          </div>

          {/* 13 Category Hubs — Every Single Tool (189 total) Linked Directly from Homepage */}
          <div id="category-hubs" class="space-y-6">
            {toolsByCategory.map((group) => (
              <div
                key={group.id}
                data-cat-section={group.name}
                class="site-card p-5 sm:p-6 transition"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                  <div class="flex items-center gap-2.5">
                    <h3 class="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                      {group.name}
                    </h3>
                    <span class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-300/10 text-amber-300">
                      {group.tools.length} tools
                    </span>
                  </div>
                  <a
                    href={`/tools#${group.id}`}
                    class="text-xs text-slate-400 hover:text-amber-300 transition"
                  >
                    Visual cards →
                  </a>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {group.tools.map((tool) => (
                    <a
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      data-category={group.name}
                      data-search={`${tool.name} ${tool.description} ${group.name}`.toLowerCase()}
                      class="tool-card-item flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.05] hover:border-amber-300/30 transition group"
                    >
                      <div class="min-w-0">
                        <p class="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition truncate">
                          {tool.name}
                        </p>
                        <p class="text-[11px] text-slate-500 truncate">{tool.description}</p>
                      </div>
                      <span class="text-xs text-slate-500 group-hover:text-amber-300 shrink-0">→</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: COMPACT TRADITIONS OVERVIEW */}
        <section id="categories" class="cv-section">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Visual Collections
              </span>
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                Explore by Astrological Tradition
              </h2>
            </div>
            <a href="/blog" class="text-xs sm:text-sm font-semibold text-amber-300 hover:underline">
              Read the AstroPulses Journal →
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { title: 'Natal & Core Sign', sub: 'Sun, Moon, Rising & Houses', slug: 'birth-chart-generator', img: '/images/categories/mystical-astrology-tools-banner.webp' },
              { title: 'Synastry & Love', sub: 'Composite & Compatibility', slug: 'synastry-chart-calculator', img: '/images/categories/astrological-love-at-twilight.webp' },
              { title: 'Transits & Cycles', sub: 'Saturn Return & Progressions', slug: 'saturn-return-calculator', img: '/images/categories/cosmic-forecasting-over-misty-mountains.webp' },
              { title: 'Vedic (Jyotish)', sub: 'Rashi, Nakshatra & Dasha', slug: 'vedic-rashi-finder', img: '/images/categories/mystical-vedic-astrology-at-sunrise.webp' },
              { title: 'Astrocartography', sub: 'Relocation & Parans', slug: 'astrocartography-map', img: '/images/categories/cosmic-journeys-places-and-timing.webp' },
              { title: 'Lunar & Eclipses', sub: 'Moon Phases & Mansions', slug: 'moon-sign-finder', img: '/images/categories/moon-cycles-under-starlight.webp' },
              { title: 'Hellenistic & Lots', sub: 'Sect, Profections & Bounds', slug: 'part-of-spirit-pars-spiritus-calculator', img: '/images/categories/traditional-astrology-still-life-at-sunset.webp' },
              { title: 'Chinese Zodiac', sub: 'Animal Signs & Five Elements', slug: 'chinese-zodiac-finder', img: '/images/tools/chinese-zodiac-finder.webp' },
            ].map((c) => (
              <a
                key={c.title}
                href={`/tools/${c.slug}`}
                class="site-card overflow-hidden group flex flex-col justify-between hover:border-amber-300/35 transition"
              >
                <div class="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 border-b border-white/5">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    width="320"
                    height="200"
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div class="p-3.5">
                  <h3 class="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition">
                    {c.title}
                  </h3>
                  <p class="text-[11px] text-slate-400 mt-0.5 truncate">{c.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <script
          id="initial-sky-json"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              timestampIso: sky.timestampIso,
              planets: sky.planets,
            }),
          }}
        ></script>
        <script src="/home-observatory.js" defer></script>
      </main>
    </Layout>
  )
}
