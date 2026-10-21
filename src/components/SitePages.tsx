import { InfoPage } from './InfoPage'
import { Layout } from './Layout'

export const CONTACT_EMAIL = 'hello@astropulses.com'
export const PRIVACY_EMAIL = 'privacy@astropulses.com'
const LAST_UPDATED = 'October 21, 2026'

const mail = (address: string) => (
  <a href={`mailto:${address}`} class="text-accent font-semibold underline underline-offset-4">
    {address}
  </a>
)

export function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title="About AstroPulses"
      intro="AstroPulses is a free astrology website with 189 calculators and plain-English guides. Every result is worked out from real planetary positions for your exact birth minute and place."
      serpTitle="About AstroPulses: Free, Accurate Astrology Tools"
      description="AstroPulses offers 189 free astrology calculators built on real astronomy. Learn how our charts are calculated, how we write our guides, and what we stand for."
      path="/about"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About AstroPulses',
        url: 'https://astropulses.com/about',
        mainEntity: {
          '@type': 'Organization',
          name: 'AstroPulses',
          url: 'https://astropulses.com',
          logo: 'https://astropulses.com/images/brand/icon-512.png',
          email: CONTACT_EMAIL,
        },
      }}
      sections={[
        {
          id: 'why',
          heading: 'Why we built it',
          body: (
            <>
              <p>
                Most free astrology sites stop at your Sun sign. Others hide the useful parts behind a sign-up wall.
                We wanted one place where anyone could get a real chart, read it in simple words, and never pay or
                register to do it.
              </p>
              <p>So every tool on AstroPulses is free, needs no account, and shows its working.</p>
            </>
          ),
        },
        {
          id: 'how',
          heading: 'How the calculations work',
          body: (
            <>
              <p>
                Each calculator runs on our server, not in your browser. We use the open-source{' '}
                <a href="https://github.com/cosinekitty/astronomy" class="text-accent underline underline-offset-4" rel="noopener">
                  Astronomy Engine
                </a>{' '}
                library, which is based on the VSOP87 planetary model used by astronomers.
              </p>
              <ul class="list-disc space-y-2 pl-6">
                <li>Western charts use the tropical zodiac.</li>
                <li>Vedic charts use the sidereal zodiac with the Lahiri ayanamsha.</li>
                <li>Houses use the Whole Sign system unless a tool says otherwise.</li>
                <li>Your birth city is converted to coordinates and its historical time zone before any math runs.</li>
              </ul>
              <p>
                Every tool page also lists its limits. For example, a Rising sign needs an exact birth time, because
                it moves about 1° every 4 minutes.
              </p>
            </>
          ),
        },
        {
          id: 'editorial',
          heading: 'How we write our guides',
          body: (
            <>
              <p>
                Our guides are written by the AstroPulses editorial team. We keep sentences short, explain every term,
                and check every astronomical number (orbit lengths, degrees, dates) against live ephemeris data before
                publishing.
              </p>
              <p>
                When we update a guide, we show the new date at the top. If you spot a mistake, please tell us at{' '}
                {mail(CONTACT_EMAIL)}. We fix errors fast.
              </p>
            </>
          ),
        },
        {
          id: 'principles',
          heading: 'What we stand for',
          body: (
            <ul class="list-disc space-y-2 pl-6">
              <li>
                <strong class="text-ink">Free and open.</strong> No sign-up, no paywall.
              </li>
              <li>
                <strong class="text-ink">Private by default.</strong> We don’t store your birth details. See our{' '}
                <a href="/privacy" class="text-accent underline underline-offset-4">
                  Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong class="text-ink">Honest about limits.</strong> Astrology is a tool for reflection, not a
                replacement for medical, legal, or financial advice.
              </li>
            </ul>
          ),
        },
      ]}
    />
  )
}

