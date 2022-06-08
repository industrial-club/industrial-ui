import { App } from "vue";
import "./styles/index.less";
import { version } from "../package.json";
import components from "./components";
import pageComponents from "@/pageComponent";
import changeTheme from "@/utils/changeTheme";

const comps = [...pageComponents, ...components];
export default {
  install(app: App) {
    for (let i of comps) {
      app.use(i);
    }
  },
  utils: {
    changeTheme,
  },
  version,
};
