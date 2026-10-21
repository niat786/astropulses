import { blogAuthor, blogPostImageSrc, formatBlogDate, getRelatedBlogPosts, type BlogPost } from '../data/blog'
import { getTool, toolImageSrc } from '../data/tools'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { Layout } from './Layout'
import { RadixWheelSvg, SkyTelemetryStrip } from './ObservatoryVisuals'

export function BlogPostPage({ post, sky }: { post: BlogPost; sky: LiveSkySnapshot }) {
  const primaryTool = getTool(post.primaryToolSlug)
  const relatedToolsList = post.relatedToolSlugs
    .map((slug) => getTool(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  const relatedPosts = getRelatedBlogPosts(post.slug, 3)

  const articleJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.modifiedAt,
      author: {
        '@type': 'Organization',
        name: blogAuthor.name,
        url: blogAuthor.url,
      },
      publisher: {
        '@type': 'Organization',
        name: 'AstroPulses',
        url: 'https://astropulses.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://astropulses.com/images/brand/icon-512.png',
          width: 512,
          height: 512,
        },
      },
      image: `https://astropulses.com${blogPostImageSrc(post)}`,
      mainEntityOfPage: `https://astropulses.com/blog/${post.slug}`,
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
          name: 'Journal',
          item: 'https://astropulses.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.serpTitle,
          item: `https://astropulses.com/blog/${post.slug}`,
        },
      ],
    },
    ...(post.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
        ]
      : []),
  ]

  return (
    <Layout
      title={post.serpTitle}
      description={post.description}
      canonicalPath={`/blog/${post.slug}`}
      ogImage={blogPostImageSrc(post)}
      ogType="article"
      publishedTime={post.publishedAt}
      modifiedTime={post.modifiedAt}
      active="journal"
      ctaHref={primaryTool ? `/tools/${primaryTool.slug}` : '/tools/big-three-calculator'}
      ctaLabel={primaryTool ? 'Open Calculator' : 'Big Three'}
      jsonLd={articleJsonLd}
    >
      <main>
        {/* Top Breadcrumb + Compact Live Sky Strip */}
        <div class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 space-y-4">
          <nav aria-label="Breadcrumb" class="text-soft flex flex-wrap items-center gap-1.5 text-xs">
            <a href="/" class="hover:text-accent">
              Home
            </a>
            <span>/</span>
            <a href="/blog" class="hover:text-accent">
              Journal
            </a>
            <span>/</span>
            <span class="text-muted">{post.category}</span>
          </nav>

          <SkyTelemetryStrip sky={sky} compact />
        </div>

        <article class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Article Hero Header + Featured Visual Frame */}
          <header class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10 border-b border-line">
            <div class="lg:col-span-7 space-y-4">
              <div class="flex flex-wrap items-center gap-2">
                <a
                  href="/blog"
                  class="text-accent inline-flex items-center gap-1.5 rounded-full border border-line bg-chip px-3 py-1 text-xs font-semibold"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {post.category}
                </a>
                <span class="text-soft rounded-full border border-line px-3 py-1 text-xs font-mono">
                  {post.readingMinutes} min read
                </span>
                <span class="text-soft text-xs">
                  Published <time datetime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                  {post.modifiedAt !== post.publishedAt && (
                    <>
                      {' · '}Updated <time datetime={post.modifiedAt}>{formatBlogDate(post.modifiedAt)}</time>
                    </>
                  )}
                </span>
              </div>

              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-[1.1]">
                {post.title}
              </h1>

              <p class="text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                {post.subtitle}
              </p>

              <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div class="flex items-center gap-3">
                  <img
                    src="/images/brand/icon.webp"
                    alt=""
                    width="40"
                    height="40"
                    class="h-10 w-10 rounded-full border border-line bg-chip p-2"
                  />
                  <div>
                    <a href="/about" class="text-xs sm:text-sm font-bold text-ink hover:text-accent">
                      {blogAuthor.name}
                    </a>
                    <p class="text-[11px] text-soft">{blogAuthor.role}</p>
                  </div>
                </div>

                {primaryTool && (
                  <a
                    href={`/tools/${primaryTool.slug}`}
                    class="yellow-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 transition"
                  >
                    <span>Calculate: {primaryTool.name}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Hero Media Frame (Explicit 640x400 aspect-[16/10] for zero CLS) */}
            <div class="lg:col-span-5">
              <div class="overflow-hidden rounded-2xl border border-line bg-media shadow-xl">
                <div class="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={blogPostImageSrc(post)}
                    alt={post.title}
                    width="640"
                    height="400"
                    fetchpriority="high"
                    decoding="async"
                    class="h-full w-full object-cover"
                  />
                  {primaryTool && (
                    <a
                      href={`/tools/${primaryTool.slug}`}
                      class="absolute bottom-3 right-3 rounded-lg bg-slate-950/95 border border-white/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:underline"
                    >
                      Interactive Tool: {primaryTool.name} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Key Astronomical Takeaways Banner */}
          <div class="my-8 site-card rounded-2xl p-5 sm:p-6">
            <div class="flex items-center justify-between gap-2 mb-3">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Key Astronomical Takeaways
              </p>
              <span class="text-[11px] font-mono text-soft">Quick Summary</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              {post.keyTakeaways.map((item, idx) => (
                <div key={idx} class="rounded-xl border border-line bg-white/[0.02] p-4 text-xs sm:text-sm text-muted leading-relaxed">
                  <span class="text-accent font-bold block mb-1">Key Point 0{idx + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* 3-Column Editorial + Observatory Layout */}
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-4">
            {/* Left Sidebar: Sticky Table of Contents */}
            <aside class="lg:col-span-3 lg:sticky lg:top-20 space-y-5">
              <div class="site-card rounded-2xl p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  In This Guide
                </p>
                <nav aria-label="Table of contents" class="mt-3.5 flex flex-col gap-2 border-l border-line pl-3.5 text-xs sm:text-sm">
                  {post.sections.map((sec, idx) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      class="text-soft hover:text-accent transition py-0.5 leading-snug"
                    >
                      <span class="text-accent font-mono text-[11px] mr-1.5">0{idx + 1}.</span>
                      {sec.heading}
                    </a>
                  ))}
                  {post.faqs.length > 0 && (
                    <a href="#article-faq" class="text-soft hover:text-accent transition py-0.5 leading-snug">
                      <span class="text-accent font-mono text-[11px] mr-1.5">0{post.sections.length + 1}.</span>
                      Frequently Asked Questions
                    </a>
                  )}
                </nav>
              </div>

              <div class="site-card rounded-2xl p-5 hidden lg:block">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  More Journal Guides
                </p>
                <div class="mt-3 space-y-3">
                  {relatedPosts.map((rp) => (
                    <a
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      class="block rounded-xl border border-line bg-white/[0.02] hover:border-amber-300/35 p-3 transition group"
                    >
                      <span class="text-[10px] font-semibold uppercase tracking-wider text-accent">
                        {rp.category}
                      </span>
                      <p class="text-xs font-bold text-ink group-hover:text-accent mt-1 leading-snug">
                        {rp.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Center Column: Editorial Content */}
            <div class="lg:col-span-6 min-w-0 space-y-10">
              {/* Lead Paragraph */}
              <div class="site-card rounded-2xl p-6 sm:p-7 border-l-4 border-amber-300">
                <p class="text-base sm:text-lg font-medium leading-relaxed text-ink">
                  {post.lead}
                </p>
              </div>

              {/* Sections */}
              {post.sections.map((section, index) => {
                const sectionTool = section.toolSlug ? getTool(section.toolSlug) : undefined
                return (
                  <section key={section.id} id={section.id} class="scroll-mt-24 space-y-4">
                    <div class="flex items-center gap-2 text-xs font-mono text-accent">
                      <span>SECTION 0{index + 1}</span>
                      <span class="h-px flex-1 bg-line" />
                    </div>

                    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                      {section.heading}
                    </h2>

                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} class="text-muted text-sm sm:text-base leading-7 sm:leading-8">
                        {p}
                      </p>
                    ))}

                    {section.quote && (
                      <blockquote class="my-6 rounded-2xl border border-line bg-elevated p-5 sm:p-6">
                        <p class="text-base sm:text-lg font-semibold italic leading-relaxed text-ink">
                          “{section.quote}”
                        </p>
                      </blockquote>
                    )}

                    {section.callout && (
                      <div class="my-6 site-note rounded-2xl p-5 sm:p-6">
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          {section.callout.eyebrow}
                        </p>
                        <p class="mt-2 text-sm sm:text-base font-medium leading-relaxed text-ink">
                          {section.callout.text}
                        </p>
                      </div>
                    )}

                    {section.bullets && section.bullets.length > 0 && (
                      <ol class="mt-5 space-y-3">
                        {section.bullets.map((b, bIdx) => (
                          <li key={bIdx} class="site-card rounded-xl p-4 flex items-start gap-3.5">
                            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-300/15 border border-amber-300/30 text-xs font-bold text-accent">
                              {bIdx + 1}
                            </span>
                            <div class="min-w-0">
                              <p class="text-sm font-bold text-ink">{b.title}</p>
                              <p class="text-xs sm:text-sm text-muted mt-1 leading-relaxed">{b.body}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}

                    {section.comparisonTable && (
                      <div class="my-6 space-y-3">
                        <p class="text-xs sm:text-sm text-muted leading-relaxed">
                          {section.comparisonTable.intro}
                        </p>
                        <div class="overflow-x-auto rounded-2xl border border-line bg-elevated">
                          <table class="w-full text-left text-xs sm:text-sm">
                            <thead class="border-b border-line bg-chip text-soft uppercase tracking-wider text-[11px]">
                              <tr>
                                {section.comparisonTable.headers.map((h) => (
                                  <th class="px-4 py-3 font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-line">
                              {section.comparisonTable.rows.map((r) => (
                                <tr>
                                  <td class="px-4 py-3 font-bold text-ink">{r.item}</td>
                                  <td class="px-4 py-3 text-muted leading-relaxed">{r.whatItDoes}</td>
                                  <td class="px-4 py-3 text-soft leading-relaxed">{r.whatItCannotDo}</td>
                                  <td class="px-4 py-3 text-ink font-medium">{r.bestFor}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {sectionTool && (
                      <div class="mt-5 rounded-2xl border border-line bg-elevated p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="min-w-0">
                          <span class="text-[10px] font-semibold uppercase tracking-wider text-accent">
                            Interactive Server Calculator
                          </span>
                          <h3 class="text-base font-bold text-ink mt-0.5">{sectionTool.name}</h3>
                          <p class="text-xs text-soft mt-0.5">{sectionTool.description}</p>
                        </div>
                        <a
                          href={`/tools/${sectionTool.slug}`}
                          class="yellow-btn shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 transition"
                        >
                          <span>Run Tool</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    )}
                  </section>
                )
              })}

              {/* Article FAQ Section */}
              {post.faqs.length > 0 && (
                <section id="article-faq" class="scroll-mt-24 pt-6 border-t border-line space-y-5">
                  <div>
                    <span class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                      Common Questions
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div class="space-y-4">
                    {post.faqs.map((faq, idx) => (
                      <article key={idx} class="site-card rounded-2xl p-5 sm:p-6">
                        <h3 class="text-base sm:text-lg font-bold text-ink">{faq.question}</h3>
                        <p class="text-muted mt-2 text-xs sm:text-sm leading-6 sm:leading-7">{faq.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom CTA Banner */}
              {primaryTool && (
                <div class="site-form-panel rounded-2xl p-6 sm:p-8">
                  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Test It on Your Own Chart
                  </span>
                  <h3 class="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    Calculate Your {primaryTool.name}
                  </h3>
                  <p class="text-muted mt-2 text-sm sm:text-base leading-relaxed">
                    {primaryTool.description} Enter your birth date, time, and city for an instant server-calculated reading.
                  </p>
                  <div class="mt-5 flex flex-wrap items-center gap-3">
                    <a
                      href={`/tools/${primaryTool.slug}`}
                      class="yellow-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 transition"
                    >
                      <span>Open {primaryTool.name}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                    <a
                      href="/tools"
                      class="rounded-xl border border-line bg-surface px-4 py-3 text-xs sm:text-sm font-semibold text-ink hover:border-amber-300/35 transition"
                    >
                      Browse All 189 Calculators
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Live Calculator Quick-Launcher + Live Radix */}
            <aside class="lg:col-span-3 lg:sticky lg:top-20 space-y-5">
              {primaryTool && (
                <div class="site-form-panel rounded-2xl p-5">
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-accent block">
                    Instant Companion Tool
                  </span>
                  <h2 class="text-lg font-bold text-ink mt-1">{primaryTool.name}</h2>
                  <p class="text-xs text-muted mt-1 leading-relaxed">{primaryTool.description}</p>

                  <form method="post" action={`/tools/${primaryTool.slug}#result`} class="mt-4 space-y-3">
                    <div>
                      <label for="sidebar-birth-date" class="block text-[11px] font-semibold text-soft mb-1">
                        Birth Date
                      </label>
                      <input
                        id="sidebar-birth-date"
                        type="date"
                        name="date"
                        value="1995-06-15"
                        required
                        class="site-input w-full rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label for="sidebar-birth-time" class="block text-[11px] font-semibold text-soft mb-1">
                          Birth Time
                        </label>
                        <input
                          id="sidebar-birth-time"
                          type="time"
                          name="time"
                          value="14:30"
                          class="site-input w-full rounded-xl px-2.5 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label for="sidebar-birth-place" class="block text-[11px] font-semibold text-soft mb-1">
                          Birth City
                        </label>
                        <input
                          id="sidebar-birth-place"
                          type="text"
                          name="place"
                          value="New York, USA"
                          placeholder="City, Country"
                          class="site-input w-full rounded-xl px-2.5 py-2 text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      class="yellow-btn w-full rounded-xl py-2.5 text-xs font-bold text-slate-950 cursor-pointer transition"
                    >
                      Calculate Result →
                    </button>
                  </form>
                </div>
              )}

              {/* Live Sky Reference Wheel */}
              <div class="site-card rounded-2xl p-5">
                <div class="flex items-center justify-between mb-2.5">
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Live Sky Reference
                  </span>
                  <span class="text-[10px] font-mono text-soft">{sky.timestampReadable}</span>
                </div>
                <div class="relative mx-auto w-full max-w-[220px] aspect-square flex items-center justify-center rounded-2xl dark-observatory-stage p-2">
                  <RadixWheelSvg sky={sky} />
                </div>
                <div class="mt-3 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between text-soft">
                    <span>Sun</span>
                    <span class="font-mono text-ink">
                      {sky.planets.find((p) => p.name === 'Sun')?.sign} {sky.planets.find((p) => p.name === 'Sun')?.degreeFormatted}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-soft">
                    <span>Moon</span>
                    <span class="font-mono text-ink">
                      {sky.planets.find((p) => p.name === 'Moon')?.sign} {sky.planets.find((p) => p.name === 'Moon')?.degreeFormatted}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-soft">
                    <span>Lunar Phase</span>
                    <span class="font-mono text-accent">{sky.moonPhase}</span>
                  </div>
                </div>
              </div>

              {/* Related Calculators List */}
              <div class="site-card rounded-2xl p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Related Calculators
                </p>
                <div class="mt-3 space-y-2.5">
                  {relatedToolsList.map((tool) => (
                    <a
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      class="flex items-center justify-between gap-2 rounded-xl border border-line bg-white/[0.02] hover:border-amber-300/35 px-3 py-2.5 text-xs transition group"
                    >
                      <span class="font-semibold text-ink group-hover:text-accent truncate">
                        {tool.name}
                      </span>
                      <span class="text-accent shrink-0">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>

        {/* Continue Reading + Related Tools Section */}
        <section class="border-t border-line bg-elevated">
          <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-10">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">
                  Continue Exploring the Journal
                </p>
                <h2 class="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  Next Observatory Guides
                </h2>
              </div>
              <a href="/blog" class="text-xs sm:text-sm font-semibold text-accent hover:underline">
                View all journal guides →
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <a
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  class="site-card group rounded-2xl overflow-hidden flex flex-col justify-between transition hover:border-amber-300/35"
                >
                  <div>
                    <div class="relative aspect-[16/10] overflow-hidden border-b border-line bg-media">
                      <img
                        src={blogPostImageSrc(rp)}
                        alt={rp.title}
                        width="640"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <span class="absolute top-3 left-3 rounded-md bg-slate-950/85 text-amber-300 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        {rp.category}
                      </span>
                    </div>
                    <div class="p-5">
                      <p class="text-[11px] text-soft">
                        {formatBlogDate(rp.publishedAt)} · {rp.readingMinutes} min read
                      </p>
                      <h3 class="mt-1.5 text-base sm:text-lg font-bold tracking-tight text-ink group-hover:text-accent leading-snug">
                        {rp.title}
                      </h3>
                      <p class="text-muted mt-2 text-xs leading-relaxed line-clamp-2">
                        {rp.description}
                      </p>
                    </div>
                  </div>
                  <div class="px-5 pb-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                    <span class="font-semibold text-accent">Read article</span>
                    <span class="text-accent">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
