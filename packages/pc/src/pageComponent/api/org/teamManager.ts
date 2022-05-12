/*
 * @Abstract: 系统管理-组织管理-班组管理
 * @Author: wang liang
 * @Date: 2022-04-02 09:33:09
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 11:04:56
 */

import { instance } from "../axios";

const api = {
  /**
   * 分页获取班组列表
   */
  getTeamListByPage: (url: string) => (params: any) => {
    return instance.get(url, { params });
  },
  /**
   * 切换是否启用班组
   */
  switchEnableTeam: (url: string) => (data: { id: number; valid: 0 | 1 }) => {
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
   * 获取岗位下拉列表
   */
  getPostList: (url: string) => (params: any) => {
    return instance.get(url, { params });
  },
  /**
   * 获取人员列表 (下拉框)
   */
  getEmployeeList: (url: string) => (depId: number) => {
    return instance.get(url, {
      params: { departmentId: depId },
    });
  },
  /**
   * 修改班组
   */
  edidTeamRecord: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 新增班组
   */
  insertTeam: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 删除班组
   */
  deleteTeamById: (url: string) => (id: number) => {
    return instance.get(`${url}${id}`);
  },
};

export default api;
