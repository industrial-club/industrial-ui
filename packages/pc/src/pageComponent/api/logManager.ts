import { instance } from './axios';

const api = {
  /**
   *分页查询日志
   */
  getList(params: any) {
    return instance.post('/log/list', params);
  },
  /**
   *查询日志标题
   */
  getHead(params: any) {
    return instance.get('/log/head', { params });
  },
};

export default api;
