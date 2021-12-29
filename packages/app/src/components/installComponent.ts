import { App, DefineComponent } from "vue";

export default (component: DefineComponent | any, name: string) => {
  component.install = (app: App) => {
    app.component(name, component);
  };
  return component;
};
