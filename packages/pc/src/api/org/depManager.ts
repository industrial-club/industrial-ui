/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-04-05 10:23:24
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:55:24
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

const api = {
  /**
   * 查询组织树- 部门列表
   */
  getDepData: (url?: string) => (params: any) => {
    return instance.get(url ?? "/department/all", { params });
  },
  /**
   * 新增部门
   */
  insertDepRecord: (url?: string) => (data: any) => {
    return instance.post(url ?? "/department/add", data);
  },

  /**
   * 编辑部门
   */
  updateDepRecord: (url?: string) => (data: any) => {
    return instance.post(url ?? "/department/modify", data);
  },
  /**
   * 删除部门
   */
  deleteDepById: (url?: string) => (departmentId: number) => {
    return instance.get(`${url ?? "/department/remove/"}${departmentId}`);
  },
  /**
   * 获取部门下的员工下拉列表
   */
  getDepEmployeeSelectList:
    (url?: string) =>
    (departmentId: number, ruleType: 0 | 1 | 2 = 1) => {
      return instance.get(url ?? "/employee/all/summary", {
        params: { departmentId, ruleType },
      });
    },

  /**
   * 部门排序
   */
  sortDepList: (url?: string) => (data: any) => {
    return instance.post(url ?? "/department/sort/adjust", data);
  },

  /**
   * 查询部门详情
   */
  getDetail: (url?: string) => (params: any) => {
    return instance.get(`${url ?? "/department/detail/"}${params}`);
  },

  /* ====== 人员api ====== */
  /**
   * 获取部门下的员工列表
   */
  getEmployeeList: (url?: string) => (params: any) => {
    return instance.get(url ?? "/employee/all/page", { params });
  },
  /**
   * 获取岗位下拉列表
   */
  getPostList: (url?: string) => () => {
    return instance.get(url ?? "/jobPost/all/summary");
  },
  /**
   * 获取员工详细信息 查看/编辑 回显
   */
  getEmployeeDetail: (url?: string) => (employeeId: number) => {
    return instance.get(`${url ?? "/employee/detail/"}${employeeId}`);
  },
  /**
   * 新增员工
   */
  insetEmployee: (url?: string) => (data: any) => {
    return instance.post(url ?? "/employee/add", data);
  },
  /**
   * 修改员工信息
   */
  updateEmployee: (url?: string) => (data: any) => {
    return instance.post(url ?? "/employee/modify", data);
  },
  /**
   * 删除员工
   */
  deleteEmployeeById: (url?: string) => (employeeId: number) => {
    return instance.get(`${url ?? "/employee/remove/"}${employeeId}`);
  },
};

export default api;
