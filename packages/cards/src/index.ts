import { App } from "vue";
import "./style/index.less";
import { version } from "../package.json";

const comps = [];
const cardList = [];

const useComp = (app: App) => {
  for (let i of comps) {
    app.use(i);
  }
};

export default {
  install(app: App) {
    useComp(app);
  },
  cards: cardList,
  version,
};
