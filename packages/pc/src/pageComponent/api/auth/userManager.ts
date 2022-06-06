import { getInstance } from "../axios";

let instance = getInstance("/api/");

export function setInstance(baseURL: string) {
  instance = getInstance(baseURL);
}

export default {
  /**
   * 获取用户列表 分页
   */
  getUserList: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/user/managerList", { params });
  },
  /**
   * 获取角色下拉列表
   */
  getRoleList: (url?: string) => () => {
    return instance.get(url ?? "/comlite/v1/role/list");
  },
  /**
   * 获取员工下拉列表
   */
  getEmployeeList: (url?: string) => () => {
    return instance.get(url ?? "/comlite/v1/employee/all/summary");
  },
  /**
   * 新增用户
   */
  insertOneUserRecord: (url?: string) => (data: any) => {
    return instance.post(url ?? "/comlite/v1/user/create", data);
  },
  /**
   * 修改用户
   */
  editUserRecord: (url?: string) => (data: any) => {
    return instance.put(url ?? "/comlite/v1/user/updateUser", data);
  },
  /**
   * 编辑页面重置密码
   * @param userId 用户id
   */
  resetPassword: (url?: string) => (userId: number) => {
    return instance.post(url ?? "/comlite/v1/user/resetPasswordForManager", {
      userId,
    });
  },
  /**
   * 个人设置 修改密码
   */
  // changePassword: (url?: string) => (data: any) => {
  //   return instance.post(url, data);
  // },
  /**
   * 查询用户详情|个人设置页
   * userId 个人设置页 此值为null
   */
  detail: (url?: string) => (params: any) => {
    return instance.get(url ?? "/comlite/v1/user/detail", { params });
  },
  /**
   * 删除用户
   */
  deleteUserById: (url?: string) => (id: string) => {
    return instance.delete(`${url ?? "/comlite/v1/user/delete/"}${id}`);
  },
  /**
   * 获取员工详情 (点击员工姓名)
   */
  getEmployeeDetailInfo: (url?: string) => (employeeId: number) => {
    return instance.get(
      `${url ?? "/comlite/v1/employee/detail/"}${employeeId}`
    );
  },
};
