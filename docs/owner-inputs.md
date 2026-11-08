# Owner inputs — what the owner must supply or approve

Visible working checklist. Nothing below is invented; the site runs without them using defaults + documented gates.

## Blockers for launch

- [ ] **Production domain** and canonical URL (`NEXT_PUBLIC_SITE_URL`); hosting preference + EU region.
- [ ] **Official vector brand assets** (the supplied PDFs contain no vectors):
  - [ ] polychrome logo + monochrome/negative variants (SVG)
  - [ ] "e" short mark (SVG) → favicon/app icon set
  - [ ] 24 official icons (exploration 03)
  - [ ] Ready for Inclusion label (variants)
  - [ ] Official Erasmus+/EU emblem files (Commission-supplied)
  - [ ] Partner logos (6 partners) + verified partner website URLs
- [ ] **Coordinator public contact details**: official email for contact form recipient(s) (`CONTACT_TO_EMAIL` / optional `CONTACT_ROUTING`), postal address if wanted, security.txt contact.
- [ ] **Email delivery provider** decision + credentials (Brevo recommended / SMTP), DPA signed.
- [ ] **Newsletter**: platform, sender identity, frequency, consent wording, list ID, double-opt-in copy.
- [ ] **Legal approval**: data-controller identity confirmation (assumed Bene Futuro srl as coordinator), privacy/cookie/accessibility/legal-notice policy sign-off, DPO yes/no, processor list, retention schedule, content licence for downloads.
- [ ] **Analytics** decision: none (default) / cookieless EU provider / GA4+Consent Mode v2.
- [ ] monitoring/uptime + backup needs.

## Confirmations required (per §2.3 / §18.2)

- [ ] Desktop nav ordering incl. pill position in DOM (§2.3 #3 judgement).
- [ ] "European Protocol for Work Inclusion" as a published output (currently draft, hidden).
- [ ] Paper tone `#F3F3F1` (§2.3 #13).
- [ ] "Discover the INCLUDE network" CTA destination (currently `/ready-for-inclusion#ambassador-network`).
- [ ] AI-training crawler stance (`allowAiTraining`, default `true`).
- [ ] Glossary + easy-read pages going live.
- [ ] Mockup-sourced lines reused in EN/IT ("A pathway, not an internship"; "cycle of disappointment" headline; shift-of-perspective pairs).
- [ ] Italian translations approved (`humanReviewed: true` per page) → publishes `it`.
- [ ] Whether PT/ES/EL translations should be made + professionally verified.

## Content

- [ ] Photography/video with releases and consent documentation (§5.9: none on site until then).
- [ ] First news posts, event entries, pilot stories (consent verified, category `pilot-stories` gating).
- [ ] Resource publications: files, publication dates, languages, accessibility-checked PDFs + HTML summaries.
- [ ] Associated partners: names/logos if they should be published.
