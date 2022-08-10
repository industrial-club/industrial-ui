import vueJsx from "@vitejs/plugin-vue-jsx";
// import viteThemeAnt from "../scripts/vite-less-ant-theme";
import { defineConfig } from "vite";
/**
 * @type {import('vite').UserConfig}
 */

export default defineConfig({
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      // "ant-design-vue/es": path.resolve(__dirname, "../components"),
      // "ant-design-vue": path.resolve(__dirname, "../components"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api/thingmodel/": "http://192.168.5.234",
      "/vms/": "http://192.168.5.234/",
      "/api/vms/": "http://192.168.5.234/",
      "/api/": {
        target: "http://192.168.5.26/",
      },
    },
  },
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
      mergeProps: false,
      enableObjectSlots: false,
    }),
    // docs(),
    // md(),
    vueJsx(),
    // vue({
    //   include: [/\.vue$/, /\.md$/],
    // }),
  ],
  optimizeDeps: {
    include: [
      // "fetch-jsonp",
      "@ant-design/icons-vue",
      "lodash-es",
      "dayjs",
      "vue",
      "vue-router",
      // "vue-i18n",
      "async-validator",
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true;@import "${require.resolve("./src/theme/dark.less")}";`,
          "root-entry-name": "dark",
        },
        javascriptEnabled: true,
      },
    },
  },
});
