export function prepareQP(value: string | null) {
  return String(value || '').trim()
}

export function fallback(value: string, values: string[], _fallback: string) {
  return values.includes(value) ? value : _fallback
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { dateStyle: 'medium' })
}

export function formatNumber(value: number) {
  return Intl.NumberFormat('en-US').format(value)
}

export function periodStart(period: string) {
  const periods = ['week', 'month', 'year']
  const index = periods.indexOf(period)

  if (index === -1) throw new Error('Invalid period')

  const today = new Date()
  today.setHours(24, 0, 0, 0)
  today.setDate(today.getDate() - [7, 30, 365][index])

  return today.toISOString().substring(0, 10)
}
