/** Date helpers that work in local time (toISOString() would shift dates to UTC). */

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function hojeISO(): string {
  return toISODate(new Date())
}

/** Parses a YYYY-MM-DD string at local noon, avoiding DST/UTC edge cases. */
export function parseISODate(iso: string): Date {
  return new Date(`${iso}T12:00`)
}

export function segundaDaSemana(iso: string): Date {
  const d = parseISODate(iso)
  const dow = d.getDay()
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow))
  return d
}

export function formatDiaMes(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatDataLonga(iso: string): string {
  return parseISODate(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

export function formatHora(isoDateTime: string): string {
  return isoDateTime.slice(11, 16)
}

export function formatData(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
