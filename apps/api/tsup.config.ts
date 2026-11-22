import { defineConfig } from "tsup";

// Bundle the workspace packages (they ship TypeScript source) but keep npm deps external.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  noExternal: [/^@repo\//],
  // Deps of the workspace packages (pg, @prisma/*) get bundled too; some are CommonJS and need `require`.
  banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
});
