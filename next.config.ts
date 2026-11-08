import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,

  // Repo content (MDX/YAML) is read at runtime by the loaders; include it in
  // the standalone trace or every loadPage/listNews call 404s silently.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },

  // Security headers (§12). CSP starts Report-Only; enforced after a soak period (ADR pending).
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        {
          key: "Content-Security-Policy-Report-Only",
          value: [
            "default-src 'self'",
            "img-src 'self'",
            "font-src 'self'",
            "connect-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "script-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
          ].join("; "),
        },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ],
  // Lint runs via `pnpm lint` in CI, not on every build (build stays fast, deterministic).
};

export default withNextIntl(nextConfig);
