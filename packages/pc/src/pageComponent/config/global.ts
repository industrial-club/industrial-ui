import { App } from 'vue';
// import VConsole from 'vconsole';
import vitevui from 'vitevui';
import vitevuu from 'vitevuu';
import * as Icons from '@ant-design/icons-vue';
import router from '@/router';
import 'vitevui/lib/style.css';
import '@/assets/styles/index.less';
import 'inl-ui/dist/antd.less';
import 'dayjs/locale/zh-cn';

export default (app: App): void => {
  app.config.globalProperties.$vitevuu = vitevuu;
  app.use(vitevui).use(router);

  for (const i in Icons) {
    app.component(i, Icons[i]);
  }
  // new VConsole();
};
