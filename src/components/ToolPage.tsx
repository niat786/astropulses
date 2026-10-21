import type { Tool, ToolCategory } from '../data/tools'
import { relatedTools, toolImageSrc } from '../data/tools'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { getToolSeoPackage, toolSchemaGraph } from '../lib/toolSeoContent'
import type { ToolResult } from '../lib/calc/types'
import { BirthDetailsForm } from './BirthDetailsForm'
import { Layout } from './Layout'
import { SkyTelemetryStrip, ToolObservatorySection } from './ObservatoryVisuals'

type ToolPageProps = {
  tool: Tool
  category: ToolCategory
  sky: LiveSkySnapshot
  result?: ToolResult
  formValues?: Record<string, string>
  securityToken?: string
}

function ResultPanel({ tool, result }: { tool: Tool; result: ToolResult }) {
  const isError = Boolean(result.error)

  return (
    <section id="result" class="border-y border-line bg-elevated scroll-mt-16">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <p class={`text-xs font-semibold uppercase tracking-[0.16em] ${isError ? 'text-red-400' : 'text-accent'}`}>
                {isError ? 'Needs attention' : '✦ Plain-Language Summary & Ephemeris Result'}
              </p>
              {result.verificationSeal && !isError && (
                <span
                  title="Cryptographic proof that this calculation was executed on the AstroPulses server ephemeris engine"
                  class="text-soft rounded-full border border-line bg-chip px-2.5 py-0.5 font-mono text-[11px]"
                >
                  Seal: {result.verificationSeal}
                </span>
              )}
            </div>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{result.title}</h2>
          </div>
          <p class="text-soft text-xs sm:text-sm">
            Calculated on the server · {tool.name}
          </p>
        </div>

        {/* Plain-English Key Takeaway Callout */}
        <div class={`mt-6 rounded-2xl border p-5 sm:p-6 ${isError ? 'border-red-500/40 bg-red-500/5' : 'border-line bg-soft'}`}>
          <p class="text-accent text-xs font-semibold uppercase tracking-wider">
            {isError ? 'How to fix' : 'In Plain English — What This Means For You'}
          </p>
          <p class="text-ink mt-2 text-base font-medium leading-7 sm:text-lg">
            {result.summary}
          </p>
        </div>

        {result.highlights.length > 0 && (
          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.highlights.map((h) => (
              <article class="site-card rounded-2xl p-5 sm:p-6">
                <p class="text-faint text-[11px] font-medium uppercase tracking-wider">{h.label}</p>
                <p class="mt-2.5 text-2xl font-bold tracking-tight yellow-text sm:text-3xl">{h.value}</p>
                {h.note && <p class="text-muted mt-2.5 text-xs leading-5 sm:text-sm sm:leading-6">{h.note}</p>}
              </article>
            ))}
          </div>
        )}

        {result.sections.map((section) => (
          <div class="mt-10 rounded-2xl border border-line bg-soft p-5 sm:p-7">
            <h3 class="text-xl font-bold tracking-tight text-ink sm:text-2xl">{section.heading}</h3>
            {section.body && (
              <p class="text-muted mt-2.5 max-w-3xl text-sm leading-6 sm:text-base sm:leading-7">{section.body}</p>
            )}
            {section.items && section.items.length > 0 && (
              <dl class="mt-5 divide-y divide-line border-t border-line">
                {section.items.map((item) => (
                  <div class="grid gap-1.5 py-3.5 sm:grid-cols-[15rem_1fr] sm:gap-6">
                    <dt class="text-soft text-xs font-semibold sm:text-sm">{item.label}</dt>
                    <dd class="text-ink text-xs font-medium sm:text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        ))}

        {result.footnotes && result.footnotes.length > 0 && (
          <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <ul class="text-faint space-y-1 text-xs leading-5">
              {result.footnotes.map((note) => (
                <li>{note}</li>
              ))}
            </ul>
            {result.verificationSeal && (
              <p class="text-faint font-mono text-[11px]">
                Protected Server Engine · {result.verificationSeal}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function SamplePlaceholder({ tool }: { tool: Tool }) {
  return (
    <section id="result" class="border-y border-line bg-elevated">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">Ready to calculate</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Your result will appear here</h2>
          </div>
          <p class="text-soft text-xs sm:text-sm">Submit the form to run a live calculation</p>
        </div>
        <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {['What it calculates', 'How to read it', 'What to explore next'].map((title, index) => (
            <article class="site-card rounded-2xl p-5 sm:p-6">
              <p class="text-faint text-[11px] font-medium uppercase tracking-wider">Step {index + 1}</p>
              <h3 class="mt-3 text-lg font-bold tracking-tight text-ink">{title}</h3>
              <p class="text-muted mt-2 text-xs leading-5 sm:text-sm sm:leading-6">
                {index === 0 && tool.description}
                {index === 1 &&
                  'Results are written in plain language so you can connect the calculation to lived experience without needing jargon.'}
                {index === 2 &&
                  'Pair this tool with related calculators in the same collection to build a fuller picture over time.'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ToolPage({ tool, category, sky, result, formValues, securityToken }: ToolPageProps) {
  const related = relatedTools(tool)
  const seo = getToolSeoPackage(tool, category)

  return (
    <Layout
      title={seo.serpTitle}
      description={seo.metaDescription}
      canonicalPath={`/tools/${tool.slug}`}
      ogImage={toolImageSrc(tool.slug)}
      active="tools"
      ctaHref="/tools"
      ctaLabel="All Tools"
      jsonLd={toolSchemaGraph(tool, category, seo.faqs)}
    >
      <main>
        <div class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 space-y-4">
          <nav aria-label="Breadcrumb" class="text-soft flex flex-wrap items-center gap-1.5 text-xs">
            <a href="/" class="hover:text-accent">
              Home
            </a>
            <span>/</span>
            <a href="/tools" class="hover:text-accent">
              Tools
            </a>
            <span>/</span>
            <a href={`/tools#${category.id}`} class="hover:text-accent">
              {category.name}
            </a>
            <span>/</span>
            <span class="text-muted">{tool.name}</span>
          </nav>

          <SkyTelemetryStrip sky={sky} compact />
        </div>

        <section class="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
          <div class="lg:col-span-5 lg:sticky lg:top-20 lg:self-start">
            <div class="flex flex-wrap items-center gap-2">
              {tool.featured ? (
                <span class="text-accent inline-flex items-center gap-1.5 rounded-full border border-line bg-chip px-3 py-1 text-xs font-semibold">
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Featured · Free
                </span>
              ) : (
                <span class="text-soft bg-chip inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold">
                  Free tool
                </span>
              )}
              <span class="text-faint rounded-full border border-line px-3 py-1 text-xs">{category.name}</span>
            </div>

            <h1 class="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span class="yellow-text">{tool.name}</span>
            </h1>
            <p class="text-muted mt-3 max-w-lg text-sm leading-6 sm:text-base sm:leading-7">{tool.description}</p>

            {/* Featured / Placeholder Image Frame for Tool */}
            <div class="mt-5 overflow-hidden rounded-2xl border border-line bg-media">
              <div class="aspect-[16/10] overflow-hidden">
                <img
                  src={toolImageSrc(tool.slug)}
                  alt={tool.name}
                  width="640"
                  height="400"
                  decoding="async"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>

            <div class="text-muted mt-6 space-y-2.5 border-l border-line pl-4 text-xs sm:text-sm">
              <p>
                <span class="text-accent mr-2.5 font-semibold">1</span>
                Enter the birth details this calculator needs.
              </p>
              <p>
                <span class="step-2 mr-2.5 font-semibold">2</span>
                Review a clear explanation of what the result means.
              </p>
              <p>
                <span class="step-3 mr-2.5 font-semibold">3</span>
                Use it for reflection—not as professional advice.
              </p>
            </div>
          </div>

          <div class="lg:col-span-7">
            <BirthDetailsForm tool={tool} values={formValues} securityToken={securityToken} />
          </div>
        </section>

        {result ? <ResultPanel tool={tool} result={result} /> : <SamplePlaceholder tool={tool} />}

        {/* Live Reference Observatory + Complete Category Sibling Switcher */}
        <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <ToolObservatorySection tool={tool} sky={sky} />
        </div>

        <section id="learn" class="cv-section border-t border-line bg-soft">
          <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-12">
            {/* GEO Definition Engineering Block */}
            <div class="max-w-3xl space-y-4">
              <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">Plain-English Guide · GEO Reference</p>
              <h2 class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                What is the <span class="yellow-text">{tool.name}</span>?
              </h2>
              <p class="text-ink text-base font-medium leading-7 sm:text-lg">
                {seo.definitionLead}
              </p>
              <p class="text-muted text-sm leading-6 sm:text-base sm:leading-7">
                {seo.boundaryContrast}
              </p>
              <p class="text-accent text-sm font-bold tracking-wide">
                {seo.verdictLine}
              </p>
            </div>

            {/* Comparison Table (What It Does vs What It Cannot Do) */}
            <div class="space-y-4">
              <h2 class="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                How does the {tool.name} compare to standard tools?
              </h2>
              <p class="text-muted max-w-3xl text-sm leading-6 sm:text-base">
                {seo.comparisonIntro}
              </p>
              <div class="overflow-x-auto rounded-2xl border border-line bg-elevated">
                <table class="w-full text-left text-xs sm:text-sm">
                  <thead class="border-b border-line bg-chip text-soft uppercase tracking-wider text-[11px]">
                    <tr>
                      <th class="px-4 py-3.5 font-semibold">Method</th>
                      <th class="px-4 py-3.5 font-semibold">What It Can Do</th>
                      <th class="px-4 py-3.5 font-semibold">What It Cannot Do</th>
                      <th class="px-4 py-3.5 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-line">
                    {seo.comparisonRows.map((row) => (
                      <tr>
                        <td class="px-4 py-3.5 font-bold text-ink">{row.approach}</td>
                        <td class="px-4 py-3.5 text-muted leading-relaxed">{row.whatItDoes}</td>
                        <td class="px-4 py-3.5 text-soft leading-relaxed">{row.whatItCannotDo}</td>
                        <td class="px-4 py-3.5 text-ink font-medium">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* E-E-A-T Challenges & Limitations Section */}
            <div class="site-card rounded-2xl p-5 sm:p-7 space-y-2.5">
              <h2 class="text-lg font-bold tracking-tight text-ink sm:text-xl">
                What are the limits of this calculator?
              </h2>
              <p class="text-muted text-sm leading-6 sm:text-base sm:leading-7">
                {seo.limitationsBody}
              </p>
            </div>

            {/* Direct-Answer FAQ Section */}
            <div class="space-y-6">
              <div>
                <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">Quick Answers · FAQ</p>
                <h2 class="mt-1.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Frequently asked questions about the {tool.name}
                </h2>
              </div>

              <div class="space-y-5">
                {seo.faqs.map((faq) => (
                  <article class="border-b border-line pb-5 last:border-b-0 last:pb-0">
                    <h3 class="text-lg font-bold tracking-tight text-ink sm:text-xl">{faq.question}</h3>
                    <p class="text-muted mt-2 text-sm leading-6 sm:text-base sm:leading-7">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>

            <div class="site-note rounded-xl p-4 text-xs leading-6 sm:p-5 sm:text-sm">
              <strong class="text-accent">Good to know:</strong> astrology is a symbolic framework for self-reflection and timing awareness. Use this calculator for personal insight and education.
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section class="cv-section border-t border-line bg-elevated">
            <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">Related tools</p>
                  <h2 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Continue in {category.name.toLowerCase()}
                  </h2>
                </div>
                <a href={`/tools#${category.id}`} class="text-soft hover:text-accent text-xs font-semibold sm:text-sm">
                  View collection →
                </a>
              </div>
              <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <a href={`/tools/${item.slug}`} class="site-card group overflow-hidden rounded-2xl transition">
                    <div class="relative aspect-[16/10] overflow-hidden border-b border-line bg-media">
                      <img
                        src={toolImageSrc(item.slug)}
                        alt={item.name}
                        width="640"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      {item.featured && (
                        <span class="text-accent absolute right-3 top-3 rounded-md border border-amber-200/20 bg-page-glass px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                          Featured
                        </span>
                      )}
                    </div>
                    <div class="p-4 sm:p-5">
                      <h3 class="text-base font-bold tracking-tight text-ink group-hover:text-accent">{item.name}</h3>
                      <p class="text-soft mt-1.5 text-xs leading-5">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}
