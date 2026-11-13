import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * Footer logo: official "Main_Logo_with_UnderText.svg" (wordmark + tagline
 * "FROM PROTECTED PATHS TO REAL JOBS"), converted to fill variants —
 * negative (#ffffff) and slate (#465056, "Version 3" white-footer art
 * direction); all geometry and text positions verbatim.
 *
 * The tagline is live <text> set in Manrope-ExtraBold, so this SVG is INLINED
 * (server component, no client JS) instead of loaded via <img>: an <img> SVG
 * cannot use the page's web font and the tagline would fall back to a system
 * font. Class names are prefixed `fl-` (footer logo) because SVG <style> is
 * document-global — only one variant may render per page (footer-only use).
 */
const LOGO_FILLS = {
  negative: "#ffffff",
  slate: "#465056",
} as const;

export async function LogoFooter({
  href,
  variant = "negative",
}: {
  href: string;
  variant?: keyof typeof LOGO_FILLS;
}) {
  const t = await getTranslations("common");
  const fill = LOGO_FILLS[variant];
  return (
    <Link href={href} aria-label={t("toHome")} className="inline-block w-40">
      <svg
        viewBox="0 0 505.31 161.1"
        role="img"
        aria-hidden="true"
        focusable="false"
        className="block h-auto w-full"
      >
        <style>{`
          .fl-1,.fl-2,.fl-4,.fl-5,.fl-6,.fl-7,.fl-8 { fill: ${fill}; }
          .fl-2 {
            font-family: var(--font-manrope), Manrope, system-ui, sans-serif;
            font-size: 22.29px;
            font-variation-settings: "wght" 800;
            font-weight: 800;
          }
          .fl-3 { letter-spacing: 0em; }
          .fl-9 { letter-spacing: -.06em; }
          .fl-10 { letter-spacing: -.02em; }
          .fl-11 { letter-spacing: -.02em; }
          .fl-12 { letter-spacing: -.05em; }
          .fl-13 { letter-spacing: -.05em; }
        `}</style>
        <path className="fl-7" d="M287.99,126.83c-22.8,0-41.35-18.02-41.35-40.16v-46.22c0-2.21,1.79-3.99,3.99-3.99h19.46c2.21,0,3.99,1.79,3.99,3.99v46.22c0,7.01,6.24,12.72,13.9,12.72s13.9-5.7,13.9-12.72v-26.69c0-2.21,1.79-3.99,3.99-3.99h19.46c2.21,0,3.99,1.79,3.99,3.99v26.69c0,22.14-18.55,40.16-41.35,40.16Z"/><path className="fl-4" d="M62.6,126.46h-19.03c-2.32,0-4.21-1.88-4.21-4.21v-35.35c0-22.15,18.55-40.16,41.35-40.16s41.35,18.02,41.35,40.16v34.9c0,2.32-1.88,4.21-4.21,4.21h-19.03c-2.32,0-4.21-1.88-4.21-4.21v-34.9c0-7.01-6.24-12.72-13.9-12.72s-13.9,5.7-13.9,12.72v35.35c0,2.32-1.88,4.21-4.21,4.21Z"/><rect className="fl-8" x="2.04" y="47.87" width="27.44" height="78.58" rx="4.21" ry="4.21"/><rect className="fl-7" x="210.04" y="10.35" width="27.44" height="116.11" rx="4.21" ry="4.21"/><path className="fl-5" d="M416.63,85.73V24.6c0-2.21-1.79-3.99-3.99-3.99h-19.46c-2.21,0-3.99,1.79-3.99,3.99v18.74c0,2.69-2.48,4.66-5.12,4.1-2.82-.6-5.75-.91-8.76-.91-22.8,0-41.35,18.02-41.35,40.16s18.55,40.16,41.35,40.16,41.35-18.02,41.35-40.16c0-.32-.02-.64-.03-.96ZM375.31,99.41c-7.67,0-13.9-5.7-13.9-12.72s6.24-12.72,13.9-12.72,13.61,5.46,13.88,12.26v.91h0c-.26,6.8-6.38,12.26-13.88,12.26Z"/><circle className="fl-8" cx="15.15" cy="25.93" r="15.15"/><circle className="fl-7" cx="261.07" cy="15.15" r="15.15"/><circle className="fl-5" cx="316.28" cy="35.47" r="15.15"/><path className="fl-6" d="M481.25,126.43c-1.52-.42-1.69-2.52-.25-3.15,14.32-6.32,24.31-20.34,24.31-36.58,0-22.15-18.55-40.16-41.35-40.16s-41.35,18.02-41.35,40.16c0,.96.05,1.9.12,2.85.63,19.02,7.16,34.56,19.46,46.2,18.68,17.68,45.31,20.32,56.83,20.83,4.35.19,5.56-3.15,5.47-4.74l-1.04-17.62c-.15-2.79-2.38-5-5.17-5.14-4.12-.2-10.39-.82-17.03-2.64ZM463.96,73.98c7.67,0,13.9,5.71,13.9,12.72s-6.24,12.72-13.9,12.72c-7.17,0-13.08-4.99-13.82-11.36-.01-.52-.03-1.04-.03-1.58h-.04c.13-6.91,6.31-12.49,13.89-12.49Z"/><text className="fl-2" transform="translate(.2 155.41)"><tspan x="0" y="0">FROM PR</tspan><tspan className="fl-11" x="96.7" y="0">O</tspan><tspan className="fl-3" x="113.15" y="0">T</tspan><tspan className="fl-10" x="126.75" y="0">E</tspan><tspan className="fl-3" x="139.35" y="0">CTED </tspan><tspan className="fl-12" x="203.01" y="0">P</tspan><tspan className="fl-9" x="216.39" y="0">A</tspan><tspan x="230.27" y="0">THS TO REA</tspan><tspan className="fl-13" x="357.92" y="0">L</tspan><tspan x="368.86" y="0" xmlSpace="preserve"> JOBS</tspan></text><path className="fl-1" d="M169.99,130.01c-23.5,0-42.63-18.57-42.63-41.41s19.12-41.41,42.63-41.41c12.4,0,24.09,5.23,32.13,14.19,1.74,1.94,1.42,4.96-.71,6.46l-16.26,11.48c-1.62,1.14-3.81,1.06-5.3-.24-2.64-2.29-6.14-3.6-9.86-3.6-7.9,0-14.33,5.88-14.33,13.11s6.43,13.11,14.33,13.11c3.72,0,7.22-1.31,9.86-3.6,1.49-1.3,3.69-1.38,5.3-.24l16.26,11.48c2.13,1.5,2.45,4.52.71,6.46-8.05,8.96-19.73,14.19-32.13,14.19Z"/>
      </svg>
    </Link>
  );
}
