import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, JsonLd } from "@/lib/seo/schemaorg";
import { AnswerBlock } from "@/components/seo/KeyFacts";
import { ContactForm } from "@/features/contact/ContactForm";
import { StayConnected } from "@/components/sections/StayConnected";
import { altchaConfigured } from "@/lib/security/altcha";
import { mailConfigured } from "@/env";

/** Route metadata via buildMetadata (§9.1). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("metadata.contact");
  return buildMetadata({
    locale: locale as "en",
    route: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "contact");
  if (!page) return null;
  const fm = page.frontmatter as {
    hero: { title: string; lead: string; sub?: string };
  };

  const sp = await searchParams;
  // Deep link from "I am a company" CTA pre-selects the audience (§6.6).
  const audienceParam = typeof sp.type === "string" ? sp.type : undefined;
  const defaultAudience = audienceParam === "company" ? "company" : undefined;

  const tMeta = await getTranslations("metadata.contact");
  // Availability gate: the form is offered only when BOTH the challenge key
  // and a delivery adapter exist (never a silently dropped message, §6.9).
  const operational = altchaConfigured() && mailConfigured();

  return (
    <>
      <JsonLd
        data={webPageSchema({ locale, route: "/contact", kind: "ContactPage", name: tMeta("title"), description: tMeta("description") })}
      />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />
      <Container className="pb-12 md:pb-16">
        <h1 className="max-w-[20ch] text-h1 font-semibold tracking-tight">{fm.hero.title}</h1>
        <div className="mt-8">
          <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
        </div>
        {fm.hero.sub && <p className="mt-6 max-w-[65ch] text-[0.9375rem]">{fm.hero.sub}</p>}
      </Container>
      <Section tone="paper">
        <Container>
          <h2 className="text-h2 font-semibold">
            {tMeta("title")}
          </h2>
          {/* Petrolio-direction form card (D17): mist→white gradient, petrol shadow */}
          <div className="mt-8 max-w-[56rem] rounded-card-lg border border-slate/10 bg-gradient-to-br from-mist to-white p-6 shadow-[0_12px_30px_rgba(8,118,124,0.12)] md:p-8">
            <ContactForm operational={operational} {...(defaultAudience ? { defaultAudience } : {})} />
          </div>
        </Container>
      </Section>
      <StayConnected />
    </>
  );
}
