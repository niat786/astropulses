/** Convert a civil local datetime in an IANA timezone to a UTC Date. */
export function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const utcAsIf = Date.UTC(year, month - 1, day, hour, minute, 0)
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  const asUtcMs = (date: Date) => {
    const parts = dtf.formatToParts(date)
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value ?? '0')
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  }

  // First pass
  let instant = utcAsIf
  let shown = asUtcMs(new Date(instant))
  instant += utcAsIf - shown
  // Second pass handles DST edges
  shown = asUtcMs(new Date(instant))
  instant += utcAsIf - shown
  return new Date(instant)
}

export function formatUtcIso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}
