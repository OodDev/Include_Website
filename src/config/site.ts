/** Site facts (no-fabrication rule: only the values in the approved sources). */
export const siteConfig = {
  /** Owner-supplied canonical origin (env). Fallback exists for dev only. */
  name: "INCLUDE",
  fullName: "INCLUDE – From protected paths to real jobs",
  tagline: "From protected paths to real jobs",
  programme: "Erasmus+ KA220-VET",
  programmeLabel: "Erasmus+ – Cooperation Partnerships in Vocational Education and Training (KA220-VET)",
  projectNumber: "2026-1-IT01-KA220-VET-000465826",
  durationsMonths: 24,
  projectPeriod: {
    start: "2026-10-01",
    end: "2028-09-30",
    label: "1 October 2026 – 30 September 2028",
  },
  countriesCount: 4,
  partnersCount: 6,
  coordinator: "Bene Futuro srl",
  /** Targets, labelled as targets (never achievements). */
  targets: {
    companiesPerCountry: 20,
    smesReached: 400,
  },
  /** Owner-supplied official URLs — until verified, empty (no links rendered). */
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
  },
  security: {
    /** Security.txt contact — owner must supply. */
    contact: "#", // TODO(owner): official contact URI
    expires: "2026-01-01T00:00:00.000Z",
  },
} as const;

/**
 * Feature flags — sections without real content are hidden until data exists
 * (§6.2 concision rule, §2.3 #6/#9/#11, §6.9 availability gates).
 */
export const features = {
  /** Hero PhaseTrack signature + section presence toggles */
  showStories: false, // needs ≥1 published consent-verified story
  showEvents: false, // needs ≥1 real event
  showNewsTeaser: true,
  networkCounters: false, // needs verified live figures
  showNewsletter: false, // needs NEWSLETTER_PROVIDER
  showGlossary: false, // noindex until owner approves
  protocolResource: false, // "European Protocol" unpublished until owner approval
  associatedPartners: false, // until partners.yaml has type:associated entries
} as const;

export type FeatureFlag = keyof typeof features;
