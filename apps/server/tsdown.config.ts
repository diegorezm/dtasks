import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@dtask\/.*/],
  minify: true,
  treeshake: true,
  target: "es2022", // workers support modern JS, no need to downcompile
  sourcemap: false, // no sourcemaps in prod = smaller bundle
});
