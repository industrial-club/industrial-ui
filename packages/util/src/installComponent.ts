import { App, DefineComponent, Plugin } from "vue";

import conf from "./config";

const { prefix } = conf;

export default (component: DefineComponent | any, name: string): Plugin => {
  component.install = (app: App) => {
    app.component(`${prefix}-${name}`, component);
  };
  return component as Plugin;
};
