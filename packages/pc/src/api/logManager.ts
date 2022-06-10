import { getInstance } from "@/api/axios";

let instance = getInstance({ prefix: "/api/", serverName: "comlite/v1" });

export function setInstance({ serverName = "comlite/v1", prefix = "/api/" }) {
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
