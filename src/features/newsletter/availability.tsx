
/**
 * Newsletter availability (§6.9): the card is OPERATIONAL only when a provider
 * is configured; otherwise hidden with an owner-facing setup note.
 */
export function logoSpot() {
  return null; // no provider configured in v1 (features.showNewsletter = false)
}
