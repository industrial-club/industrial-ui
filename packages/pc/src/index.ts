import { App } from "vue";
import "./styles/index.less";
import { version } from "../package.json";
import components from "./components";
import pageComponents from "./pageComponent";
import utils from "./utils/publicUtil";
import { videoInfo } from "@/components/videoPlayer/util/interface";

const comps = [...pageComponents, ...components];

export { videoInfo };
export default {
  install(app: App) {
    for (let i of comps) {
      app.use(i);
    }
  },
  utils,
  version,
};
