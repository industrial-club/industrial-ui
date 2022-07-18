import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

api.findAll = async () => {
  return instance.get("/mediaServer/findAll");
};

api.save = async (param: any) => {
  return instance.post("/mediaServer/save", param);
};

api.deleteById = async (param: any) => {
  return instance.get("/mediaServer/deleteById", {
    params: {
      ...param,
    },
  });
};

/* 相机权限管理 */

// 获取角色列表
api.getRoleList = () => instance.get("/permission/getRoleList");

// 获取权限列表
api.getRolePermission = (id: number) =>
  instance.get("/permission/queryList", { params: { roleList: `${id}` } });

// 设置角色可访问的相机
api.setRolePermission = (roleId: number, cameraUuidList: string[]) =>
  instance.post("/permission/updateByRole", { roleId, cameraUuidList });

export default api;
