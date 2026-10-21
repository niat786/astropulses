import { Hono, type Context } from 'hono'
import type { HtmlEscapedString } from 'hono/utils/html'
import { BlogIndexPage } from './components/BlogIndexPage'
import { BlogPostPage } from './components/BlogPostPage'
import { HomePage } from './components/HomePage'
import { AboutPage, ContactPage, NotFoundPage, PrivacyPage, TermsPage } from './components/SitePages'
import { ToolPage } from './components/ToolPage'
import { ToolsIndexPage } from './components/ToolsIndexPage'
import { blogPosts, getBlogPost } from './data/blog'
import { getCategory, getTool, tools } from './data/tools'
import { parseToolForm } from './lib/astro/parseInput'
import { buildLiveSkySnapshot } from './lib/astro/skyVisuals'
import { runToolCalculation } from './lib/calc/runTool'
import { errorResult } from './lib/calc/types'
import {
  checkRateLimit,
  createCalculationSeal,
  generateCalculationToken,
  hasSecuritySecret,
  isBlockedScraperUserAgent,
  setSecuritySecret,
  verifyCalculationToken,
} from './lib/security'

type Bindings = { HMAC_SECRET?: string }

const app = new Hono<{ Bindings: Bindings }>()

// Anti-theft, anti-scraping, and security headers middleware
app.use('*', async (c, next) => {
  const ua = c.req.header('user-agent')
  if (isBlockedScraperUserAgent(ua)) {
    return c.text('Automated site cloning and bulk scraping are prohibited on AstroPulses.', 403)
  }

  setSecuritySecret(c.env?.HMAC_SECRET)
  if (!hasSecuritySecret() && c.req.path.startsWith('/tools/')) {
    console.error('HMAC_SECRET is missing. Run `wrangler secret put HMAC_SECRET` (or add it to .dev.vars locally).')
    return c.text('Calculators are temporarily unavailable. Please try again shortly.', 503)
  }

  await next()

  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  c.header('X-AstroPulses-Engine', 'Server-Side-Ephemeris-Protected')
})

function renderDocument(c: Context, node: HtmlEscapedString | Promise<HtmlEscapedString>, status = 200) {
  return Promise.resolve(node).then((str) => c.html(`<!DOCTYPE html>${str}`, status as 200))
}

app.get('/', (c) => {
  const sky = buildLiveSkySnapshot()
  return renderDocument(c, <HomePage sky={sky} />)
})

app.get('/api/sky', (c) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local'
  if (!checkRateLimit(`sky:${ip}`)) {
    return c.json({ error: 'Rate limit exceeded.' }, 429)
  }
  const rawDate = c.req.query('date')
  const offsetMinutes = Number(c.req.query('offsetMinutes') || 0)
  let targetDate = rawDate ? new Date(rawDate) : new Date()
  if (Number.isNaN(targetDate.getTime())) targetDate = new Date()
  if (offsetMinutes && Number.isFinite(offsetMinutes)) {
    targetDate = new Date(targetDate.getTime() + offsetMinutes * 60_000)
  }
  return c.json(buildLiveSkySnapshot(targetDate))
})

