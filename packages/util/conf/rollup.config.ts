import { defineConfig } from "rollup";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import json from "@rollup/plugin-json";
import ts from "@rollup/plugin-typescript";
import jsx from "acorn-jsx";
import babel from "@rollup/plugin-babel";

const extensions = [".ts", ".js", ".tsx", ".json", ".ttf", ".woff", ".woff2"];
const globals = {
  vue: "Vue",
};

export default defineConfig({
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
    globals,
    sourcemap: true,
    name: "inlUtil",
  },
  plugins: [
    json(),
    ts({
      tsconfig: "./tsconfig.json",
    }),
    babel({ babelHelpers: "bundled", extensions }),
    postcss({
      plugins: [cssnano],
      extract: "style.css", // 输出路径
    }),
  ],
  acornInjectPlugins: [jsx()],
  external: ["vue"],
});
