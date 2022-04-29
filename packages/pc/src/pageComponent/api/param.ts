/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-29 10:28:00
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 11:30:27
 */
import { instance } from './axios';

export const api = {
  /**
   * 查询参数组列表
   */
  getGroupList(data?: any) {
    return instance.post('/param/group/list', data);
  },
  /**
   * 查询参数定义、参数值列表 (表单项描述列表)
   */
  getParamDefineList(groupId: number) {
    return instance.get('/param/group/getDefineAndValueListByGroupId', {
      params: { groupId },
    });
  },
  /**
   * 批量保存参数值
   */
  batchSaveParamsValue(form: any[]) {
    return instance.post('/param/value/updateBatch', form);
  },
};

export default {
  api,
  instance,
};