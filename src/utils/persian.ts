const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert ASCII digits to Persian digits. */
export function toPersianDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => PERSIAN_DIGITS[+d])
}

/** Format time as m:ss with Persian digits. */
export function formatTimePersian(seconds: number | null | undefined): string {
  const total = Math.max(0, Math.floor(Number(seconds || 0)))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${toPersianDigits(m)}:${String(s).padStart(2, '0').replace(/\d/g, (d) => PERSIAN_DIGITS[+d])}`
}
