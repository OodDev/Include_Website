import { SITE_URL } from "./metadata";
import { siteConfig } from "@/config/site";

/**
 * JSON-LD (§9.2): conservative set only, server-rendered, escapes `<`.
 * Every @id/URL derives from NEXT_PUBLIC_SITE_URL — no hard-coded domain.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" to avoid XSS through content (§9.2)
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}

/** Organization — project/coordinator with verified facts only. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteOrgName(),
    url: SITE_URL,
    // logo + sameAs: only when owner-supplied verified assets exist (no invention)
    // funder reflecting the Erasmus+ programme
    funding: {
      "@type": "Grant",
      identifier: siteProjectNumber(),
      name: "Erasmus+ KA220-VET",
      grantedBy: {
        "@type": "Organization",
        name: "European Commission – Erasmus+ (European Education and Culture Executive Agency, EACEA)",
      },
    },
  } as const;
}

function siteOrgName(): string {
  return siteConfig.fullName;
}
function siteProjectNumber(): string {
  return siteConfig.projectNumber;
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: siteConfig.fullName,
    inLanguage: locale,
  } as const;
}

export function webPageSchema({
  locale,
  route,
  kind = "WebPage",
  name,
  description,
}: {
  locale: string;
  route: string;
  kind?: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": kind,
    "@id": `${SITE_URL}/${locale}${route === "/" ? "" : route}#webpage`,
    url: `${SITE_URL}/${locale}${route === "/" ? "" : route}`,
    name,
    inLanguage: locale,
    ...(description ? { description } : {}),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  } as const;
}

export function breadcrumbSchema(items: { name: string; route: string }[], locale: string) {
  const base = `${SITE_URL}/${locale}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: it.name,
      item: it.route === "/" ? base : `${base}${it.route}`,
    })),
  } as const;
}

export function newsArticleSchema({
  locale,
  route,
  title,
  datePublished,
  dateModified,
  authorName,
  excerpt,
}: {
  locale: string;
  route: string;
  title: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  excerpt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/${locale}${route}#article`,
    url: `${SITE_URL}/${locale}${route}`,
    headline: title,
    inLanguage: locale,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(authorName ? { author: { "@type": "Organization", name: authorName } } : {}),
    description: excerpt,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  } as const;
}
