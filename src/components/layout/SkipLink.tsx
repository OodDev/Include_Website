
export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only z-50 rounded-pill bg-white px-5 py-3 text-slate shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}

export function StickyOffset() {
  // Not needed; scroll-padding-top in globals handles anchor offsets.
  return null;
}
