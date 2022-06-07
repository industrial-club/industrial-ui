import { createApp } from "vue";
import "ant-design-vue/dist/antd.less";
import router from "./router";
import lay from "./Layouts";
import antv from "ant-design-vue";

import "../../packages/pc/dist/style.css";

const app = createApp(lay);
app.use(antv).use(router).mount("#app");
