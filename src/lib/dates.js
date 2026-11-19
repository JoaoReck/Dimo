const pad = (n) => String(n).padStart(2, '0')

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dateKey(d)
}

export function addDaysKey(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return dateKey(d)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Boa madrugada'
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}
