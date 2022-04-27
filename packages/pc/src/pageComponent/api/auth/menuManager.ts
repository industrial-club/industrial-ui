/*
 * @Abstract: 权限管理-菜单管理
 * @Author: wang liang
 * @Date: 2022-03-31 15:40:05
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-20 11:45:57
 */

import { instance } from '../axios';

const api = {
  /**
   * 用户权限树- 以树状结构返回菜单项
   */
  getMenuTreeList(params: any) {
    return instance.get('/menu/all', { params });
  },
  /**
   * 添加菜单
   */
  insertMenuRecord(data: any) {
    return instance.post('/menu/add', data);
  },
  /**
   * 修改菜单
   */
  editMenuRecord(data: any) {
    return instance.post('/menu/modify', data);
  },
  /**
   * 删除菜单
   */
  deleteMenuById(menuId: number) {
    return instance.get(`/menu/delete/${menuId}`);
  },
  /**
   * 菜单排序接口
   */
  sortMenu(data: any) {
    return instance.post('/menu/sort/adjust', data);
  },
};

export default api;
