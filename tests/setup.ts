// Shared test bootstrap: safe defaults for env-dependent modules.
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";
process.env.SITE_ENV ??= "development";
