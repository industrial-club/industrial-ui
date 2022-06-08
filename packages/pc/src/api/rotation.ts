import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

api.getList = async () => {
  return instance.get("/pollingGroup/getList");
};

api.save = async (params: any) => {
  return instance.post("/pollingGroup/save", params);
};

api.delete = async (params: any) => {
  return instance.get("/pollingGroup/delete", {
    params: {
      ...params,
    },
  });
};

api.updateStatus = async (params: any) => {
  return instance.get("/pollingGroup/updateStatus", {
    params: {
      ...params,
    },
  });
};

api.getSort = async () => {
  return instance.get("/pollingSplicing/getList");
};

api.updateSort = async (params: any) => {
  return instance.get("/pollingGroup/updateSort", {
    params: {
      ...params,
    },
  });
};

export default api;
