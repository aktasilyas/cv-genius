import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "node_modules/**",
      "dist/**",
      ".git/**",
      ".cache/**",
      "**/*.config.{ts,js}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/__tests__/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/.{idea,git,cache,output,temp}/",
        "dist/",
      ],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    // Test performance thresholds
    slowTestThreshold: 5000,
    // Retry failed tests
    retry: 0,
    // Isolate tests
    isolate: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
