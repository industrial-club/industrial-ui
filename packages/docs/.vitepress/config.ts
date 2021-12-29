/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2021-02-26 15:22:42
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-04-08 13:27:07
 */

module.exports = {
  lang: "en-US",
  head: [
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", content: "inl ui" }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  title: "工业俱乐部",
  base: "/",
  themeConfig: {
    repo: "bhabgs/vite-vui",
    sidebar: {
      "/": [
        {
          text: "inl-app-ui",
          children: [{ text: "介绍", link: "/" }],
        },
      ],
    },
    author: "bhabgs",
    nav: [
      { text: "首页", link: "/" },
      { text: "分类", link: "/tags" },
    ],
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024 * 50,
      target: "chrome58",
    },
    ssr: {
      external: ["@antv/x6"],
    },
  },
  dest: "public",
};
