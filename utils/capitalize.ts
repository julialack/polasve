/**
 * Capitalizes the first letter of any text string,
 * unless it starts with a URL protocol (http://, https://, www.)
 */
export function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return ''
  const trimmed = str.trim()
  if (!trimmed) return ''

  // Do not capitalize if string starts with http://, https:// or www.
  if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
    return trimmed
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
