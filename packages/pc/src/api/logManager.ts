import { getInstance } from "@/api/axios";
import faceName from "@/api/faceName";

let instance = getInstance({ prefix: "/api/", serverName: faceName.common });

export function setInstance({
  serverName = faceName.common,
  prefix = "/api/",
}) {
  instance = getInstance({ prefix, serverName });
}

const api = {
  /**
   *分页查询日志
   */
  getList: (url?: string) => (params: any) => {
    return instance.post(url ?? "/log/list", params);
  },
  /**
   *查询日志标题
   */
  getHead: (url?: string) => () => {
    return instance.get(url ?? "/log/head");
  },
};

export default api;
