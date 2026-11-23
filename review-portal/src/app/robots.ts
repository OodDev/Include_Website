import type { MetadataRoute } from "next";

// Private review area: keep it out of search engines entirely.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
