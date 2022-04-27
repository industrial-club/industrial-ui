/*
 * @Abstract: 权限管理-角色管理
 * @Author: wang liang
 * @Date: 2022-03-31 11:52:26
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 16:00:59
 */

import { instance } from '../axios';

const api = {
  /**
   * 获取角色列表
   */
  getRoleListByPager(params: any) {
    return instance.get('/role/all/page', { params });
  },
  /**
   * 切换角色启用状态
   */
  switchRoleEnableStatus(params: any) {
    return instance.get('/role/roleEnabe', { params });
  },
  /**
   * 保存角色及权限树
   */
  insertRole(params: any) {
    return instance.post('/role/insertRole', params);
  },
  /**
   * 获取角色权限树- 编辑角色
   */
  getRoleTreeEdit(params: any) {
    return instance.get('/role/getRoleTreeEdit', { params });
  },
  /**
   * 获取角色权限树- 新建角色
   */
  getRoleTree() {
    return instance.get('/role/getRoleTree');
  },
  /**
   * 删除角色
   */
  deleteRoleById(roleTypeId: number) {
    return instance.get('/role/deleteRoleType', { params: { roleTypeId } });
  },
};

export default api;
