import { App } from "vue";
import "./styles/index.less";
import { version } from "../package.json";
import components from "./components";
import pageComponents from "@/pageComponent";
import utils from "@/utils/publicUtil";

const comps = [...pageComponents, ...components];

// utils.setRem({
//   fontSize: 14,
//   designSize: 1920,
// });

// window.onresize = () => {
//   utils.setRem({
//     fontSize: 14,
//     designSize: 1920,
//   });
// };

export default {
  install(app: App) {
    for (let i of comps) {
      app.use(i);
    }
  },
  utils,
  version,
};
