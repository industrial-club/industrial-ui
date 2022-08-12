import { App } from "vue";
import "./style/index.less";
import { version } from "../package.json";
import cards from "./cardList";
import Layout from "./layout";
import CardBox from "./components/cardBox";
import { installCom } from "./utils";

interface ListTpye {
  name: string;
  cname: string;
}

const cardList: Array<ListTpye> = [];
const coms: Array<any> = [];

const createComp = () => {
  coms.push(installCom(Layout, "layout"));
  coms.push(installCom(CardBox, "box"));
  for (let i of cards) {
    const com = installCom(i, i.name);
    coms.push(com);
    cardList.push({
      name: i.name,
      cname: i.cname,
    });
  }
};
createComp();

export default {
  install(app: App) {
    for (let i of coms) {
      app.use(i);
    }
  },
  cards: cardList,
  version,
};
