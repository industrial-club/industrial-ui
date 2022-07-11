import { getInstance } from "./axios";

let instance = getInstance({ serverName: "spms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

/**
 *配电室列表查询
 */
api.getRoomList = async () => {
  return instance.get("/cabinet/room/list");
};
/**
 *配电室柜总览页查询
 */
api.getDetails = async (roomId: string) => {
  return instance.get(`/cabinet/room/details/${roomId}`);
};
/**
 *设备查询接口
 */
api.getDeviceList = async () => {
  return instance.get("/cabinet/device/list");
};
/**
 *设备选中接口
 */
api.applyLoop = async (equipmentId: string) => {
  return instance.get(`/cabinet/apply/loop/${equipmentId}`);
};
/**
 *回路挂锁列表查询
 */
api.findlockLoop = async (loopId: string) => {
  return instance.get(`/findlock/loop/${loopId}`);
};
/**
 *停送电申请接口
 */
api.toApply = async (data: any) => {
  return instance.post("/apply/apply", data);
};
/**
 *待办 分页
 */
api.todoPage = async (data: any) => {
  return instance.post("/todo/page", data);
};
/**
 *待办 详情
 */
api.todoDetail = async (data: any) => {
  return instance.post("/todo/detail", data);
};
/**
 *已办 分页
 */
api.donePage = async (data: any) => {
  return instance.post("/done/page", data);
};
/**
 *已办 详情
 */
api.doneDetail = async (data: any) => {
  return instance.post("/done/detail", data);
};
/**
 *我发起的 分页
 */
api.startByMePage = async (data: any) => {
  return instance.post("/startByMe/page", data);
};
/**
 *我发起的 详情
 */
api.startByMeDetail = async (data: any) => {
  return instance.post("/spms/v1/startByMe/detail", data);
};
/**
 *流程 审批
 */
api.processApproval = async (data: any) => {
  return instance.post("/spms/v1/process/approval", data);
};
/**
 *流程 试车
 */
api.processAttempt = async (data: any) => {
  return instance.post("/process/attempt", data);
};
/**
 *流程 检修
 */
api.processOverhaul = async (data: any) => {
  return instance.post("/process/overhaul", data);
};
/**
 *流程 预执行
 */
api.processPreExecute = async (data: any) => {
  return instance.post("/process/preExecute", data);
};
/**
 *流程 停电执行
 */
api.executeStop = async (data: any) => {
  return instance.post("/process/execute/stop", data);
};
/**
 *流程 送电执行
 */
api.executeSupply = async (data: any) => {
  return instance.post("/process/execute/supply", data);
};
// 批量list接口
api.approveList = async (type: any, data: any) => {
  return instance.post(`/${type}/page`, data);
};

api.processApprovalBatch = async (data: any) => {
  return instance.post("/process/approval/batch", data);
};

export default api;
