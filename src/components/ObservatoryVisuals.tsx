import type { FC } from 'hono/jsx'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { tools, getCategory, toolImageSrc, type Tool } from '../data/tools'
const PLANET_TOOL_LINKS: Record<string, string> = {
  Sun: '/tools/zodiac-sign-finder',
  Moon: '/tools/moon-sign-finder',
  Mercury: '/tools/mercury-sign-finder',
  Venus: '/tools/venus-sign-finder',
  Mars: '/tools/mars-sign-finder',
  Jupiter: '/tools/jupiter-sign-finder',
  Saturn: '/tools/saturn-sign-finder',
  Uranus: '/tools/outer-planet-sign-finder',
  Neptune: '/tools/outer-planet-sign-finder',
  Pluto: '/tools/outer-planet-sign-finder',
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#f59e0b',
  Moon: '#0284c7',
  Mercury: '#0369a1',
  Venus: '#be185d',
  Mars: '#e11d48',
  Jupiter: '#7c3aed',
  Saturn: '#b45309',
  Uranus: '#0d9488',
  Neptune: '#2563eb',
  Pluto: '#6d28d9',
  Chiron: '#059669',
}

const PLANET_WHEEL_COLORS: Record<string, string> = {
  Sun: '#ffd166',
  Moon: '#e2e8f0',
  Mercury: '#38bdf8',
  Venus: '#f472b6',
  Mars: '#fb7185',
  Jupiter: '#c084fc',
  Saturn: '#fbbf24',
  Uranus: '#2dd4bf',
  Neptune: '#60a5fa',
  Pluto: '#a78bfa',
  Chiron: '#34d399',
}

export const SkyTelemetryStrip: FC<{ sky: LiveSkySnapshot; compact?: boolean }> = ({ sky, compact }) => {
  return (
    <div class="site-card px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-semibold uppercase tracking-wider text-slate-400">Live Ephemeris</span>
        <span class="text-slate-500 hidden sm:inline">· {sky.timestampReadable}</span>
      </div>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <a href="/tools/zodiac-sign-finder" class="hover:text-amber-300 transition">
          <span class="text-amber-300 font-semibold">☉ {sky.sunSign}</span>{' '}
          <span class="text-slate-400 font-mono">{sky.sunFormatted}</span>
        </a>
        <a href="/tools/moon-sign-finder" class="hover:text-amber-300 transition">
          <span class="text-sky-300 font-semibold">☽ {sky.moonSign}</span>{' '}
          <span class="text-slate-400 font-mono">{sky.moonFormatted}</span>
        </a>
        <a href="/tools/moon-sign-finder" class="hover:text-amber-300 transition hidden md:inline">
          <span class="text-slate-300">{sky.moonPhase}</span>{' '}
          <span class="text-slate-500">({sky.moonIllumination}%)</span>
        </a>
        <a href="/tools/vedic-rashi-finder" class="hover:text-amber-300 transition hidden lg:inline">
          <span class="text-purple-300">✦ {sky.nakshatra.name}</span>{' '}
          <span class="text-slate-500">Pada {sky.nakshatra.pada}</span>
        </a>
        {!compact && (
          <a href="/tools/interactive-birth-chart" class="text-amber-300 font-semibold hover:underline ml-auto">
            Live Sky →
          </a>
        )}
      </div>
    </div>
  )
}

