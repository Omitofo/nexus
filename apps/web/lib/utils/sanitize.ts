// Input sanitization helpers.
// Used before displaying any externally-sourced text to prevent XSS.

// Strip HTML tags from a string before rendering in the DOM.
// Use this on any data that came from an external source (price feeds, notes, etc.)
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "")
}

// Truncate a string to a maximum length with ellipsis
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength - 3) + "..."
}
