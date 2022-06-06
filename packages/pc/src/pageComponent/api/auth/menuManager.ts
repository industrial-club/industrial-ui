/*
 * @Abstract: 权限管理-菜单管理
 * @Author: wang liang
 * @Date: 2022-03-31 15:40:05
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-26 15:45:58
 */

import { getInstance } from "../axios";

let instance = getInstance("/api/");

export function setInstance(baseURL: string) {
  instance = getInstance(baseURL);
}

const api = {
  /**
   * 用户权限树- 以树状结构返回菜单项
   */
  getMenuTreeList: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/menu/all", { params });
  },
  /**
   * 添加菜单
   */
  insertMenuRecord: (url?: string) => (data: any) => {
    return instance.post(url ?? "/comlite/v1/menu/add", data);
  },
  /**
   * 修改菜单
   */
  editMenuRecord: (url?: string) => (data: any) => {
    return instance.post(url ?? "/comlite/v1/menu/modify", data);
  },
  /**
   * 删除菜单
   */
  deleteMenuById: (url?: string) => (menuId: number) => {
    return instance.get(`${url ?? "/comlite/v1/menu/delete/"}${menuId}`);
  },
  /**
   * 菜单排序接口
   */
  sortMenu: (url?: string) => (data: any) => {
    return instance.post(url ?? "/comlite/v1/menu/sort/adjust", data);
  },
  /**
   * 上传JSON文件
   */
  uploadJSONFile: (url?: string) => (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post(url ?? "/comlite/v1/menu/json/upload", formData, {
      headers: { ContentType: "multipart/form-data" },
    });
  },
};

export default api;
