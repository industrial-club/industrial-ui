/*
 * @Abstract: 权限管理-角色管理
 * @Author: wang liang
 * @Date: 2022-03-31 11:52:26
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 16:00:59
 */

import { getInstance } from "../axios";

let instance = getInstance("/api/");

export function setInstance(baseURL: string) {
  instance = getInstance(baseURL);
}

const api = {
  /**
   * 获取角色列表
   */
  getRoleListByPager: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/role/all/page", { params });
  },
  /**
   * 切换角色启用状态
   */
  switchRoleEnableStatus: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/role/roleEnabe", { params });
  },
  /**
   * 保存角色及权限树
   */
  insertRole: (url?: string) => (params: any) => {
    return instance.post(url ?? "/comlite/v1/role/insertRole", params);
  },
  /**
   * 获取角色权限树- 编辑角色
   */
  getRoleTreeEdit: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/role/getRoleTreeEdit", { params });
  },
  /**
   * 获取角色权限树- 新建角色
   */
  getRoleTree: (url?: string) => () => {
    return instance.get(url ?? "/comlite/v1/role/getRoleTree");
  },
  /**
   * 删除角色
   */
  deleteRoleById: (url?: string) => (roleTypeId: number) => {
    return instance.get(url ?? "/comlite/v1/role/deleteRoleType", {
      params: { roleTypeId },
    });
  },
};

export default api;
