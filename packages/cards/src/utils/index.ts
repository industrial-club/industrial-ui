import { App, DefineComponent, Plugin } from "vue";
import { prefix } from "../config";

export const installCom = (
  component: DefineComponent | any,
  name: string
): Plugin => {
  component.install = (app: App) => {
    app.component(`${prefix}-${name}`, component);
  };
  return component as Plugin;
};

export default { installCom };
