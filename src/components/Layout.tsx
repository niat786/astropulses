import type { Child } from 'hono/jsx'
import { Footer } from './Footer'
import { Header } from './Header'

type LayoutProps = {
  title: string
  description: string
  canonicalPath?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  active?: 'tools' | 'journal' | 'privacy'
  ctaHref?: string
  ctaLabel?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
  children?: Child
}

const SITE_URL = 'https://astropulses.com'

const themeBoot = `(function(){try{var k='astropulses-theme',s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export function Layout({
  title,
  description,
  canonicalPath = '/',
  ogImage = '/images/brand/og-default.png',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  active,
  ctaHref,
  ctaLabel,
  jsonLd,
  noindex = false,
  children,
}: LayoutProps) {
  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="NSwDJkJSFDpBXRNl8pquijOTrXJpDYu7GH1GNBM6SUw" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="robots"
          content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
        />
        {!noindex && <link rel="canonical" href={canonicalUrl} />}

        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/brand/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/brand/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/brand/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0B1020" />
        <meta name="apple-mobile-web-app-title" content="AstroPulses" />

        {/* Open Graph / Social Discovery */}
        <meta property="og:site_name" content="AstroPulses" />
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:locale" content="en_US" />
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

        {/* Twitter / X Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <link rel="stylesheet" href="/tailwind.css" />
        <link rel="stylesheet" href="/site.css" />
        <script src="/theme.js" defer />
        {schemas.map((schema) => (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
      </head>
      <body class="bg-page text-ink min-h-screen font-sans antialiased selection:bg-amber-300 selection:text-slate-950">
        <Header active={active} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
