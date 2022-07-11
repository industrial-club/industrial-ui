import { getInstance } from "./axios";

let instance = getInstance({ serverName: "notification/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const noticeCenterApi = {
  /**
   * 字典查询
   */
  getEnumList(enumName) {
    return instance.get(`/enum/${enumName}`);
  },

  /**
   * 获取通道列表
   */
  getChannelList() {
    return instance.get("/channel/list");
  },

  /**
   * 新增通道
   */
  getChannelAdd(data) {
    return instance.post("/channel/add", data);
  },

  /**
   * 更新通道
   */
  getChannelUpdate(data) {
    return instance.post("/channel/update", data);
  },

  /**
   * 获取通道详情信息
   */
  getChannelDetail(id) {
    return instance.get(`/channel/detail?channelId=${id}`);
  },

  /**
   * 新增通道详情信息
   */
  getChannelDetailAdd(data) {
    return instance.post(`/channel/detail/add`, data);
  },

  /**
   * 获取模板
   */
  getChannelTemplateList(data) {
    return instance.post(`/channel/template/list`, data);
  },

  /**
   * 新增模板
   */
  getChannelTemplateAdd(data) {
    return instance.post(`/channel/template/add`, data);
  },

  /**
   * 删除模板
   */
  getChannelTemplateDelete(id) {
    return instance.post(`/channel/template/delete?id=${id}`);
  },
};

export default noticeCenterApi;