export const RadixWheelSvg: FC<{ sky: LiveSkySnapshot; interactiveId?: boolean }> = ({ sky, interactiveId = true }) => {
  return (
    <svg
      id={interactiveId ? 'radix-svg' : undefined}
      viewBox={`0 0 ${sky.wheel.size} ${sky.wheel.size}`}
      class="w-full max-w-[440px] max-h-[440px] select-none mx-auto"
      role="img"
      aria-label="Real-time Ecliptic Radix Wheel"
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255, 209, 102, 0.14)" />
          <stop offset="65%" stop-color="rgba(56, 189, 248, 0.04)" />
          <stop offset="100%" stop-color="rgba(5, 8, 17, 0)" />
        </radialGradient>
      </defs>

      <circle cx="260" cy="260" r="245" fill="url(#coreGlow)" />
      <circle cx="260" cy="260" r="236" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <circle cx="260" cy="260" r="198" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <circle cx="260" cy="260" r="142" fill="none" stroke="rgba(255,209,102,0.22)" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx="260" cy="260" r="92" fill="rgba(7, 11, 22, 0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

      <g id={interactiveId ? 'wheel-sectors' : undefined}>
        {sky.wheel.zodiacSegments.map((s) => (
          <g key={s.sign}>
            <line
              x1={s.tickX1}
              y1={s.tickY1}
              x2={s.tickX2}
              y2={s.tickY2}
              stroke="rgba(255,255,255,0.12)"
              stroke-width="1"
            />
            <text
              x={s.midX}
              y={s.midY}
              text-anchor="middle"
              dominant-baseline="central"
              fill="#ffd166"
              font-size="14"
              font-weight="600"
            >
              {s.glyph}
            </text>
          </g>
        ))}
      </g>

      <g id={interactiveId ? 'wheel-houses' : undefined}>
        {sky.wheel.houseLines.map((h) => (
          <g key={h.house}>
            <line
              x1={h.x1}
              y1={h.y1}
              x2={h.x2}
              y2={h.y2}
              stroke={h.house % 3 === 1 ? 'rgba(255,209,102,0.4)' : 'rgba(255,255,255,0.07)'}
              stroke-width={h.house % 3 === 1 ? '1.5' : '0.8'}
            />
            <text
              x={h.labelX}
              y={h.labelY}
              text-anchor="middle"
              dominant-baseline="central"
              fill="rgba(148,163,184,0.6)"
              font-size="9"
              font-family="monospace"
            >
              {h.house}
            </text>
          </g>
        ))}
      </g>

      <g id={interactiveId ? 'wheel-aspects' : undefined}>
        {sky.wheel.aspects.map((c, idx) => (
          <line
            key={idx}
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke={c.color}
            stroke-width={c.type === 'Conjunction' || c.type === 'Opposition' ? '1.5' : '1.1'}
            stroke-dasharray={c.dash}
            stroke-opacity="0.72"
          />
        ))}
      </g>

      <g id={interactiveId ? 'wheel-planets' : undefined}>
        {sky.planets.map((p) => {
          const color = PLANET_WHEEL_COLORS[p.name] || '#ffd166'
          return (
            <g
              key={p.name}
              class="planet-node cursor-pointer"
              data-planet={p.name}
              data-sign={p.sign}
              data-deg={p.degreeFormatted}
              data-house={`House ${p.house}`}
              data-dignity={p.dignity}
              data-retro={p.retrograde ? 'Retrograde ℞' : 'Direct'}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="rgba(7, 11, 22, 0.92)"
                stroke={color}
                stroke-width="1.5"
              />
              <text
                x={p.x}
                y={p.y}
                text-anchor="middle"
                dominant-baseline="central"
                fill={color}
                font-size="12"
                font-weight="700"
              >
                {p.glyph}
              </text>
            </g>
          )
        })}
      </g>

      <g text-anchor="middle">
        <text x="260" y="244" fill="#94a3b8" font-size="9" font-family="monospace" letter-spacing="1.5">
          ASCENDANT
        </text>
        <text
          id={interactiveId ? 'wheel-center-asc' : undefined}
          x="260"
          y="263"
          fill="#f8fafc"
          font-size="13"
          font-weight="700"
        >
          {sky.ascendantFormatted}
        </text>
        <text
          id={interactiveId ? 'wheel-center-mc' : undefined}
          x="260"
          y="281"
          fill="#ffd166"
          font-size="10"
          font-family="monospace"
        >
          MC {sky.midheavenFormatted}
        </text>
      </g>
    </svg>
  )
}

