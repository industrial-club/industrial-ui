import { instance } from "./axios";

const api = {
  /**
   *分页查询日志
   */
  getList: (url: string) => (params: any) => {
    return instance.post(url, params);
  },
  /**
   *查询日志标题
   */
  getHead: (url: string) => (params: any) => {
    return instance.get(url, { params });
  },
};

export default api;
