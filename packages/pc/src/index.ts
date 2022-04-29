import { App } from "vue";
import "./styles/index.less";
import { version } from "../package.json";
import components from "./components";
import pageComponents from "@/pageComponent";

const comps = [...pageComponents, ...components];
export default {
  install(app: App) {
    for (let i of comps) {
      app.use(i);
    }
  },
  version,
};
