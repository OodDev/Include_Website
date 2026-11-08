import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { ButtonLink } from "@/components/ui/Button";
import { features } from "@/config/site";
import { logoSpot } from "@/features/newsletter/availability";

/** StayConnected (§6.2 #10): "Want to know more? Get in touch" + conditional newsletter card, news/events only when ≥1 item exists. */
export async function StayConnected() {
  const tHome = await getTranslations("home");
  const tContact = await getTranslations("contact");
  return (
    <Section tone="paper">
      <Container className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div>
          <h2 className="text-h2 font-bold">{tHome("ctaContact")}</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contact">{tContact("ctaTeam")}</ButtonLink>
          </div>
        </div>
        {features.showNewsletter && logoSpot()}
      </Container>
    </Section>
  );
}
