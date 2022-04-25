/*
 * @Abstract: 用户管理 api
 * @Author: wang liang
 * @Date: 2022-03-30 17:05:32
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-19 13:13:33
 */

import { instance } from '../axios';

export default {
  /**
   * 获取用户列表 分页
   */
  getUserList(params: any) {
    return instance.get('/user/managerList', { params });
  },
  /**
   * 获取角色下拉列表
   */
  getRoleList() {
    return instance.get('/role/list');
  },
  /**
   * 获取员工下拉列表
   */
  getEmployeeList() {
    return instance.get('/employee/all/summary');
  },
  /**
   * 新增用户
   */
  insertOneUserRecord(data: any) {
    return instance.post('/user/create', data);
  },
  /**
   * 修改用户
   */
  editUserRecord(data: any) {
    return instance.put('user/updateUser', data);
  },
  /**
   * 编辑页面重置密码
   * @param userId 用户id
   */
  resetPassword(userId: number) {
    return instance.post('/user/resetPasswordForManager', { userId });
  },
  /**
   * 个人设置 修改密码
   */
  changePassword(data: any) {
    return instance.post('/user/resetPassword', data);
  },
  /**
   * 查询用户详情|个人设置页
   * userId 个人设置页 此值为null
   */
  detail(data: any) {
    return instance.get('/user/detail', { data });
  },
  /**
   * 删除用户
   */
  deleteUserById(id: string) {
    return instance.delete(`/user/delete/${id}`);
  },
  /**
   * 获取员工详情 (点击员工姓名)
   */
  getEmployeeDetailInfo(employeeId: number) {
    return instance.get(`/employee/detail/${employeeId}`, {
      params: { employeeId },
    });
  },
};
