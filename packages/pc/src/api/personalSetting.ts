import { getInstance } from "@/api/axios";
import faceName from "@/api/faceName";

let instance = getInstance({ prefix: "/api/", serverName: faceName.common });

export function setInstance({
  serverName = faceName.common,
  prefix = "/api/",
}) {
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
    return instance.post(url ?? `/user/resetPassword`, data);
  },
  /**
   * 查询用户详情|个人设置页
   * userId 个人设置页 此值为null
   */
  detail: (url?: string) => (params: any) => {
    return instance.get(url ?? "/user/detail", { params });
  },
};
