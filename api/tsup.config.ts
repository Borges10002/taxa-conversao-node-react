// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  outDir: "build",
  target: "es2020",
  format: ["cjs"],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["async_hooks", "#async_hooks"], // <- aqui está a mágica
});
