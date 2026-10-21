import type { Child } from 'hono/jsx'
import { Layout } from './Layout'

export type InfoSection = {
  id: string
  heading: string
  body: Child
}

type InfoPageProps = {
  eyebrow: string
  title: string
  intro: string
  updated?: string
  serpTitle: string
  description: string
  path: string
  active?: 'privacy'
  summary?: { heading: string; text: string }
  sections: InfoSection[]
  jsonLd?: Record<string, unknown>
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  updated,
  serpTitle,
  description,
  path,
  active,
  summary,
  sections,
  jsonLd,
}: InfoPageProps) {
  return (
    <Layout title={serpTitle} description={description} canonicalPath={path} active={active} jsonLd={jsonLd}>
      <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div class="grid gap-10 lg:grid-cols-[230px_minmax(0,720px)] lg:gap-16">
          <aside>
            <div class="lg:sticky lg:top-24">
              <p class="text-accent text-xs font-semibold uppercase tracking-[0.18em]">{eyebrow}</p>
              <h1 class="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
              {updated && <p class="text-soft mt-3 text-sm">Last updated {updated}</p>}
              {sections.length > 2 && (
                <nav aria-label="On this page" class="mt-8 hidden gap-2.5 border-l border-line pl-4 text-sm lg:grid">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} class="text-soft hover:text-accent transition">
                      {s.heading}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </aside>

          <article class="text-muted text-base leading-8">
            <p class="text-lg leading-8 text-ink">{intro}</p>

            {summary && (
              <div class="site-card mt-8 rounded-2xl border-l-4 border-amber-300 p-6">
                <h2 class="text-lg font-bold text-ink">{summary.heading}</h2>
                <p class="mt-2 text-sm leading-7">{summary.text}</p>
              </div>
            )}

            {sections.map((s) => (
              <section key={s.id} id={s.id} class="info-prose scroll-mt-24">
                <h2 class="mt-12 text-2xl font-bold tracking-tight text-ink">{s.heading}</h2>
                <div class="mt-4 space-y-4">{s.body}</div>
              </section>
            ))}
          </article>
        </div>
      </main>
    </Layout>
  )
}
