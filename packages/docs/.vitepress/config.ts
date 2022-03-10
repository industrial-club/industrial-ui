/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2021-02-26 15:22:42
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-04-08 13:27:07
 */
import { defineConfig } from "vitepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { blockPlugin } from "./demo.render";
import inlpc from "./inl-pc-ui";
import head from "./head";

module.exports = defineConfig({
  lang: "en-US",
  head: head() as any,
  title: "工业俱乐部",
  base: "/inl/",
  themeConfig: {
    docsDir: "",
    docsBranch: ".",
    editLinks: true,
    repo: "industrial-club/industrial-ui/tree/master/packages/app",
    sidebar: inlpc(),
    author: "bhabgs",
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024 * 50,
      target: "chrome99",
    },
    server: {
      fs: {
        allow: [".."],
      },
    },
    // plugins: [vueJsx()],
  },
  markdown: {
    config: (md) => {
      md.use(blockPlugin);
    },
  },
});