export function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact us"
      intro="Have a question, found a bug, or want to suggest a new calculator? We read every message."
      serpTitle="Contact AstroPulses"
      description="Get in touch with AstroPulses. Email us with questions about our astrology calculators, report a bug, suggest a tool, or send a privacy request."
      path="/contact"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact AstroPulses',
        url: 'https://astropulses.com/contact',
      }}
      sections={[
        {
          id: 'email',
          heading: 'Email',
          body: (
            <>
              <p>General questions, feedback, and bug reports: {mail(CONTACT_EMAIL)}</p>
              <p>Privacy questions and data requests: {mail(PRIVACY_EMAIL)}</p>
            </>
          ),
        },
        {
          id: 'bugs',
          heading: 'Reporting a calculation problem',
          body: (
            <>
              <p>To help us fix it fast, please include:</p>
              <ul class="list-disc space-y-2 pl-6">
                <li>The name of the tool you used.</li>
                <li>The birth date, time, and city you entered.</li>
                <li>
                  The verification seal shown under your result (it starts with <code>AP-</code>).
                </li>
                <li>What you expected to see instead.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'readings',
          heading: 'Personal readings',
          body: (
            <p>
              We don’t offer paid or personal readings. Every tool on the site is free, and our{' '}
              <a href="/blog" class="text-accent underline underline-offset-4">
                guides
              </a>{' '}
              explain how to read your own results.
            </p>
          ),
        },
      ]}
    />
  )
}

export function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated={LAST_UPDATED}
      intro="This policy explains, in plain English, what happens to your information when you use astropulses.com."
      serpTitle="Privacy Policy | AstroPulses"
      description="How AstroPulses handles your data: birth details are used once to calculate your chart and never stored. No accounts, no cookies, no ads, and no tracking."
      path="/privacy"
      active="privacy"
      summary={{
        heading: 'The short version',
        text: 'We use your birth details once to calculate your result, then we forget them. We have no accounts, set no cookies, show no ads, and use no tracking tools.',
      }}
      sections={[
        {
          id: 'enter',
          heading: 'Information you enter',
          body: (
            <>
              <p>
                When you run a calculator, you may enter a birth date, birth time, birth city, and an optional name. Some
                relationship tools also ask for a partner’s details.
              </p>
              <p>
                This information is sent to our server over an encrypted (HTTPS) connection. We use it to calculate your
                result and send the result back to you. We do not save it to a database, and we do not build a profile of
                you.
              </p>
            </>
          ),
        },
        {
          id: 'city-lookup',
          heading: 'City lookups',
          body: (
            <p>
              Most cities are matched against our built-in list. If yours isn’t on it, our server sends only the city
              name you typed to the{' '}
              <a href="https://open-meteo.com/en/docs/geocoding-api" class="text-accent underline underline-offset-4" rel="noopener">
                Open-Meteo geocoding service
              </a>{' '}
              to find its coordinates. Your name, birth date, and birth time are never sent.
            </p>
          ),
        },
        {
          id: 'automatic',
          heading: 'Information collected automatically',
          body: (
            <>
              <p>Like any website, some technical data is processed so pages can load and stay secure:</p>
              <ul class="list-disc space-y-2 pl-6">
                <li>
                  <strong class="text-ink">Hosting.</strong> Our site runs on Cloudflare, which processes your IP address,
                  browser type, and the page you request in order to deliver it and block attacks.
                </li>
                <li>
                  <strong class="text-ink">Abuse protection.</strong> We briefly count requests per IP address in memory to
                  stop automated scraping. These counts reset within a minute and are not stored.
                </li>
                <li>
                  <strong class="text-ink">Fonts.</strong> Our fonts load from Google Fonts, so your browser connects to
                  Google’s servers, which receive your IP address.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'storage',
          heading: 'Cookies and browser storage',
          body: (
            <p>
              We don’t use cookies. The only thing we save on your device is your light or dark theme choice, kept in
              your browser’s local storage under the name <code>astropulses-theme</code>. You can clear it at any time
              in your browser settings.
            </p>
          ),
        },
        {
          id: 'not-do',
          heading: 'What we don’t do',
          body: (
            <ul class="list-disc space-y-2 pl-6">
              <li>We don’t sell or rent personal information.</li>
              <li>We don’t show ads or use advertising trackers.</li>
              <li>We don’t use analytics cookies or tracking pixels.</li>
            </ul>
          ),
        },
        {
          id: 'children',
          heading: 'Children',
          body: (
            <p>
              AstroPulses is not aimed at children under 13, and we don’t knowingly collect information from them.
            </p>
          ),
        },
        {
          id: 'rights',
          heading: 'Your choices and rights',
          body: (
            <p>
              Because we don’t store your birth details, there is usually nothing for us to delete. If you have any
              privacy question or request, email {mail(PRIVACY_EMAIL)} and we’ll respond within 30 days.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes to this policy',
          body: (
            <p>
              If we add new features, such as saved charts or analytics, we’ll update this page first and change the
              date at the top.
            </p>
          ),
        },
      ]}
    />
  )
}

