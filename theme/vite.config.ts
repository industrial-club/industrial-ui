import vueJsx from "@vitejs/plugin-vue-jsx";
// import theme from "./theme";
const additionalData = require("./theme").default;

export default {
  resolve: {},
  server: {
    host: true,
  },
  plugins: [vueJsx()],
  optimizeDeps: {},
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData,
      },
    },
  },
};
