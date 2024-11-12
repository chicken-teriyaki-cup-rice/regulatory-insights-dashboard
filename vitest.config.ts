// vitest.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/components/__test__/**/*.test.tsx"], // Ensure this points to your test files
  },
});
