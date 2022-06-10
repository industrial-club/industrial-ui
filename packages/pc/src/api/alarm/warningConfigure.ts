import { getInstance } from "@/api/axios";
import faceName from "@/api/faceName";

let instance = getInstance({ prefix: "/api/", serverName: "alarmlite/v1" });

export function setInstance({ serverName = "alarmlite/v1", prefix = "/api/" }) {
  instance = getInstance({ prefix, serverName });
}

/**
 * 获取报警规则列表
 * @param obj {pageNum: 当前页, pageSize: 每页条数, name: 关键字}
 * @returns
 */
export const getAllRule = (url: string) => async (obj) => {
  const res = await instance.post<any>(url ?? "/rule/getAllRule", obj);
  return res;
};

/**
 * 根据id获取一条规则详细信息
 * @param ruleId id
 * @returns
 */
export const getRuleConfigureById = (url: string) => (ruleId: string) =>
  instance.get(`${url ?? "/rule/getAlarmRule/"}${ruleId}`);

/**
 * 添加修改报警规则
 * @returns
 */
export const insertAlarmRule = (url: string) => async (obj) => {
  const res = await instance.post<boolean>(url ?? "/rule/insertAlarmRule", obj);
  return res;
};
/**
 * 启用停用一个报警规则
 * @param ruleId 报警规则id
 * @returns
 */
export const updateAvailable = (url: string) => async (ruleId, available) => {
  const res = await instance.get<boolean>(
    `${url ?? "/rule/updateAvailable/"}${ruleId}?available=${available}`
  );
  return res;
};

/**
 * 删除一条报警规则
 * @param ruleId id
 * @returns
 */
export const deleteAlarmRule = (url: string) => async (ruleId) => {
  const res = await instance.post<boolean>(
    `${url ?? "/rule/deleteAlarmRule/"}${ruleId}`
  );
  return res;
};

/**
 * 批量上传报警
 */
export const batchUploadConfigure = (url: string) => (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance.post(url ?? "/rule/template/upload", formData);
};

// 获取系统列表
export const baseAll = (url: string) => async () => {
  const res = await instance.post<any>(
    url ?? "/modelSystem/base/findAll",
    { pageSize: -1, pageNum: 1 },
    {
      baseURL: "/api/thingmodel/v1",
    }
  );
  return res;
};

// 获取系统下的设备列表
export const getInstanceListBySystemId = (url: string) => (systemId: number) =>
  instance.get(url ?? "/support/instance/findInstanceBySystemId", {
    baseURL: "/api/thingmodel/v1",
    params: { systemId },
  });

// 根据设备获取信号
export const getPropertiesListByInstanceId =
  (url: string) => (instanceId: number) =>
    instance.get(
      url ?? "/support/instanceProperties/findPropertiesByInstanceId",
      { baseURL: "/api/thingmodel/v1", params: { instanceId } }
    );

// 获取部门及人员树
export const getDepPeopleTreeList = (url: string) => (keyword?: string) =>
  instance.get(url ?? "/department/all/tree/org/employee", {
    baseURL: `/api/${faceName.common}`,
    params: { keyword },
  });

// 获取下拉框数据
export const getEnum = (url: string) => async (enumName) => {
  const res = await instance.get<Array<any>>(`${url ?? "/enum/"}${enumName}`);
  return res;
};
