import inlui from "inl-app-ui";
import pcui from "inl-pc-ui";
import Layout from "./inl/Layout";
import "./style/index.less";
import "inl-pc-ui/dist/style.css";
import "./style/markdown/index.less";

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(inlui).use(pcui);
  },
};
