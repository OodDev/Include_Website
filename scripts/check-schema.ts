/**
 * check:schema — JSON-LD builders must emit only schema.org types the spec
 * allows (§9): Organization, WebSite, WebPage/AboutPage/ContactPage/…, URl,
 * BreadcrumbList, ListItem, Article, FAQPage, DefinedTerm. Explicitly
 * forbidden: GovernmentService, Grant, EducationalOccupationalProgram,
 * ratings, JobPosting, Event with invented dates.
 */
import {
  organizationSchema,
  websiteSchema,
  webPageSchema,
  breadcrumbSchema,
  newsArticleSchema,
} from "@/lib/seo/schemaorg";

const ALLOWED = new Set([
  "Organization",
  "WebSite",
  "WebPage",
  "AboutPage",
  "ContactPage",
  "CollectionPage",
  "BreadcrumbList",
  "ListItem",
  "Article",
  "FAQPage",
  "DefinedTerm",
]);
const FORBIDDEN = new Set([
  "GovernmentService",
  "Grant",
  "EducationalOccupationalProgram",
  "JobPosting",
  "AggregateRating",
  "Review",
]);

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`✗ ${m}`);
};

const samples: Array<[string, unknown]> = [
  ["organization", organizationSchema()],
  ["website en", websiteSchema("en")],
  ["webPage home", webPageSchema({ kind: "WebPage", name: "Home", description: "desc", locale: "en", route: "/" })],
  [
    "breadcrumb",
    breadcrumbSchema(
      [
        { name: "Home", route: "/" },
        { name: "The Project", route: "/the-project" },
      ],
      "en",
    ),
  ],
  [
    "newsArticle",
    newsArticleSchema({
      locale: "en",
      route: "/en/news/post",
      title: "Title",
      excerpt: "d",
      datePublished: "2026-01-01",
      authorName: "INCLUDE",
    }),
  ],
];

function collectTypes(node: unknown, types: string[]): void {
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (k === "@type") {
      const val = Array.isArray(v) ? v : [v];
      for (const t of val) if (typeof t === "string") types.push(t);
    } else if (v && typeof v === "object") {
      collectTypes(v, types);
    }
  }
}

for (const [name, data] of samples) {
  const types: string[] = [];
  collectTypes(data, types);
  for (const t of types) {
    if (FORBIDDEN.has(t)) fail(`forbidden @type "${t}" in ${name}`);
    else if (!ALLOWED.has(t)) fail(`unknown @type "${t}" in ${name} — add to allowlist if intentional`);
  }
  console.log(`✓ ${name}: ${types.join(", ") || "no types"}`);
}

if (failures > 0) {
  console.error(`\ncheck:schema FAILED — ${failures} problem(s)`);
  process.exit(1);
}
console.log("check:schema passed");
