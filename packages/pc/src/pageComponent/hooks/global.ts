/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getCurrentInstance } from "vue";

export default () => {
  const { proxy } = getCurrentInstance()! as any;
  return {
    store: proxy!.$store,
    vitevuu: proxy!.$vitevuu,
    axios: proxy!.$axios,
  };
};
