import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["{__tests__,app,components,lib}/**/*.test.{ts,tsx}"],
    // Force Vite to bundle motion through its own resolver so jsdom tests don't see two React copies (worktree's node_modules/react vs. hoisted motion's React).
    server: {
      deps: {
        inline: ["framer-motion", "motion", "motion-dom", "motion-utils"],
      },
    },
  },
});
