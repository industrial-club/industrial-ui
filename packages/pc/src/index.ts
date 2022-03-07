import { App } from "vue";
import "inl-less/index.less";
import "./styles/index.less";
import { version } from "../package.json";
import components from "./components";

export default {
  install(app: App) {
    for (let i of components) {
      app.use(i);
    }
  },
  version,
};
