import type { MetadataRoute } from "next";
import { env } from "@/env";

/**
 * PWA manifest — static subset until the owner supplies real logo assets.
 * No screenshots/shortcuts invented (§2.4, §0.4.2).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INCLUDE – From protected paths to real jobs",
    short_name: "INCLUDE",
    description:
      "A European Erasmus+ project creating inclusive pathways from vocational training to real employment.",
    start_url: "/en",
    display: "standalone",
    lang: "en",
    dir: "ltr",
    background_color: "#f3f3f1",
    theme_color: "#0f2f4b",
    icons: [{ src: `${env.NEXT_PUBLIC_SITE_URL}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
