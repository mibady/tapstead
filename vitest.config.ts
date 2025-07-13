import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "**/*.d.ts", "**/*.config.*", "coverage/**", "dist/**", ".next/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "@/components": resolve(__dirname, "./components"),
      "@/lib": resolve(__dirname, "./lib"),
      "@/app": resolve(__dirname, "./app"),
      "@/types": resolve(__dirname, "./types"),
    },
  },
})
