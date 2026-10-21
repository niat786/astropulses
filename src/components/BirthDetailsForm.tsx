import type { Tool, ToolField } from '../data/tools'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const labelClass = 'text-soft mb-2 block text-xs font-medium uppercase tracking-wider'
const selectClass = 'site-select rounded-xl px-3 py-3.5 text-sm'
const inputClass = 'site-input placeholder:text-faint w-full rounded-xl px-4 py-3.5 text-sm transition'

type FormValues = Record<string, string>

function val(values: FormValues | undefined, key: string, fallback = ''): string {
  return values?.[key] ?? fallback
}

function NameField({ id, label, values }: { id: string; label: string; values?: FormValues }) {
  return (
    <div>
      <label for={id} class={labelClass}>
        {label} <span class="text-faint normal-case tracking-normal">(optional)</span>
      </label>
      <input
        id={id}
        name={id}
        type="text"
        placeholder="e.g. Maya"
        value={val(values, id)}
        class={inputClass}
      />
    </div>
  )
}

function DateField({
  prefix,
  legend,
  values,
}: {
  prefix: string
  legend: string
  values?: FormValues
}) {
  const month = val(values, `${prefix}-month`, 'September')
  const day = val(values, `${prefix}-day`, '18')
  const year = val(values, `${prefix}-year`, '1992')

  return (
    <fieldset>
      <legend class={labelClass}>{legend}</legend>
      <div class="grid grid-cols-3 gap-3">
        <label class="sr-only" for={`${prefix}-month`}>
          Month
        </label>
        <select id={`${prefix}-month`} name={`${prefix}-month`} required class={selectClass}>
          <option value="">Month</option>
          {months.map((m) => (
            <option value={m} selected={m === month}>
              {m}
            </option>
          ))}
        </select>
        <label class="sr-only" for={`${prefix}-day`}>
          Day
        </label>
        <select id={`${prefix}-day`} name={`${prefix}-day`} required class={selectClass}>
          <option value="">Day</option>
          {days.map((d) => (
            <option value={d} selected={d === day}>
              {d}
            </option>
          ))}
        </select>
        <label class="sr-only" for={`${prefix}-year`}>
          Year
        </label>
        <input
          id={`${prefix}-year`}
          name={`${prefix}-year`}
          type="number"
          min="1000"
          max="2100"
          required
          value={year}
          class="site-input min-w-0 rounded-xl px-3 py-3.5 text-sm"
        />
      </div>
    </fieldset>
  )
}

function TimeField({ prefix, values }: { prefix: string; values?: FormValues }) {
  const hour = val(values, `${prefix}-hour`, '08')
  const minute = val(values, `${prefix}-minute`, '42')
  const period = val(values, `${prefix}-period`, 'AM')
  const unknown = val(values, `${prefix}-unknown-time`) === 'on'

  return (
    <fieldset>
      <div class="mb-2 flex items-center justify-between">
        <legend class="text-soft text-xs font-medium uppercase tracking-wider">Time of birth</legend>
        <a href="#learn" class="text-accent text-xs hover:opacity-80">
          Why it matters
        </a>
      </div>
      <div class="grid grid-cols-[1fr_1fr_.8fr] gap-3">
        <label class="sr-only" for={`${prefix}-hour`}>
          Hour
        </label>
        <select id={`${prefix}-hour`} name={`${prefix}-hour`} class={selectClass}>
          <option value="">Hour</option>
          {hours.map((h) => (
            <option value={h} selected={h === hour}>
              {h}
            </option>
          ))}
        </select>
        <label class="sr-only" for={`${prefix}-minute`}>
          Minute
        </label>
        <select id={`${prefix}-minute`} name={`${prefix}-minute`} class={selectClass}>
          <option value="">Minute</option>
          {minutes.map((m) => (
            <option value={m} selected={m === minute}>
              {m}
            </option>
          ))}
        </select>
        <label class="sr-only" for={`${prefix}-period`}>
          AM or PM
        </label>
        <select id={`${prefix}-period`} name={`${prefix}-period`} class={selectClass}>
          <option value="AM" selected={period === 'AM'}>
            AM
          </option>
          <option value="PM" selected={period === 'PM'}>
            PM
          </option>
        </select>
      </div>
      <label class="text-faint mt-3 flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          name={`${prefix}-unknown-time`}
          class="h-4 w-4 rounded accent-amber-500"
          checked={unknown}
        />
        I don’t know my birth time
      </label>
    </fieldset>
  )
}

