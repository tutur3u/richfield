import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Pinning the React version short-circuits eslint-plugin-react@7.37.5's
// resolveBasedir helper, which calls a method that does not exist on
// ESLint 10's rule context. Remove this block when the upstream plugin
// ships an ESLint 10 compatible release.
const reactVersionWorkaround = {
  settings: { react: { version: "19.2.5" } },
};

// Editorial content uses straight apostrophes intentionally; the
// typography pass converts them at render time when we need curly
// quotes. Don't fight it at lint time.
const projectRules = {
  rules: {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  reactVersionWorkaround,
  projectRules,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated test artifacts.
    "playwright-report/**",
    "test-results/**",
    "blob-report/**",
    "playwright/.cache/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
