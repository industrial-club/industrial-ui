/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2021-02-26 15:22:42
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-04-08 13:27:07
 */
import { defineConfig } from "vitepress";
import { blockPlugin } from "./demo.render";
import inlUi from "./inl-app-ui";
import inlpc from "./inl-pc-ui";
import head from "./head";

module.exports = defineConfig({
  lang: "en-US",
  head: head() as any,
  title: "工业俱乐部",
  base: "/",
  themeConfig: {
    docsDir: ".",
    docsBranch: ".",
    editLinks: true,
    repo: "industrial-club/industrial-ui/tree/master/packages/app",
    sidebar: {
      "/": [inlUi(), inlpc()],
    },
    author: "bhabgs",
    nav: [
      { text: "app", link: "/app/started.html" },
      { text: "pc", link: "/pc/started.html", open: true },
    ],
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024 * 50,
      target: "chrome58",
    },
  },
  markdown: {
    config: (md) => {
      md.use(blockPlugin);
    },
  },
});