app.get('/images/tools/:filename', (c) => {
  const filename = c.req.param('filename')
  if (!filename.endsWith('.svg') && !filename.endsWith('.webp')) return c.notFound()
  const slug = filename.replace(/\.(svg|webp)$/, '')
  const tool = getTool(slug)
  const category = tool ? getCategory(tool.categoryId) : undefined
  const label = (tool?.name || slug.replace(/-/g, ' ')).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const categoryLabel = (category?.name || 'AstroPulses Calculator').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#151827"/>
      <stop offset="55%" stop-color="#0f1322"/>
      <stop offset="100%" stop-color="#090c15"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="#f5d76e" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f5d76e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <rect width="640" height="400" fill="url(#glow)"/>
  <rect x="24" y="24" width="592" height="352" rx="24" fill="none" stroke="#f5d76e" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="8 10"/>
  <circle cx="320" cy="148" r="56" fill="none" stroke="#f5d76e" stroke-opacity="0.18" stroke-width="1" stroke-dasharray="3 5"/>
  <circle cx="320" cy="148" r="38" fill="#f5d76e" fill-opacity="0.1" stroke="#f5d76e" stroke-opacity="0.45" stroke-width="1.5"/>
  <text x="320" y="157" text-anchor="middle" fill="#f5d76e" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="26" font-weight="600">✦</text>
  <text x="320" y="226" text-anchor="middle" fill="#f5d76e" fill-opacity="0.85" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.5">${categoryLabel.toUpperCase()}</text>
  <text x="320" y="256" text-anchor="middle" fill="#f5f0e8" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="20" font-weight="700">${label}</text>
  <text x="320" y="286" text-anchor="middle" fill="#94a3b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12">${slug}.webp</text>
</svg>`
  return c.body(svg, 200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

app.get('/blog', (c) => {
  const sky = buildLiveSkySnapshot()
  return renderDocument(c, <BlogIndexPage sky={sky} />)
})

app.get('/blog/:slug', (c) => {
  const slug = c.req.param('slug')
  const post = getBlogPost(slug)
  if (!post) return c.notFound()
  const sky = buildLiveSkySnapshot()
  return renderDocument(c, <BlogPostPage post={post} sky={sky} />)
})

app.get('/privacy', (c) => renderDocument(c, <PrivacyPage />))
app.get('/terms', (c) => renderDocument(c, <TermsPage />))
app.get('/about', (c) => renderDocument(c, <AboutPage />))
app.get('/contact', (c) => renderDocument(c, <ContactPage />))

app.get('/robots.txt', (c) => {
  const txt = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Allow AI Answer & Citation Engines (GEO Optimization)',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    'User-agent: ChatGPT-User',
    'Allow: /',
    'User-agent: PerplexityBot',
    'Allow: /',
    'User-agent: ClaudeBot',
    'Allow: /',
    'User-agent: Google-Extended',
    'Allow: /',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    '# Block Offline Site-Rippers & Cloning Bots',
    'User-agent: HTTrack',
    'Disallow: /',
    'User-agent: SiteSucker',
    'Disallow: /',
    'User-agent: WebZip',
    'Disallow: /',
    'User-agent: WebCopier',
    'Disallow: /',
    '',
    'Sitemap: https://astropulses.com/sitemap.xml',
  ].join('\n')
  return c.body(txt, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

app.get('/llms.txt', (c) => {
  const featured = tools.filter((t) => t.featured).slice(0, 25)
  const lines = [
    '# AstroPulses (astropulses.com)',
    '',
    '> AstroPulses is a precision astronomical and astrological calculation platform offering 189 free, server-calculated tools across Western Tropical, Vedic Sidereal (Lahiri Chitrapaksha), Hellenistic, Relationship Synastry, and Astrocartography traditions.',
    '',
    '## Core Ephemeris & Methodology',
    '- **Planetary Engine**: Server-side VSOP87 & J2000 orbital ephemeris (sub-arcminute precision).',
    '- **Sidereal Standard**: Lahiri Chitrapaksha Ayanamsha (~24°13′ offset in 2026), plus Raman, KP, and Fagan-Bradley comparison.',
    '- **House Systems**: Whole Sign and Equal House cusps anchored to exact geocoded birth city coordinates and historical IANA time zones.',
    '- **Verification**: Every calculated report includes a cryptographic server verification seal (`AP-XXXXXXXXXX`).',
    '',
    '## Key Entry Points',
    '- Homepage & Live Ephemeris Wheel: https://astropulses.com/',
    '- All 189 Calculators Directory: https://astropulses.com/tools',
    '- Observatory Journal (Field Guides): https://astropulses.com/blog',
    '- About & Methodology: https://astropulses.com/about',
    '- Full XML Sitemap: https://astropulses.com/sitemap.xml',
    '',
    '## Observatory Journal Field Guides',
    ...blogPosts.map(
      (p) => `- [${p.serpTitle}](https://astropulses.com/blog/${p.slug}): ${p.description}`,
    ),
    '',
    '## Flagship Calculators (Sample of 189 Tools)',
    ...featured.map(
      (t) => `- [${t.name}](https://astropulses.com/tools/${t.slug}): ${t.description}`,
    ),
  ]
  return c.body(lines.join('\n'), 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

app.get('/sitemap.xml', (c) => {
  const lastmod = '2026-10-21'
  const staticUrls = [
    { loc: 'https://astropulses.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://astropulses.com/tools', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://astropulses.com/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://astropulses.com/about', priority: '0.5', changefreq: 'monthly' },
    { loc: 'https://astropulses.com/contact', priority: '0.4', changefreq: 'yearly' },
    { loc: 'https://astropulses.com/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: 'https://astropulses.com/terms', priority: '0.3', changefreq: 'yearly' },
  ]
  const blogUrls = blogPosts.map((p) => ({
    loc: `https://astropulses.com/blog/${p.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: p.modifiedAt || lastmod,
  }))
  const toolUrls = tools.map((t) => ({
    loc: `https://astropulses.com/tools/${t.slug}`,
    priority: t.featured ? '0.8' : '0.7',
    changefreq: 'weekly',
    lastmod,
  }))

  const all = [...staticUrls.map((u) => ({ ...u, lastmod })), ...blogUrls, ...toolUrls]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return c.body(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})

app.get('/tools', (c) => {
  const sky = buildLiveSkySnapshot()
  return renderDocument(c, <ToolsIndexPage sky={sky} />)
})

app.get('/tools/:slug', async (c) => {
  const slug = c.req.param('slug')
  const tool = getTool(slug)
  if (!tool) return c.notFound()
  const category = getCategory(tool.categoryId)
  if (!category) return c.notFound()
  const sky = buildLiveSkySnapshot()
  const securityToken = await generateCalculationToken(slug)

  // Support 1-click Instant Sample calculation (?sample=1)
  if (c.req.query('sample') === '1') {
    const sampleForm = new FormData()
    sampleForm.set('name', 'Maya')
    sampleForm.set('birth-month', 'September')
    sampleForm.set('birth-day', '18')
    sampleForm.set('birth-year', '1992')
    sampleForm.set('birth-hour', '08')
    sampleForm.set('birth-minute', '42')
    sampleForm.set('birth-period', 'AM')
    sampleForm.set('place', 'London, UK')
    sampleForm.set('partner-name', 'Liam')
    sampleForm.set('partner-month', 'March')
    sampleForm.set('partner-day', '24')
    sampleForm.set('partner-year', '1990')
    sampleForm.set('partner-hour', '02')
    sampleForm.set('partner-minute', '15')
    sampleForm.set('partner-period', 'PM')
    sampleForm.set('partner-place', 'New York, USA')

    const needsPartner = tool.fields.some((f) => f.startsWith('partner'))
    const parsed = parseToolForm(sampleForm, needsPartner)
    if (!('error' in parsed)) {
      const result = await runToolCalculation(tool, parsed)
      result.verificationSeal = await createCalculationSeal(slug, result.summary)
      result.computedAtUtc = new Date().toISOString()
      return renderDocument(
        c,
        <ToolPage
          tool={tool}
          category={category}
          sky={sky}
          result={result}
          formValues={parsed.values}
          securityToken={securityToken}
        />,
      )
    }
  }

  return renderDocument(c, <ToolPage tool={tool} category={category} sky={sky} securityToken={securityToken} />)
})

app.post('/tools/:slug', async (c) => {
  const slug = c.req.param('slug')
  const tool = getTool(slug)
  if (!tool) return c.notFound()
  const category = getCategory(tool.categoryId)
  if (!category) return c.notFound()
  const sky = buildLiveSkySnapshot()
  const securityToken = await generateCalculationToken(slug)

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local'
  if (!checkRateLimit(`calc:${ip}`)) {
    return renderDocument(
      c,
      <ToolPage
        tool={tool}
        category={category}
        sky={sky}
        result={errorResult('Too many calculations in a short window. Please wait a moment and try again.')}
        securityToken={securityToken}
      />,
      429,
    )
  }

  const form = await c.req.formData()

  // Anti-bot honeypot check
  const hp = form.get('_hp')
  if (typeof hp === 'string' && hp.trim().length > 0) {
    return c.text('Invalid automated submission.', 403)
  }

  // Verify HMAC token if submitted from tool page (allow quick-launch forms from Home/Blog when same-origin)
  const submittedToken = form.get('_token')
  const origin = c.req.header('origin') || ''
  const referer = c.req.header('referer') || ''
  if (typeof submittedToken === 'string' && submittedToken.length > 0) {
    const valid = await verifyCalculationToken(slug, submittedToken)
    if (!valid) {
      return renderDocument(
        c,
        <ToolPage
          tool={tool}
          category={category}
          sky={sky}
          result={errorResult('Your calculation session expired. Please click Run again to refresh your result.')}
          securityToken={securityToken}
        />,
      )
    }
  } else if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('astropulses.com') && !referer.includes('astropulses.com')) {
    return c.text('Cross-origin calculation hijacking is blocked.', 403)
  }

  const needsPartner = tool.fields.some((f) => f.startsWith('partner'))
  const parsed = parseToolForm(form, needsPartner)

  if ('error' in parsed) {
    return renderDocument(
      c,
      <ToolPage
        tool={tool}
        category={category}
        sky={sky}
        result={errorResult(parsed.error)}
        formValues={Object.fromEntries(
          [...form.entries()].filter(([, v]) => typeof v === 'string') as [string, string][],
        )}
        securityToken={securityToken}
      />,
    )
  }

  const result = await runToolCalculation(tool, parsed)
  if (!result.error) {
    result.verificationSeal = await createCalculationSeal(slug, result.summary)
    result.computedAtUtc = new Date().toISOString()
  }

  return renderDocument(
    c,
    <ToolPage
      tool={tool}
      category={category}
      sky={sky}
      result={result}
      formValues={parsed.values}
      securityToken={securityToken}
    />,
  )
})

app.get('/tool', (c) => c.redirect('/tools/big-three-calculator', 301))
app.get('/tool.html', (c) => c.redirect('/tools/big-three-calculator', 301))
app.get('/index.html', (c) => c.redirect('/', 301))
app.get('/blog.html', (c) => c.redirect('/blog', 301))
app.get('/privacy.html', (c) => c.redirect('/privacy', 301))

app.notFound((c) => renderDocument(c, <NotFoundPage />, 404))

export default app
