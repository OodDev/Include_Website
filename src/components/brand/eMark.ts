/**
 * Official "e" short-mark geometry — verbatim path data from the
 * owner-supplied vector files (`e/*.svg`, Brand kit
 * INCLUDE-SVGs_logos_and_icons, received 2026-11-11; mirrored in
 * `assets/brand/e/`). No tracing, no recreation (§2.4).
 *
 * The letter is one evenodd path whose "eye" is a hole (background shows
 * through). EYE_PATH draws the optional rust person-dot inside that hole —
 * exactly how the owner files separate `e-ardesia.svg` from
 * `e-ardesia-punto-ruggine.svg`.
 */
export const E_VIEWBOX = "0 0 196 264";

export const E_LETTER_PATH =
  "M132.7 189.3C129.2 188.1 129.1 183.2 132.5 181.9C166.8 169.1 192 137.7 194.2 99.7C197.1 48 156.2 3.4 103 0.4C49.7 -2.6 4 37 1.1 88.7C0.9 90.9 0.9 93.1 0.9 95.3C-0.1 139.8 13.1 177 40.2 205.8C81.5 249.6 143.3 259.3 170.2 262.1C180.3 263.1 183.6 255.4 183.6 251.7L183.5 210.4C183.5 203.9 178.6 198.4 172.1 197.8C162.5 196.7 148 194.4 132.7 189.3ZM99.3 64.5C117.2 65.5 131 79.7 130.1 96.1C129.1 112.4 113.8 124.9 95.9 123.9C79.2 122.9 66 110.5 65.2 95.5C65.2 94.3 65.2 93.1 65.3 91.8L65.2 91.8C66.4 75.7 81.6 63.5 99.3 64.5Z";

export const E_EYE_PATH =
  "M99.3 64.5C117.2 65.5 131 79.7 130.1 96.1C129.1 112.4 113.8 124.9 95.9 123.9C79.2 122.9 66 110.5 65.2 95.5C65.2 94.3 65.2 93.1 65.3 91.8L65.2 91.8C66.4 75.7 81.6 63.5 99.3 64.5Z";

/** Letter bbox ≈ x 0.9–194.2, y 0.4–263.1 (aspect 196:264, near 3:4). */
export const E_ASPECT = 196 / 264;
