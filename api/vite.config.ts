import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [["src/http/controllers/**", "prisma"]],
    dir: "src", // Essa linha
  },
});
