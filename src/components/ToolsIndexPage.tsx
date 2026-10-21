import { toolImageSrc, toolsByCategory, type Tool } from '../data/tools'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { Layout } from './Layout'
import { AstrocartographyMapCard, LiveEphemerisCard, SkyTelemetryStrip } from './ObservatoryVisuals'

export function ToolsIndexPage({ categoryId, sky }: { categoryId?: string; sky: LiveSkySnapshot }) {
  const groups = categoryId
    ? toolsByCategory.filter((group) => group.id === categoryId)
    : toolsByCategory

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '189 Free Astrology Calculators Directory',
    url: 'https://astropulses.com/tools',
    description:
      'Complete directory of 189 server-calculated astrology tools across Western Natal, Vedic Jyotish, Hellenistic, Synastry, and Astrocartography.',
  }

  return (
    <Layout
      title="189 Free Astrology Calculators: Full Directory [2026]"
      description="Browse all 189 free astrology calculators in one directory. Instant birth charts, Moon signs, Vedic Kundli, Synastry, and transit tools in plain English."
      canonicalPath="/tools"
      active="tools"
      ctaHref="/tools/big-three-calculator"
      ctaLabel="Big Three"
      jsonLd={itemListSchema}
    >
      <main>
        <section class="border-b border-line py-8 sm:py-12">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <SkyTelemetryStrip sky={sky} />

            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
              <div>
                <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">189 Precision Calculators</p>
                <h1 class="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-5xl">
                  Every calculator in one <span class="yellow-text">visual library.</span>
                </h1>
                <p class="text-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                  Filter by keyword or tradition below, or inspect our live ephemeris and astrocartography instruments.
                </p>
              </div>

              <div class="relative w-full lg:w-80">
                <input
                  id="tool-search"
                  type="search"
                  placeholder="Search 189 tools (e.g. Moon, Vedic, Synastry)..."
                  class="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-4 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-300"
                />
                <span id="tool-search-count" class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">
                  189
                </span>
              </div>
            </div>

            <div class="flex gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
              <button
                type="button"
                data-cat-filter="all"
                class="cat-pill active shrink-0 rounded-full px-3.5 py-1.5 font-semibold bg-amber-300 text-slate-950 cursor-pointer transition"
              >
                All (189)
              </button>
              {toolsByCategory.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  data-cat-filter={group.name}
                  class="cat-pill shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 font-medium text-soft hover:text-accent cursor-pointer transition"
                >
                  {group.name} ({group.tools.length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Observatory Instruments on /tools */}
        <section class="border-b border-line py-8 sm:py-10">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div class="lg:col-span-7">
              <AstrocartographyMapCard sky={sky} />
            </div>
            <div class="lg:col-span-5">
              <LiveEphemerisCard sky={sky} />
            </div>
          </div>
        </section>

        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            data-cat-section={group.name}
            class="cv-section scroll-mt-20 border-b border-line"
          >
            <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
              <div>
                <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                  {group.tools.length} tools
                </p>
                <h2 class="mt-1.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{group.name}</h2>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool: Tool) => (
                  <a
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    data-category={group.name}
                    data-search={`${tool.name} ${tool.description} ${group.name}`.toLowerCase()}
                    class="tool-card-item site-card group flex flex-col justify-between overflow-hidden rounded-2xl transition"
                  >
                    <div>
                      <div class="relative aspect-[16/10] overflow-hidden border-b border-line bg-media">
                        <img
                          src={toolImageSrc(tool.slug)}
                          alt={tool.name}
                          width="640"
                          height="400"
                          loading="lazy"
                          decoding="async"
                          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        {tool.featured && (
                          <span class="text-accent absolute right-3 top-3 rounded-md border border-amber-200/20 bg-page-glass px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                            Featured
                          </span>
                        )}
                      </div>
                      <div class="p-4 sm:p-5">
                        <h3 class="text-base font-bold tracking-tight text-ink group-hover:text-accent sm:text-lg">
                          {tool.name}
                        </h3>
                        <p class="text-soft mt-1.5 text-xs leading-5">{tool.description}</p>
                      </div>
                    </div>
                    <div class="mx-4 mb-4 flex items-center justify-between border-t border-line pt-3 text-xs sm:mx-5 sm:mb-5">
                      <span class="text-faint">Server calculation</span>
                      <span class="text-accent font-semibold">Open tool →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}

        <script src="/home-observatory.js" defer></script>
      </main>
    </Layout>
  )
}