export function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Use"
      updated={LAST_UPDATED}
      intro="These terms explain the rules for using astropulses.com. By using the site, you agree to them."
      serpTitle="Terms of Use & Disclaimer | AstroPulses"
      description="The terms for using AstroPulses astrology calculators and guides, including our astrology disclaimer, fair-use rules, and the limits of our results."
      path="/terms"
      sections={[
        {
          id: 'service',
          heading: 'What we provide',
          body: (
            <p>
              AstroPulses offers free astrology calculators and educational guides. You can use them for personal,
              non-commercial purposes without creating an account.
            </p>
          ),
        },
        {
          id: 'disclaimer',
          heading: 'Astrology disclaimer',
          body: (
            <>
              <p>
                Astrology is a symbolic and cultural practice. It is not a science, and it can’t predict events. Our
                results and articles are for reflection, education, and entertainment.
              </p>
              <p>
                Nothing on this site is medical, mental health, legal, financial, or other professional advice. Please
                don’t make important life decisions based only on an astrology result.
              </p>
            </>
          ),
        },
        {
          id: 'accuracy',
          heading: 'Accuracy of results',
          body: (
            <p>
              We calculate planetary positions with an established astronomy library and test our tools carefully.
              However, results depend on the details you enter. A wrong birth time or city can change your Rising sign,
              houses, and Moon degree. We provide the tools “as is” and can’t guarantee they are free of errors.
            </p>
          ),
        },
        {
          id: 'fair-use',
          heading: 'Fair use',
          body: (
            <>
              <p>To keep the site fast and free for everyone, you agree not to:</p>
              <ul class="list-disc space-y-2 pl-6">
                <li>Scrape, copy, or mirror the site or its results in bulk.</li>
                <li>Use bots or scripts to run large numbers of calculations.</li>
                <li>Try to break, overload, or get around our security measures.</li>
                <li>Resell our tools or results as your own service.</li>
              </ul>
              <p>We may block access for anyone who breaks these rules.</p>
            </>
          ),
        },
        {
          id: 'content',
          heading: 'Our content',
          body: (
            <p>
              The original text, design, and images on AstroPulses belong to us. You may share links to any page and quote
              short passages with credit. Please ask before reusing anything else.
            </p>
          ),
        },
        {
          id: 'liability',
          heading: 'Limitation of liability',
          body: (
            <p>
              To the fullest extent allowed by law, AstroPulses is not responsible for any loss or damage that results
              from using, or relying on, the site or its results.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes and contact',
          body: (
            <p>
              We may update these terms from time to time and will change the date at the top when we do. Questions?
              Email {mail(CONTACT_EMAIL)}.
            </p>
          ),
        },
      ]}
    />
  )
}

export function NotFoundPage() {
  return (
    <Layout
      title="Page Not Found | AstroPulses"
      description="This page isn’t in the sky chart. Browse all 189 free astrology calculators or head back to the AstroPulses home page."
      noindex
    >
      <main class="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 py-20 text-center">
        <div class="space-y-4">
          <p class="text-accent text-xs font-semibold uppercase tracking-[0.16em]">404</p>
          <h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">That page isn’t in the sky chart</h1>
          <p class="text-muted text-sm sm:text-base">
            The link may be old or mistyped. Try one of these instead.
          </p>
          <div class="flex flex-wrap justify-center gap-3 pt-2">
            <a href="/" class="rounded-lg border border-line bg-chip px-4 py-2.5 text-xs font-semibold text-ink">
              Home
            </a>
            <a href="/tools" class="yellow-btn rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-950">
              All 189 tools →
            </a>
            <a href="/blog" class="rounded-lg border border-line bg-chip px-4 py-2.5 text-xs font-semibold text-ink">
              Guides
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}
