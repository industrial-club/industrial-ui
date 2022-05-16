// declare module "cssnano";
// declare module "acorn-jsx";
import Store from "../pageComponent/config/install";
import { instance } from "../pageComponent/api";

declare namespace InlPc {}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: typeof Store;
    $axios: typeof instance;
  }
}

declare global {
  interface Window {
    sid: string;
  }
}
