import { createApp } from "vue";
import "ant-design-vue/dist/antd.less";
import antv from "ant-design-vue";
import "../src/theme/dark.less";
import router from "./router";
import lay from "./Layouts";

const app = createApp(lay);
app.use(antv).use(router).mount("#app");
