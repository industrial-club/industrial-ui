import { getInstance } from "@/api/axios";

let instance = getInstance({ prefix: "/api/", serverName: "comlite/v1" });

export function setInstance({ serverName = "comlite/v1", prefix = "/api/" }) {
  instance = getInstance({ prefix, serverName });
}

export default {
  /**
   * 修改用户
   */
  editUserRecord: (url?: string) => (data: any) => {
    return instance.put(url ?? "/user/updateUser", data);
  },
  /**
   * 个人设置 修改密码
   */
  changePassword: (url?: string) => (data: any) => {
    return instance.post(url ?? "/comlite/v1/user/resetPassword", data);
  },
  /**
   * 查询用户详情|个人设置页
   * userId 个人设置页 此值为null
   */
  detail: (url?: string) => (params: any) => {
    return instance.get(url ?? "/user/detail", { params });
  },
};
