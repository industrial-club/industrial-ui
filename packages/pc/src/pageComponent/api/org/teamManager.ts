/*
 * @Abstract: 系统管理-组织管理-班组管理
 * @Author: wang liang
 * @Date: 2022-04-02 09:33:09
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 11:04:56
 */

import { instance } from '../axios';

const api = {
  /**
   * 分页获取班组列表
   */
  getTeamListByPage(params: any) {
    return instance.get('/workgroup/all/page', { params });
  },
  /**
   * 切换是否启用班组
   */
  switchEnableTeam(data: { id: number; valid: 0 | 1 }) {
    return instance.post('/workgroup/modify', data);
  },
  /**
   * 获取部门列表(添加、编辑 部门下拉框)
   */
  async getDepList() {
    const { data } = await instance.get('/department/all', {
      params: { orgId: 1 },
    });
    return data.departmentList ?? [];
  },
  /**
   * 获取岗位下拉列表
   */
  getPostList(params: any) {
    return instance.get('/jobPost/all/summary', { params });
  },
  /**
   * 获取人员列表 (下拉框)
   */
  getEmployeeList(depId: number) {
    return instance.get('/employee/all/summary', {
      params: { departmentId: depId },
    });
  },
  /**
   * 修改班组
   */
  edidTeamRecord(data: any) {
    return instance.post('/workgroup/modify', data);
  },
  /**
   * 新增班组
   */
  insertTeam(data: any) {
    return instance.post('/workgroup/add', data);
  },
  /**
   * 删除班组
   */
  deleteTeamById(id: number) {
    return instance.get(`/workgroup/remove/${id}`);
  },
};

export default api;
