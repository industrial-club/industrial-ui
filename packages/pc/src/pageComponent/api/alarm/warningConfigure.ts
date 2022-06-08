import { AxiosResponse } from "axios";
import { getInstance } from "@/api/axios";

const instance = getInstance({ prefix: "/api/", serverName: "alarmlite/v1" });

/**
 * 获取报警规则列表
 * @param obj {pageNum: 当前页, pageSize: 每页条数, name: 关键字}
 * @returns
 */
export const getAllRule: (obj: {
  pageNum: number;
  pageSize: number;
  name?: string;
  sort?: "desc";
}) => Promise<AxiosResponse<any>> = async (obj) => {
  const res = await instance.post<any>("/rule/getAllRule", obj);
  return res;
};

/**
 * 根据id获取一条规则详细信息
 * @param ruleId id
 * @returns
 */
export const getRuleConfigureById = (ruleId: string) =>
  instance.get(`/rule/getAlarmRule/${ruleId}`);

/**
 * 添加修改报警规则
 * @returns
 */
export const insertAlarmRule = async (obj) => {
  const res = await instance.post<boolean>("/rule/insertAlarmRule", obj);
  return res;
};
/**
 * 启用停用一个报警规则
 * @param ruleId 报警规则id
 * @returns
 */
export const updateAvailable: (
  ruleId: number,
  available: boolean
) => Promise<AxiosResponse<boolean>> = async (ruleId, available) => {
  const res = await instance.get<boolean>(
    `/rule/updateAvailable/${ruleId}?available=${available}`
  );
  return res;
};

/**
 * 删除一条报警规则
 * @param ruleId id
 * @returns
 */
export const deleteAlarmRule: (
  ruleId: number
) => Promise<AxiosResponse<boolean>> = async (ruleId) => {
  const res = await instance.post<boolean>(`/rule/deleteAlarmRule/${ruleId}`);
  return res;
};

/**
 * 批量上传报警
 */
export const batchUploadConfigure = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance.post("/rule/template/upload", formData);
};

// 获取系统列表
export const baseAll: () => Promise<AxiosResponse<any>> = async () => {
  const res = await instance.get<any>(
    "/thingmodel/v1/modelSystem/base/findById/1"
  );
  return res;
};

// 获取系统下的设备列表
export const getInstanceListBySystemId = (systemId: number) =>
  instance.get("/thingmodel/v1/support/instance/findInstanceBySystemId", {
    params: { systemId },
  });

// 根据设备获取信号
export const getPropertiesListByInstanceId = (instanceId: number) =>
  instance.get(
    "/thingmodel/v1/support/instanceProperties/findPropertiesByInstanceId",
    { params: { instanceId } }
  );

// 获取部门及人员树
export const getDepPeopleTreeList = (keyword?: string) =>
  instance.get("/department/all/tree/org/employee", {
    params: { keyword },
  });

// 获取下拉框数据
export const getEnum: (
  enumName: string
) => Promise<AxiosResponse<Array<any>>> = async (enumName) => {
  const res = await instance.get<Array<any>>(`/enum/${enumName}`);
  return res;
};
