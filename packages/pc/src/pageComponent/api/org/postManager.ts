/*
 * @Abstract: 组织管理 - 岗位管理
 * @Author: wang liang
 * @Date: 2022-04-01 17:59:26
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-06 16:40:19
 */

import { instance } from "../axios";

const api = {
  /**
   * 获取岗位列表
   */
  getPostList: (url: string) => (params: any) => {
    return instance.get(url, { params });
  },
  /**
   * 切换岗位启用状态
   */
  switchPostEnable: (url: string) => (data: { id: number; valid: 0 | 1 }) => {
    return instance.post(url, data);
  },
  /**
   * 获取部门列表(添加、编辑 部门下拉框)
   */
  getDepList: (url: string) => async () => {
    const { data } = await instance.get(url, {
      params: { orgId: 1 },
    });
    return data.departmentList ?? [];
  },
  /**
   * 修改岗位信息
   */
  updatePostRecord: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 新增岗位信息
   */
  insertPostRecord: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 删除一条岗位信息
   */
  deletePostById: (url: string) => (jobPostId: number) => {
    return instance.get(`${url}${jobPostId}`);
  },
};

export default api;
