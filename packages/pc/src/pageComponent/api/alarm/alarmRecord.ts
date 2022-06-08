import { AxiosResponse } from "axios";
import { getInstance } from "@/api/axios";

const instance = getInstance({ prefix: "/api/", serverName: "alarmlite/v1" });

export interface EnumItem {
  code: string;
  name: string;
}

export interface recordsItem {
  conditionId: number;
  content: string;
  contentParams: string;
  firstAlarmTime: number | string;
  id: number;
  imageUrl: string;
  instanceCode: string;
  instanceName: string;
  lastAlarmTime: number | string;
  level: number;
  manuReleasable: string | number | boolean | null;
  name: string;
  propertyCode: string;
  releaseTime: number | string;
  releaseUser: string;
  ruleId: number;
  status: string;
  systemCode: string;
  type: string;
  videoUrl: string;
}

export interface alarmRecordItem {
  countId: number;
  current: number;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: [];
  pages: number;
  records: Array<recordsItem>;
  searchCount: boolean;
  size: number;
  total: number;
}

// 获取下拉框数据
export const getEnum: (
  enumName: string
) => Promise<AxiosResponse<Array<EnumItem>>> = async (enumName) => {
  const res = await instance.get<Array<EnumItem>>(`/enum/${enumName}`);
  return res;
};

/**
 * 手动消警
 * @returns
 */
export const forceClearAlarm = async (data: any) => {
  const res = await instance.post<boolean>("/forceClearAlarm", data);
  return res;
};
/**
 * 获取报警记录列表
 * @param obj
 * {
 *  pageNum: 当前页,
 *  pageSize: 每页条数,
 *  level: 报警级别,
 *  startTime: 开始时间,
 *  endTime: 结束时间,
 *  status:报警状态,
 *  type:报警类型,
 *  keyword:关键字
 * }
 * @returns
 */
export const alarmRecordList: (obj: {
  pageNum: number;
  pageSize: number;
  level?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  keyword?: string;
}) => Promise<AxiosResponse<alarmRecordItem>> = async (obj) => {
  const res = await instance.post<alarmRecordItem>("/record/list", obj);
  return res;
};

/**
 * 获取所有报警播报列表
 */
export const getWarningSpeechList = () => instance.get("/findAllVoiceAlarm");

/**
 * 切换是否静音报警
 */
export const setVoiceEnable = (data: any) =>
  instance.post("/updateVoiceState", data);

/**
 * 获取视频
 */
export const getVideo = (alarmUuid: string, instanceCode: string) =>
  instance.get("/video", { params: { alarmUuid, instanceCode } });

/**
 * 获取报警详情
 * @param record 记录对象
 */
export const getAlarmDetail = (record: any) =>
  instance.post("/alarm/detail", record);

/**
 * 获取报警类型 map
 */
export const getAlarmTypeMap = () => instance.get("/enum/AlarmTypeEnum");

// 获取视频的baseUrl
export const getVideoBaseUrl = async () => {
  const { data } = await instance.get("/vms/v1/camera/getByUuid");
  return data.mediaServerPo.url;
};
