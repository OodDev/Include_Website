// Flat config for ESLint 10 / Next 16 — eslint-config-next ships a flat array.
import nextConfig from "eslint-config-next";

const config = [
  {
    ignores: [".git/**", "node_modules/**", ".next/**", "out/**", "public/vendor/**", "docs/**", "content/**", "messages/**", "mockups/**"],
  },
  ...nextConfig,
  {
    // Project rules (§0.4): no fabrication; keep the allowlist explicit.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": ["error", { allow: ["error", "warn"] }],
    },
  },
];
export default config;
