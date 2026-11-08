/** Utility: read a localised field from an i18n record map, falling back to `en`. */
export function localisedField<
  T extends { i18n: Record<string, Record<string, unknown>> },
>(locale: string, item: T, field: "title" | "summary" | "body" | "description"): string {
  const entry = item.i18n[locale] ?? item.i18n["en"] ?? {};
  const value = entry[field];
  return typeof value === "string" ? value : "";
}
