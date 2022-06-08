/**
 * 视频联动
 */

import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const linkApi = {
  /**
   * 根据查询条件获取模式列表
   */
  getModeList(data: any) {
    return instance.post("/associated/getModeListByCondition", data);
  },
  /**
   * 获取拼接方式下拉框
   */
  getSplicingList() {
    return instance.get("/pollingSplicing/getList");
  },
  /**
   * 新建模式
   */
  insertMode(data: any) {
    return instance.post("/associated/createMode", data);
  },
  /**
   * 修改模式
   */
  updateMode(data: any) {
    return instance.post("/associated/updataMode", data);
  },
  /**
   * 获取模式记录详情
   */
  getModeDetail(id: number) {
    return instance.get("/associated/getModeById", { params: { id } });
  },
  /**
   * 删除模式记录
   */
  deleteModeById(id: number) {
    return instance.post("/associated/deleteMode", null, { params: { id } });
  },
};

export default linkApi;
