type HeaderProps = {
  active?: 'home' | 'tools' | 'journal' | 'privacy'
  ctaHref?: string
  ctaLabel?: string
}

function ThemeToggle() {
  return (
    <button type="button" class="theme-toggle" data-theme-toggle="true" aria-label="Switch color theme">
      <svg class="icon-moon h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
      </svg>
      <svg class="icon-sun h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  )
}

export function Header({
  active = 'tools',
  ctaHref = '/tools/big-three-calculator',
  ctaLabel = 'Big Three',
}: HeaderProps) {
  return (
    <header class="full-navbar">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="/" class="flex shrink-0 items-center" aria-label="AstroPulses home">
          <img
            src="/images/brand/wordmark-dark.webp"
            alt="AstroPulses"
            width="150"
            height="28"
            fetchpriority="high"
            decoding="async"
            class="brand-logo-dark h-6 w-auto sm:h-7"
          />
          <img
            src="/images/brand/wordmark-light.webp"
            alt="AstroPulses"
            width="147"
            height="28"
            decoding="async"
            class="brand-logo-light h-6 w-auto sm:h-7"
          />
        </a>

        {/* Minimal Desktop Navigation */}
        <nav class="site-nav hidden items-center gap-7 text-sm font-medium md:flex" aria-label="Primary navigation">
          <a href="/tools" class={active === 'tools' ? 'is-active' : ''}>
            Tools
          </a>
          <a href="/#categories">Categories</a>
          <a href="/blog" class={active === 'journal' ? 'is-active' : ''}>
            Journal
          </a>
          <a href="/privacy" class={active === 'privacy' ? 'is-active' : ''}>
            Privacy
          </a>
        </nav>

        {/* Actions + Mobile Menu Button */}
        <div class="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a
            href={ctaHref}
            class="yellow-btn hidden rounded-lg px-3.5 py-2 text-xs font-semibold sm:inline-flex sm:items-center sm:gap-1.5"
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            data-mobile-menu-toggle="true"
            aria-expanded="false"
            aria-controls="mobile-nav-drawer"
            aria-label="Toggle navigation menu"
            class="theme-toggle mobile-menu-toggle"
          >
            <svg viewBox="0 0 24 24" class="icon-menu h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg viewBox="0 0 24 24" class="icon-close h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu */}
      <div id="mobile-nav-drawer" class="hidden border-t border-line bg-page px-4 py-3 md:hidden">
        <nav class="flex flex-col gap-1 text-sm font-medium" aria-label="Mobile navigation">
          <a href="/tools" class={`rounded-lg px-3 py-2 ${active === 'tools' ? 'bg-chip text-accent' : 'text-soft'}`}>
            All 189 Tools
          </a>
          <a href="/#categories" class="rounded-lg px-3 py-2 text-soft">
            Categories
          </a>
          <a href="/blog" class={`rounded-lg px-3 py-2 ${active === 'journal' ? 'bg-chip text-accent' : 'text-soft'}`}>
            Journal
          </a>
          <a href="/privacy" class={`rounded-lg px-3 py-2 ${active === 'privacy' ? 'bg-chip text-accent' : 'text-soft'}`}>
            Privacy
          </a>
          <a
            href={ctaHref}
            class="yellow-btn mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold"
          >
            {ctaLabel} →
          </a>
        </nav>
      </div>
    </header>
  )
}