export const AstrocartographyMapCard: FC<{ sky: LiveSkySnapshot }> = ({ sky }) => {
  return (
    <div class="site-card p-5 sm:p-6 flex flex-col justify-between">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-sky-300">
            D3-Geo Spherical Projection · Astrocartography
          </span>
          <h3 class="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
            Live Planetary Horizon &amp; Meridian Lines
          </h3>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <a href="/tools/astrocartography-map" class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-amber-300 font-medium transition">
            Astrocartography Map →
          </a>
        </div>
      </div>

      <div class="relative rounded-xl overflow-hidden border border-white/10 bg-[#050914]">
        <svg
          viewBox={`0 0 ${sky.astrocartography.width} ${sky.astrocartography.height}`}
          class="w-full h-auto block"
          role="img"
          aria-label="World Astrocartography Map"
        >
          <path d={sky.astrocartography.graticulePath} fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.7" />
          <path
            d={sky.astrocartography.landPath}
            fill="rgba(30, 41, 59, 0.55)"
            stroke="rgba(148, 163, 184, 0.24)"
            stroke-width="0.7"
          />
          {sky.astrocartography.curves.map((line, i) => (
            <path
              key={i}
              d={line.d}
              fill="none"
              stroke={line.color}
              stroke-width={line.kind === 'ASC' ? '1.8' : '1.3'}
              stroke-dasharray={line.kind === 'DSC' ? '4 4' : undefined}
              stroke-opacity="0.85"
            />
          ))}
          {sky.astrocartography.cities.map((c) => (
            <g key={c.name}>
              <circle cx={c.x} cy={c.y} r="3.5" fill="#ffd166" />
              <circle cx={c.x} cy={c.y} r="8" fill="none" stroke="#ffd166" stroke-opacity="0.4" />
              <text x={c.x + 7} y={c.y + 3} fill="#f8fafc" font-size="10" font-weight="600">
                {c.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>True spherical horizon &amp; meridian intersections computed in real time.</span>
        <div class="flex flex-wrap gap-3">
          <a href="/tools/astrocartography-map" class="text-amber-300 hover:underline font-medium">
            Open Map Tool →
          </a>
        </div>
      </div>
    </div>
  )
}

export const LiveEphemerisCard: FC<{ sky: LiveSkySnapshot }> = ({ sky }) => {
  return (
    <div class="site-card p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              Tropical + Lahiri Sidereal
            </span>
            <h3 class="text-lg font-bold tracking-tight mt-0.5">Live Ephemeris Positions</h3>
          </div>
          <a href="/tools/planet-in-sign-calculator" class="text-xs text-amber-300 hover:underline font-medium">
            All Planets →
          </a>
        </div>

        <div class="divide-y divide-white/5 text-sm">
          {sky.planets.slice(0, 8).map((p) => {
            const toolHref = PLANET_TOOL_LINKS[p.name] || '/tools/planet-in-sign-calculator'
            return (
              <a
                key={p.name}
                href={toolHref}
                class="py-2 flex items-center justify-between gap-2 hover:bg-white/[0.02] px-1.5 -mx-1.5 rounded-lg transition"
              >
                <div class="flex items-center gap-2">
                  <span class="w-5 text-center font-bold text-amber-300">
                    {p.glyph}
                  </span>
                  <span class="font-medium text-slate-200">{p.name}</span>
                  {p.retrograde && (
                    <span class="text-xs px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-mono">
                      ℞
                    </span>
                  )}
                </div>
                <div class="text-right">
                  <span class="text-slate-200">
                    {p.sign} <span class="font-mono">{p.degreeFormatted}</span>
                  </span>
                  <span class="text-slate-500 block text-xs">
                    House {p.house} · {p.dignity}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span class="text-slate-400">Lahiri Ayanamsa: {sky.lahiriAyanamsa}</span>
        <a href="/tools/retrograde-planet-finder" class="font-semibold text-amber-300 hover:underline">
          Retrograde Finder →
        </a>
      </div>
    </div>
  )
}

export const ToolObservatorySection: FC<{ tool: Tool; sky: LiveSkySnapshot }> = ({ tool, sky }) => {
  const categoryObj = getCategory(tool.categoryId)
  const categoryName = categoryObj?.name || 'Collection'
  const categoryTools = tools.filter((t) => t.categoryId === tool.categoryId && t.slug !== tool.slug)
  const isLocationTool =
    tool.slug.includes('astrocartography') ||
    tool.slug.includes('relocation') ||
    tool.slug.includes('cities') ||
    tool.slug.includes('paran') ||
    tool.slug.includes('planetary-lines') ||
    tool.slug.includes('local-space') ||
    tool.slug.includes('geodetic')

  return (
    <section class="mt-10 space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {isLocationTool ? (
          <>
            <div class="lg:col-span-7">
              <AstrocartographyMapCard sky={sky} />
            </div>
            <div class="lg:col-span-5">
              <LiveEphemerisCard sky={sky} />
            </div>
          </>
        ) : (
          <>
            <div class="lg:col-span-6 site-card p-5 sm:p-6 flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                    Live Reference Wheel
                  </span>
                  <h3 class="text-lg font-bold tracking-tight mt-0.5">
                    Current Sky Radix ({sky.timestampReadable})
                  </h3>
                </div>
                <a
                  href="/tools/interactive-birth-chart"
                  class="text-xs text-amber-300 hover:underline font-medium"
                >
                  Interactive Wheel →
                </a>
              </div>
              <div class="py-2 px-2 rounded-2xl dark-observatory-stage my-2">
                <RadixWheelSvg sky={sky} interactiveId={false} />
              </div>
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-white/10">
                <span>
                  ASC: <strong class="text-slate-200">{sky.ascendantFormatted}</strong> · MC:{' '}
                  <strong class="text-amber-300">{sky.midheavenFormatted}</strong>
                </span>
                <a href="/tools/astrocartography-map" class="text-sky-300 hover:underline font-medium">
                  View Astrocartography Map →
                </a>
              </div>
            </div>
            <div class="lg:col-span-6">
              <LiveEphemerisCard sky={sky} />
            </div>
          </>
        )}
      </div>

      {categoryTools.length > 0 && (
        <div class="site-card p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                {categoryName} ({categoryTools.length + 1} Tools)
              </span>
              <h3 class="text-base sm:text-lg font-bold tracking-tight mt-0.5">
                Switch to another {categoryName.toLowerCase()} calculator
              </h3>
            </div>
            <a href="/tools" class="text-xs text-amber-300 hover:underline font-semibold">
              All 189 Tools →
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {categoryTools.map((sibling) => (
              <a
                key={sibling.slug}
                href={`/tools/${sibling.slug}`}
                class="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-300/30 transition group"
              >
                <img
                  src={toolImageSrc(sibling.slug)}
                  alt={sibling.name}
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="32"
                  class="w-12 h-8 rounded-md object-cover shrink-0 border border-white/10"
                />
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition truncate">
                    {sibling.name}
                  </p>
                  <p class="text-[11px] text-slate-400 truncate">{sibling.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
