// import inlui from "inl-app-ui";
import pcui from "inl-pc-ui";
import Layout from "./inl/Layout";
// import theme from "vitepress/dist/client/theme-default";
import code from "./inl/comBlock";
import "./style/markdown/index.less";
import "./style/index.less";
import "inl-pc-ui/dist/style.css";

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component("comb", code);
    app.use(pcui);
  },
};
