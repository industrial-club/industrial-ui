import { getInstance } from "./axios";

let instance = getInstance("/api/");

export function setInstance(baseURL: string) {
  instance = getInstance(baseURL);
}

const api = {
  /**
   *分页查询日志
   */
  getList: (url?: string) => (params: any) => {
    return instance.post(url ?? "/comlite/v1/log/list", params);
  },
  /**
   *查询日志标题
   */
  getHead: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/log/head", { params });
  },
};

export default api;
