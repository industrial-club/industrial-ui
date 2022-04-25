/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-04-05 10:23:24
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:55:24
 */
import { instance } from '../axios';

const api = {
  /**
   * 查询组织树- 部门列表
   */
  getDepData(params: any) {
    return instance.get('/department/all', { params });
  },
  /**
   * 新增部门
   */
  insertDepRecord(data: any) {
    return instance.post('/department/add', data);
  },

  /**
   * 编辑部门
   */
  updateDepRecord(data: any) {
    return instance.post('/department/modify', data);
  },
  /**
   * 删除部门
   */
  deleteDepById(departmentId: number) {
    return instance.get(`/department/remove/${departmentId}`);
  },
  /**
   * 获取部门下的员工下拉列表
   */
  getDepEmployeeSelectList(departmentId: number, ruleType: 0 | 1 | 2 = 1) {
    return instance.get('/employee/all/summary', {
      params: { departmentId, ruleType },
    });
  },

  /**
   * 部门排序
   */
  sortDepList(data: any) {
    return instance.post('/department/sort/adjust', data);
  },

  /**
   * 查询部门详情
   */
  getDetail(params: any) {
    return instance.get(`/department/detail/${params}`);
  },

  /* ====== 人员api ====== */
  /**
   * 获取部门下的员工列表
   */
  getEmployeeList(params: any) {
    return instance.get('/employee/all/page', { params });
  },
  /**
   * 获取岗位下拉列表
   */
  getPostList() {
    return instance.get('/jobPost/all/summary');
  },
  /**
   * 获取员工详细信息 查看/编辑 回显
   */
  getEmployeeDetail(employeeId: number) {
    return instance.get(`/employee/detail/${employeeId}`);
  },
  /**
   * 新增员工
   */
  insetEmployee(data: any) {
    return instance.post('/employee/add', data);
  },
  /**
   * 修改员工信息
   */
  updateEmployee(data: any) {
    return instance.post('/employee/modify', data);
  },
  /**
   * 删除员工
   */
  deleteEmployeeById(employeeId: number) {
    return instance.get(`/employee/remove/${employeeId}`);
  },
};

export default api;
