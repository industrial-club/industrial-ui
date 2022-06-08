import { createApp } from "vue";
import "ant-design-vue/dist/antd.less";
import router from "./router";
import lay from "./Layouts";
import antv from "ant-design-vue";
import ui from "../../packages/pc";

import "../../packages/pc/dist/style.css";

const app = createApp(lay);
app.use(antv).use(ui).use(router).mount("#app");
