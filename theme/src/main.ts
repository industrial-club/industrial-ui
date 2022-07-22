import { createApp } from "vue";
import "ant-design-vue/dist/antd.less";
import router from "./router";
import lay from "./Layouts";
import antv from "ant-design-vue";
import ui from "../../packages/pc";
import inlCard from "../../packages/cards";
import "../../packages/pc/dist/style.css";
import "../../packages/cards/dist/style.css";
import "./assets/test.less";

console.log(inlCard);

const app = createApp(lay);
app.use(antv).use(inlCard).use(ui).use(router).mount("#app");
