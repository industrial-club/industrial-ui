/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-29 10:28:00
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 11:30:27
 */
import { getInstance } from "@/api/axios";
import faceName from "@/api/faceName";

let instance = getInstance({ prefix: "/api/", serverName: faceName.common });

export function setInstance({
  serverName = faceName.common,
  prefix = "/api/",
}) {
  instance = getInstance({ prefix, serverName });
}

export const api = {
  /**
   * 查询参数组列表
   */
  getGroupList: (url?: string) => (data?: any) => {
    return instance.post(url ?? "/param/group/list", data);
  },
  /**
   * 查询参数定义、参数值列表 (表单项描述列表)
   */
  getParamDefineList: (url?: string) => (groupId: string) => {
    return instance.get(url ?? "/param/group/getDefineAndValueListByGroupId", {
      params: { groupId },
    });
  },
  /**
   * 批量保存参数值
   */
  batchSaveParamsValue: (url?: string) => (form: any[]) => {
    return instance.post(url ?? "/param/value/updateBatch", form);
  },
};

export default {
  api,
  instance,
};
