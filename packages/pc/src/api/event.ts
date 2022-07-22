import { Header } from "ant-design-vue/lib/layout/layout";
import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

interface SaveEventData {
  id: string; // 空则新增,不空修改
  eventTypeCode: string; // 报警类型code
  algoTypeCode: string; // 算法类型code
  source: string; // 事件来源
  cameraUuid: string; // 相机uuid
  body: string; // 其他数据  以json形式存储
  remark: string; // 备注
  createUser: string; // 创建人
  updateUser: string; // 更新人
}
interface EventConfigItem {
  pageNum: number;
  pageSize: number;
  eventTypeCode?: string;
  algoTypeCode?: string;
}
interface Item {
  pageNum: number;
  pageSize: number;
  name: string;
  code: string;
}
// 算法类型获取
api.getAlgorithmTypeList = async () => {
  return instance.get(`/eventAlgoType/findAll`);
};
// 算法类型获取带筛选条件
api.getAlgorithmTypeListPage = async (data: Item) => {
  return instance.get(
    `/eventAlgoType/searchByParam?pageNum=${data.pageNum}&pageSize=${data.pageSize}&code=${data.code}&name=${data.name}`
  );
};
// 算法类型获取根据id
api.getEventAlgoTypeById = async (id: string) => {
  return instance.get(`/eventAlgoType/getById?id=${id}`);
};
// 算法类型获取根据code
api.getEventAlgoTypeByCode = async (code: string) => {
  return instance.get(`/eventType/getByCode?useBo=true&code=${code}`);
};
// 算法类型保存
api.saveEventAlgoType = async (data: any) => {
  return instance.post("/eventAlgoType/save", data);
};
// 算法类型删除
api.deleteEventAlgoType = async (id: string) => {
  return instance.get(`/eventAlgoType/deleteById?id=${id}`);
};
// 事件类型获取
api.getEventTypeList = async () => {
  return instance.get(`/eventType/findAll`);
};
// 事件类型获取带筛选条件
api.getEventTypeListPage = async (data: Item) => {
  return instance.get(
    `/eventType/searchByParam?pageNum=${data.pageNum}&pageSize=${data.pageSize}&code=${data.code}&name=${data.name}`
  );
};
// 事件类型获取根据id
api.getEventTypeById = async (id: string) => {
  return instance.get(`/eventType/getById?id=${id}`);
};
// 事件类型保存
api.saveEventType = async (data: any) => {
  return instance.post("/eventType/save", data);
};
// 事件类型删除
api.deleteEventType = async (id: string) => {
  return instance.get(`/eventType/deleteById?id=${id}`);
};
// 事件获取
api.getEventData = async (data: any) => {
  return instance.get(`/eventData/searchByParam`, {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      eventTypeCode: data.eventTypeCode,
      algoTypeCode: data.algoTypeCode,
      name: data.name,
      ip: data.ip,
      beginTime: data.startTime,
      endTime: data.endTime,
      id: data.id,
    },
  });
};
// 事件获取
api.getEventDataById = async (id: string) => {
  return instance.get(`/eventData/getById?id=${id}`);
};
// 事件保存
api.saveEventData = async (data: any, createTime: any) => {
  data.create_dt = createTime.valueOf();
  return instance.post(`/eventData/save`, data);
};
// 事件配置获取
api.getEventConfig = async (data: EventConfigItem) => {
  return instance.get(
    `/eventConfig/searchByParam?pageNum=${data.pageNum}&pageSize=${data.pageSize}&eventTypeCode=${data.eventTypeCode}&algoTypeCode=${data.algoTypeCode}`
  );
};
// 事件配置保存
api.saveEventConfig = async (data: SaveEventData) => {
  return instance.post(`/eventConfig/save`, data);
};
// 事件配置删除
api.deleteEventConfig = async (id: string) => {
  return instance.get(`/eventConfig/deleteById?id=${id}`);
};
// 事件配置根据id获取
api.getEventConfigById = async (id: string) => {
  return instance.get(`/eventConfig/getById?id=${id}&useVo=${true}`);
};
// 获取相机信息
api.getByUuid = async (uuid: string) => {
  return instance.get(`/camera/getByUuid?uuid=${uuid}`);
};
// 获取树
api.getTreeData = async (data: any) => {
  return instance.get(`/cameraGroup/tree`, data);
};
// 获取树
api.getCameraGroupType = async () => {
  return instance.get(`/cameraGroupType/findAll`);
};
// 获取下拉列表
api.cameraList = async () => {
  return instance.get(`/camera/search?pageNum=1&pageSize=999`);
};

export default api;
