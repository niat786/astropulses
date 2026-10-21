export function Footer() {
  return (
    <footer class="site-footer">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <a href="/" class="flex items-center" aria-label="AstroPulses home">
          <img
            src="/images/brand/wordmark-dark.webp"
            alt="AstroPulses"
            width="172"
            height="32"
            loading="lazy"
            decoding="async"
            class="h-8 w-auto"
          />
        </a>
        <nav class="flex flex-wrap gap-x-6 gap-y-3 text-xs" aria-label="Footer navigation">
          <a href="/tools">Tools</a>
          <a href="/blog">Journal</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/terms#disclaimer">Disclaimer</a>
        </nav>
        <p class="footer-meta text-xs">© 2026 AstroPulses</p>
      </div>
    </footer>
  )
}
