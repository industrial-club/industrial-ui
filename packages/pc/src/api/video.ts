import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

api.setDirection = async ({ uuid, direction }: any) => {
  return instance.get("/control/hik/control", {
    params: {
      cameraUuid: uuid,
      command: direction,
    },
  });
};
api.getVideoList = async (params: any) => {
  return instance.get("/camera/search", {
    params: {
      ...params,
      nameStr: params.nameStr,
      ipStr: params.ipStr,
      pageNum: params.pageNo,
    },
  });
};
api.getNvrList = async (params: any) => {
  return instance.get("/nvr/search", {
    params: {
      ...params,
      name: params.name,
      ip: params.ip,
      pageNum: params.pageNo,
    },
  });
};
api.getErrList = async () => {
  return instance.get("/control/diagnosis", {});
};
api.repair = async (uuid: string) => {
  return instance.get(`/control/repairCameraByUUid?uuid=${uuid}`);
};
api.repairAll = async () => {
  return instance.get("/control/repairCamera");
};

api.saveVideo = async (param: any) => {
  return instance.post("/camera/save", param);
};
api.saveNvr = async (param: any) => {
  return instance.post("/nvr/save", param);
};
api.deleteVideo = async (params: any) => {
  return instance.get("/camera/deleteById", { params: { id: params.id } });
};
api.deleteNvr = async (params: any) => {
  return instance.get("/nvr/deleteById", { params: { id: params.id } });
};
api.findByProdType = async (params: any) => {
  return instance.get("/brandType/findByProdType", {
    params: { prodType: params },
  });
};
api.release = async () => {
  return instance.get("/mediaServer/findAll");
};
api.getMediaAll = async () => {
  return instance.get("/mediaServer/findAll");
};
api.getNvrAll = async () => {
  return instance.get("/nvr/findAll");
};
api.getHaikang = async () => {
  return instance.get("/camera/searchFromHikPlatform");
};
api.getGroup = async () => {
  return instance.get("/cameraGroupType/findAll", {
    // params: { uuid: params ? params.uuid : '' },
  });
};
api.getQueryGroup = async (params: any) => {
  return instance.get("/cameraGroup/tree", {
    params: { groupTypeUuid: params.uuid },
  });
};
api.saveGroupTabs = async (param: any) => {
  return instance.post("/cameraGroupType/save", param);
};
api.deleteGroupId = async (id: any) => {
  return instance.get("/cameraGroupType/deleteById", {
    params: { id },
  });
};
api.saveGroup = async (param: any) => {
  return instance.post("/cameraGroup/saveGroup", param);
};
api.deleteGroup = async (uuid: any) => {
  return instance.post(`/cameraGroup/deleteGroup?uuid=${uuid}`);
};
api.saveCamera = async (param: any) => {
  return instance.post("/cameraGroup/saveCamera", param);
};
api.delGroupRelCamera = async (param: any) => {
  return instance.get("/cameraGroup/delGroupRelCamera", {
    params: { ...param },
  });
};
api.queryGroup = async (uuid: any) => {
  return instance.get("/cameraGroup/queryGroup", {
    params: { uuid },
  });
};
api.getCameraByUuid = async (uuid: any) => {
  return instance.get("/camera/getByUuid", {
    params: { uuid },
  });
};
api.cameraExport = async (param: any) => {
  return instance.post("/camera/export", param, {
    responseType: "blob",
    headers: {
      "Content-Disposition": "attachment",
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
};
api.cameraExportAll = async (param: any) => {
  return instance.get("/camera/exportAll", {
    responseType: "blob",
    headers: {
      "Content-Disposition": "attachment",
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
};
api.cameraImport = async (param: any) => {
  return instance.post("/camera/import", param);
};

api.requestRecords = async (param: any) => {
  return instance.post("/recorder/requestRecords", param);
};

api.getConcern = async () => {
  return instance.get("/concern/search", {});
};
api.deleteConcernCamera = async (id: any) => {
  return instance.get("/concernCamera/delete", { params: { id } });
};
api.saveConcern = async (param: any) => {
  return instance.post("/concern/save", param);
};
api.deleteConcern = async (id: any) => {
  return instance.get("/concern/delete", { params: { id } });
};
api.addConcern = async (param: any) => {
  return instance.post("/concernCamera/addConcern", param);
};
api.gzUpdateSort = async (params: any) => {
  return instance.get("/concern/updateSort", {
    params: {
      ...params,
    },
  });
};
export default api;