function PlaceField({ id, label, values }: { id: string; label: string; values?: FormValues }) {
  return (
    <div>
      <label for={id} class={labelClass}>
        {label}
      </label>
      <div class="relative">
        <svg
          viewBox="0 0 24 24"
          class="text-faint absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <input
          id={id}
          name={id}
          type="text"
          required
          placeholder="City, Country"
          value={val(values, id, 'Karachi, Pakistan')}
          class="site-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm"
        />
      </div>
    </div>
  )
}

function renderField(field: ToolField, values?: FormValues) {
  switch (field) {
    case 'name':
      return <NameField id="name" label="Your name" values={values} />
    case 'date':
      return <DateField prefix="birth" legend="Date of birth" values={values} />
    case 'time':
      return <TimeField prefix="birth" values={values} />
    case 'place':
      return <PlaceField id="place" label="Place of birth" values={values} />
    case 'partnerName':
      return <NameField id="partner-name" label="Partner’s name" values={values} />
    case 'partnerDate':
      return <DateField prefix="partner" legend="Partner’s date of birth" values={values} />
    case 'partnerTime':
      return <TimeField prefix="partner" values={values} />
    case 'partnerPlace':
      return <PlaceField id="partner-place" label="Partner’s place of birth" values={values} />
  }
}

export function BirthDetailsForm({
  tool,
  values,
  securityToken,
}: {
  tool: Tool
  values?: FormValues
  securityToken?: string
}) {
  const fields = tool.fields.includes('name') ? tool.fields : (['name', ...tool.fields] as ToolField[])
  const needsPartner = fields.some((field) => field.startsWith('partner'))

  return (
    <div class="site-card rounded-2xl p-4 sm:p-7">
      <div class="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p class="text-sm font-bold text-ink">{needsPartner ? 'Birth details for both people' : 'Birth details'}</p>
          <p class="text-soft mt-0.5 text-xs">
            {tool.fields.includes('time')
              ? 'Accurate time gives the most precise result.'
              : 'Enter the details this tool needs to calculate your result.'}
          </p>
        </div>
        <span
          title="Protected Server-Side Ephemeris Engine"
          class="text-accent inline-flex items-center gap-1.5 rounded-lg border border-line bg-chip px-2.5 py-1 text-[11px] font-semibold"
        >
          ✦ Server Engine
        </span>
      </div>
      <form method="post" action={`/tools/${tool.slug}#result`} class="mt-5 grid gap-5">
        {securityToken && <input type="hidden" name="_token" value={securityToken} />}
        <div class="hidden" aria-hidden="true">
          <input type="text" name="_hp" tabindex={-1} autocomplete="off" />
        </div>
        {fields.map((field) => renderField(field, values))}
        <p class="text-soft flex gap-2 text-xs leading-5">
          <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Calculated securely on the server with VSOP87/J2000 ephemerides. Your birth details are never stored.
        </p>
        <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button type="submit" class="yellow-btn flex-1 rounded-lg px-5 py-3.5 text-sm font-semibold text-slate-950 transition">
            Run {tool.name} <span class="ml-1">→</span>
          </button>
          <a
            href={`/tools/${tool.slug}?sample=1#result`}
            class="text-soft hover:text-accent rounded-lg border border-line bg-chip px-4 py-3.5 text-center text-xs font-semibold transition"
          >
            Instant Sample
          </a>
        </div>
      </form>
    </div>
  )
}
