const MONTHS: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

const MONTH_NAMES = [
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

export type ParsedPerson = {
  name?: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
  unknownTime: boolean
  place?: string
}

export type ParsedToolInput = {
  values: Record<string, string>
  person: ParsedPerson
  partner?: ParsedPerson
}

function pick(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

function parseMonth(raw: string): number | null {
  if (!raw || raw === 'Month') return null
  if (MONTHS[raw]) return MONTHS[raw]
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 && n <= 12 ? n : null
}

function parseDay(raw: string): number | null {
  if (!raw || raw === 'Day') return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 && n <= 31 ? n : null
}

function parseHour12(hourRaw: string, periodRaw: string): number | null {
  if (!hourRaw || hourRaw === 'Hour') return null
  let hour = Number(hourRaw)
  if (!Number.isFinite(hour) || hour < 1 || hour > 12) return null
  const period = (periodRaw || 'AM').toUpperCase()
  if (period === 'AM') {
    if (hour === 12) hour = 0
  } else {
    if (hour !== 12) hour += 12
  }
  return hour
}

function parseMinute(raw: string): number {
  if (!raw || raw === 'Minute') return 0
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 && n < 60 ? n : 0
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function parsePerson(form: FormData, prefix: 'birth' | 'partner', nameKey: string): ParsedPerson | { error: string } {
  // Support both split fields (`birth-month`, `birth-day`, `birth-year`) AND HTML5 date input (`date` or `birthDate`)
  let month = parseMonth(pick(form, `${prefix}-month`))
  let day = parseDay(pick(form, `${prefix}-day`))
  let year = Number(pick(form, `${prefix}-year`))

  if (!month || !day || !Number.isFinite(year) || year < 1000) {
    const isoDateRaw =
      prefix === 'birth'
        ? pick(form, 'birthDate') || pick(form, 'date') || pick(form, 'birth-date')
        : pick(form, 'partnerDate') || pick(form, 'partner-date')
    if (isoDateRaw && /^\d{4}-\d{2}-\d{2}$/.test(isoDateRaw)) {
      const [yStr, mStr, dStr] = isoDateRaw.split('-')
      year = Number(yStr)
      month = Number(mStr)
      day = Number(dStr)
    }
  }

  if (!month || !day || !Number.isFinite(year) || year < 1000 || year > 2100) {
    return { error: 'Enter a valid date of birth (month, day, and year).' }
  }
  if (day > daysInMonth(year, month)) {
    return { error: 'That day does not exist in the selected month.' }
  }

  const unknownTime =
    pick(form, `${prefix}-unknown-time`) === 'on' ||
    (prefix === 'birth' && (pick(form, 'unknownTime') === '1' || pick(form, 'unknownTime') === 'on'))

  let hour = 12
  let minute = 0
  if (!unknownTime) {
    const parsedHour = parseHour12(pick(form, `${prefix}-hour`), pick(form, `${prefix}-period`))
    if (parsedHour !== null) {
      hour = parsedHour
      minute = parseMinute(pick(form, `${prefix}-minute`))
    } else {
      // Check HTML5 24-hour time input (`birthTime` or `time` or `partnerTime`)
      const time24Raw =
        prefix === 'birth'
          ? pick(form, 'birthTime') || pick(form, 'time') || pick(form, 'birth-time')
          : pick(form, 'partnerTime') || pick(form, 'partner-time')
      if (time24Raw && /^\d{1,2}:\d{2}/.test(time24Raw)) {
        const [hStr, minStr] = time24Raw.split(':')
        const h24 = Number(hStr)
        const m24 = Number(minStr)
        if (Number.isFinite(h24) && h24 >= 0 && h24 < 24) hour = h24
        if (Number.isFinite(m24) && m24 >= 0 && m24 < 60) minute = m24
      }
    }
  }

  const name = pick(form, nameKey) || undefined
  const place =
    prefix === 'birth'
      ? pick(form, 'place') || pick(form, 'birthPlace') || 'London, UK'
      : pick(form, 'partner-place') || pick(form, 'partnerPlace') || 'New York, USA'

  return { name, year, month, day, hour, minute, unknownTime, place }
}

export function formDataToValues(form: FormData, person?: ParsedPerson, partner?: ParsedPerson): Record<string, string> {
  const values: Record<string, string> = {}
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') values[key] = value
  }
  // Ensure normalized values populate `BirthDetailsForm` selects even when submitted from quick-launch HTML5 inputs
  if (person) {
    values['birth-month'] = MONTH_NAMES[person.month - 1] || 'September'
    values['birth-day'] = String(person.day)
    values['birth-year'] = String(person.year)
    const period = person.hour >= 12 ? 'PM' : 'AM'
    const h12 = person.hour % 12 === 0 ? 12 : person.hour % 12
    values['birth-hour'] = String(h12).padStart(2, '0')
    values['birth-minute'] = String(person.minute).padStart(2, '0')
    values['birth-period'] = period
    if (person.place) values['place'] = person.place
    if (person.unknownTime) values['birth-unknown-time'] = 'on'
  }
  if (partner) {
    values['partner-month'] = MONTH_NAMES[partner.month - 1] || 'May'
    values['partner-day'] = String(partner.day)
    values['partner-year'] = String(partner.year)
    const period = partner.hour >= 12 ? 'PM' : 'AM'
    const h12 = partner.hour % 12 === 0 ? 12 : partner.hour % 12
    values['partner-hour'] = String(h12).padStart(2, '0')
    values['partner-minute'] = String(partner.minute).padStart(2, '0')
    values['partner-period'] = period
    if (partner.place) values['partner-place'] = partner.place
    if (partner.unknownTime) values['partner-unknown-time'] = 'on'
  }
  return values
}

export function parseToolForm(form: FormData, needsPartner: boolean): ParsedToolInput | { error: string } {
  const person = parsePerson(form, 'birth', 'name')
  if ('error' in person) return person

  if (!needsPartner) {
    return { values: formDataToValues(form, person), person }
  }

  let partner = parsePerson(form, 'partner', 'partner-name')
  if ('error' in partner) {
    // Provide a sensible partner default if quick-launched from a single-person form
    partner = {
      name: 'Partner',
      year: 1994,
      month: 11,
      day: 22,
      hour: 14,
      minute: 15,
      unknownTime: false,
      place: 'New York, USA',
    }
  }
  return { values: formDataToValues(form, person, partner), person, partner }
}
