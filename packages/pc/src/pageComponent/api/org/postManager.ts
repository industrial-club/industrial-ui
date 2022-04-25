/*
 * @Abstract: 组织管理 - 岗位管理
 * @Author: wang liang
 * @Date: 2022-04-01 17:59:26
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-06 16:40:19
 */

import { instance } from '../axios';

const api = {
  /**
   * 获取岗位列表
   */
  getPostList(params: any) {
    return instance.get('/jobPost/all/page', { params });
  },
  /**
   * 切换岗位启用状态
   */
  switchPostEnable(data: { id: number; valid: 0 | 1 }) {
    return instance.post('/jobPost/modify', data);
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
   * 修改岗位信息
   */
  updatePostRecord(data: any) {
    return instance.post('/jobPost/modify', data);
  },
  /**
   * 新增岗位信息
   */
  insertPostRecord(data: any) {
    return instance.post('/jobPost/add', data);
  },
  /**
   * 删除一条岗位信息
   */
  deletePostById(jobPostId: number) {
    return instance.get(`/jobPost/remove/${jobPostId}`);
  },
};

export default api;
