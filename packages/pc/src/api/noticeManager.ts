import { getInstance } from "./axios";

let instance = getInstance({ serverName: "notification/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const noticeManagerApi = {
  /**
   * 通知记录列表
   */
  getRecordList(data) {
    return instance.post(`/record/list`, data);
  },

  /**
   * 重发消息给指定用户
   */
  resendTouser(data) {
    return instance.post(`/resend/touser`, data);
  },

  /**
   * 重发消息
   */
  resend(data) {
    return instance.post(`/resend`, data);
  },

  /**
   * 发送消息
   */
  sendMessage(data) {
    return instance.post(`/sendMessage`, data);
  },

  /**
   * 删除消息
   */
  recordDelete(id) {
    return instance.post(`/record/delete?recordId=${id}`);
  },

  /**
   * 根据id查记录详情
   */
  recordId(id) {
    return instance.get(`record/${id}`);
  },
};

export default noticeManagerApi;
