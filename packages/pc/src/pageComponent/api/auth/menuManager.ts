/*
 * @Abstract: 权限管理-菜单管理
 * @Author: wang liang
 * @Date: 2022-03-31 15:40:05
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-26 15:45:58
 */

import { instance } from "../axios";

const api = {
  /**
   * 用户权限树- 以树状结构返回菜单项
   */
  getMenuTreeList: (url: string) => (params: any) => {
    return instance.get(url, { params });
  },
  /**
   * 添加菜单
   */
  insertMenuRecord: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 修改菜单
   */
  editMenuRecord: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 删除菜单
   */
  deleteMenuById: (url: string) => (menuId: number) => {
    return instance.get(`${url}${menuId}`);
  },
  /**
   * 菜单排序接口
   */
  sortMenu: (url: string) => (data: any) => {
    return instance.post(url, data);
  },
  /**
   * 上传JSON文件
   */
  uploadJSONFile: (url: string) => (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post(url, formData, {
      headers: { ContentType: "multipart/form-data" },
    });
  },
};

export default api;
