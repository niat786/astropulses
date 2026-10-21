import { blogAuthor, blogCategories, blogPostImageSrc, blogPosts, formatBlogDate, type BlogPost } from '../data/blog'
import { getTool, toolImageSrc } from '../data/tools'
import type { LiveSkySnapshot } from '../lib/astro/skyVisuals'
import { Layout } from './Layout'
import { LiveEphemerisCard, RadixWheelSvg, SkyTelemetryStrip } from './ObservatoryVisuals'

export function BlogIndexPage({ sky }: { sky: LiveSkySnapshot }) {
  const leadPost = blogPosts[0]
  const remainingPosts = blogPosts.slice(1)

  const featuredTools = [
    getTool('birth-chart-generator'),
    getTool('big-three-calculator'),
    getTool('zodiac-compatibility-calculator'),
    getTool('moon-phase-finder'),
    getTool('retrograde-calendar'),
    getTool('kundli-matching-guna-milan'),
  ].filter((t): t is NonNullable<typeof t> => Boolean(t))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The AstroPulses Observatory Journal',
    description:
      'Astronomical guides, birth chart methodology, planetary cycles, and Vedic & Hellenistic timing essays from astropulses.com.',
    url: 'https://astropulses.com/blog',
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Organization',
        name: blogAuthor.name,
        url: blogAuthor.url,
      },
      url: `https://astropulses.com/blog/${post.slug}`,
    })),
  }

  return (
    <Layout
      title="Astrology Blog: Easy Guides for Beginners [2026]"
      description="Simple astrology guides for everyone. Learn your birth chart, Moon sign, compatibility, Mercury retrograde, Moon phases, Kundli matching, and more."
      canonicalPath="/blog"
      active="journal"
      ctaHref="/tools/big-three-calculator"
      ctaLabel="Big Three"
      jsonLd={jsonLd}
    >
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        {/* Live Ephemeris Strip */}
        <SkyTelemetryStrip sky={sky} />

        {/* Journal Header & Search / Filter Bar */}
        <section class="border-b border-line pb-8">
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/20 text-amber-300 text-xs font-semibold">
                <span>✦</span>
                <span>The AstroPulses Observatory Journal · {blogPosts.length} Field Guides</span>
              </div>
              <h1 class="mt-3 max-w-3xl text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-[1.08]">
                Astrology guides, <span class="yellow-text">made simple.</span>
              </h1>
              <p class="text-muted mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
                Short, clear guides for every level. Learn to read your birth chart, check compatibility, use the Moon phases, and understand Vedic charts. Each guide links to a free calculator so you can test it on your own chart.
              </p>
            </div>

            <div class="relative w-full lg:w-80">
              <label for="blog-search" class="sr-only">
                Search journal articles
              </label>
              <input
                id="blog-search"
                type="search"
                placeholder="Search guides (e.g. Saturn, Big Three, Vedic)..."
                class="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-4 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-300"
              />
              <span id="blog-search-count" class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">
                {blogPosts.length}
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div class="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar" role="tablist" aria-label="Filter articles by topic">
            {blogCategories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                data-blog-cat={cat.id}
                class={
                  idx === 0
                    ? 'blog-cat-pill cat-pill active shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-amber-300 text-slate-950 cursor-pointer transition'
                    : 'blog-cat-pill cat-pill shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-soft hover:text-accent cursor-pointer transition'
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Lead Guide + Live Observatory Instrument */}
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <article
            data-blog-card
            data-category={leadPost.categorySlug}
            data-search={`${leadPost.title} ${leadPost.subtitle} ${leadPost.category}`.toLowerCase()}
            class="lg:col-span-8 site-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-300/35 transition"
          >
            <div>
              <a href={`/blog/${leadPost.slug}`} class="block relative aspect-[16/9] w-full overflow-hidden bg-media border-b border-line">
                <img
                  src={blogPostImageSrc(leadPost)}
                  alt={leadPost.title}
                  width="640"
                  height="400"
                  fetchpriority="high"
                  decoding="async"
                  class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                />
                <div class="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span class="rounded-md bg-slate-950/85 text-amber-300 border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                    Featured Guide · {leadPost.category}
                  </span>
                  <span class="rounded-md bg-slate-950/85 text-slate-200 border border-white/10 px-2.5 py-1 text-[10px] font-mono">
                    {leadPost.readingMinutes} min read
                  </span>
                </div>
              </a>

              <div class="p-6 sm:p-8">
                <div class="flex flex-wrap items-center gap-2 text-xs text-soft">
                  <span class="font-semibold text-ink">{blogAuthor.name}</span>
                  <span>·</span>
                  <time datetime={leadPost.publishedAt}>{formatBlogDate(leadPost.publishedAt)}</time>
                </div>

                <h2 class="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink group-hover:text-accent transition">
                  <a href={`/blog/${leadPost.slug}`}>{leadPost.title}</a>
                </h2>

                <p class="text-muted mt-3 text-sm sm:text-base leading-relaxed">
                  {leadPost.subtitle}
                </p>

                <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {leadPost.keyTakeaways.map((point, idx) => (
                    <div key={idx} class="rounded-xl border border-line bg-white/[0.02] p-3 text-xs text-soft leading-relaxed">
                      <span class="text-accent font-bold mr-1.5">0{idx + 1}.</span>
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div class="px-6 pb-6 sm:px-8 sm:pb-7 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <a
                href={`/blog/${leadPost.slug}`}
                class="yellow-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition"
              >
                <span>Read Full Guide</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={`/tools/${leadPost.primaryToolSlug}`}
                class="text-xs font-semibold text-accent hover:underline"
              >
                Launch companion calculator ({getTool(leadPost.primaryToolSlug)?.name}) →
              </a>
            </div>
          </article>

          {/* Right Column: Live Observatory Radix + Ephemeris */}
          <div class="lg:col-span-4 flex flex-col gap-6">
            <div class="site-card rounded-2xl p-5 flex flex-col justify-between flex-1">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
                    Live Reference Wheel
                  </span>
                  <h2 class="text-base font-bold text-ink">Current Ecliptic Geometry</h2>
                </div>
                <span class="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-md">
                  Real-Time
                </span>
              </div>

              <div class="relative mx-auto w-full max-w-[260px] aspect-square flex items-center justify-center rounded-2xl dark-observatory-stage p-2">
                <RadixWheelSvg sky={sky} />
              </div>

              <p class="text-xs text-soft mt-3 leading-relaxed">
                Every guide in the AstroPulses Journal links directly to live server ephemeris tools so you can test each astronomical concept on your own birth chart.
              </p>

              <a
                href="/tools/birth-chart-generator"
                class="mt-4 inline-flex items-center justify-between rounded-xl border border-line bg-white/[0.03] hover:border-amber-300/35 px-3.5 py-2.5 text-xs font-semibold text-ink transition"
              >
                <span>Cast Your Natal Radix Chart</span>
                <span class="text-accent">→</span>
              </a>
            </div>

            <LiveEphemerisCard sky={sky} />
          </div>
        </section>

        {/* All Journal Articles Grid */}
        <section aria-labelledby="all-guides-heading" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-accent">
                Reference Archive
              </span>
              <h2 id="all-guides-heading" class="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
                All Astrology Guides
              </h2>
            </div>
            <a href="/tools" class="text-xs sm:text-sm font-semibold text-accent hover:underline">
              Explore all 189 calculators →
            </a>
          </div>

          <div id="blog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((post: BlogPost) => {
              const primaryTool = getTool(post.primaryToolSlug)
              return (
                <article
                  key={post.slug}
                  data-blog-card
                  data-category={post.categorySlug}
                  data-search={`${post.title} ${post.subtitle} ${post.category} ${post.description}`.toLowerCase()}
                  class="site-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-300/35 transition"
                >
                  <div>
                    <a
                      href={`/blog/${post.slug}`}
                      class="block relative aspect-[16/10] w-full overflow-hidden bg-media border-b border-line"
                    >
                      <img
                        src={blogPostImageSrc(post)}
                        alt={post.title}
                        width="640"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                      />
                      <span class="absolute top-3 left-3 rounded-md bg-slate-950/85 text-amber-300 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span class="absolute top-3 right-3 rounded-md bg-slate-950/85 text-slate-200 border border-white/10 px-2 py-0.5 text-[10px] font-mono">
                        {post.readingMinutes} min
                      </span>
                    </a>

                    <div class="p-5">
                      <div class="flex items-center gap-2 text-[11px] text-soft">
                        <time datetime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                        <span>·</span>
                        <span>{post.category}</span>
                      </div>

                      <h3 class="mt-2 text-lg font-bold tracking-tight text-ink group-hover:text-accent transition leading-snug">
                        <a href={`/blog/${post.slug}`}>{post.title}</a>
                      </h3>

                      <p class="text-muted mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  <div class="px-5 pb-5 pt-3 border-t border-line flex items-center justify-between gap-2 text-xs">
                    <a
                      href={`/blog/${post.slug}`}
                      class="font-bold text-accent group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read guide</span>
                      <span aria-hidden="true">→</span>
                    </a>
                    {primaryTool && (
                      <a
                        href={`/tools/${primaryTool.slug}`}
                        class="text-[11px] text-soft hover:text-accent truncate max-w-[180px]"
                        title={`Open ${primaryTool.name}`}
                      >
                        Tool: {primaryTool.name}
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Interactive Companion Calculators Strip */}
        <section class="site-card rounded-2xl p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-accent">
                Calculate While You Read
              </span>
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
                Companion Calculators Featured in These Guides
              </h2>
            </div>
            <a href="/tools" class="text-xs font-semibold text-accent hover:underline">
              Browse all 189 tools →
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <a
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                class="flex items-center gap-3.5 rounded-xl border border-line bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-300/35 p-3 transition group"
              >
                <div class="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-media">
                  <img
                    src={toolImageSrc(tool.slug)}
                    alt={tool.name}
                    width="160"
                    height="100"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="text-sm font-bold text-ink group-hover:text-accent truncate">
                    {tool.name}
                  </h3>
                  <p class="text-[11px] text-soft truncate mt-0.5">{tool.description}</p>
                </div>
                <span class="text-xs text-accent shrink-0">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* Lightweight Instant Filter Script for Journal Search & Category Pills */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var search = document.getElementById('blog-search');
  var countEl = document.getElementById('blog-search-count');
  var pills = Array.prototype.slice.call(document.querySelectorAll('[data-blog-cat]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#blog-grid [data-blog-card]'));
  var activeCat = 'all';

  function applyFilter() {
    var q = (search && search.value ? search.value : '').toLowerCase().trim();
    var visible = 0;
    cards.forEach(function(card) {
      var cat = card.getAttribute('data-category') || '';
      var text = card.getAttribute('data-search') || '';
      var matchCat = activeCat === 'all' || cat === activeCat;
      var matchQ = !q || text.indexOf(q) !== -1;
      if (matchCat && matchQ) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    if (countEl) countEl.textContent = String(visible);
  }

  if (search) search.addEventListener('input', applyFilter);
  pills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      activeCat = pill.getAttribute('data-blog-cat') || 'all';
      pills.forEach(function(p) {
        var isCurrent = p === pill;
        p.classList.toggle('active', isCurrent);
        p.classList.toggle('bg-amber-300', isCurrent);
        p.classList.toggle('text-slate-950', isCurrent);
        p.classList.toggle('font-semibold', isCurrent);
        p.classList.toggle('border', !isCurrent);
        p.classList.toggle('border-line', !isCurrent);
        p.classList.toggle('bg-surface', !isCurrent);
        p.classList.toggle('text-soft', !isCurrent);
      });
      applyFilter();
    });
  });
})();`,
          }}
        />
      </main>
    </Layout>
  )
}
