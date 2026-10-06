import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-gtp-review/**",
    "out/**",
    "build/**",
    "unlighthouse/**",
    "next-env.d.ts",
    // Colocated Sanity Studio — separate package.json and eslint.config.mjs
    "studio/**",
    // Local tooling and review artifacts are outside the application source.
    ".agents/**",
    ".cursor/**",
    ".claude/**",
    ".impeccable/**",
  ]),
]);

export default eslintConfig;
