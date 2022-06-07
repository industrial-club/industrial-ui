import { App } from "vue";
import * as Icons from "@ant-design/icons-vue";
import "vitevui/lib/style.css";
import "@/assets/styles/index.less";
import "inl-ui/dist/antd.less";
import "dayjs/locale/zh-cn";

export default (app: App): void => {
  for (const i in Icons) {
    app.component(i, Icons[i]);
  }
};
