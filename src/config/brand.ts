/**
 * Brand constants for code that cannot read CSS variables:
 * OG images, favicon generation, contrast tests.
 * A unit test asserts these match src/styles/tokens.css (§4 dependency rule).
 */
export const brand = {
  slate: "#465056",
  sky: "#9FBBC9",
  rust: "#C14723",
  petrol: "#068A92",
  petrolDeep: "#08767C",
  burgundy: "#671317",
  red: "#B2252F",
  ochre: "#D3851D",
  mist: "#E2E9ED",
  paper: "#F3F3F1",
  white: "#FFFFFF",
} as const;

export type BrandColor = keyof typeof brand;

/** Text-legal pairs (white yields where permitted per Brand 01 accessibility rules). */
export const textOnAllowed = [
  "slate",
  "rust",
  "petrolDeep",
  "burgundy",
  "red",
] as const satisfies BrandColor[];
