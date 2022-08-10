import qs from "querystring";
import { instance } from "./axios";

/* 物实例管理 */

/**
 * 获取物模型树
 */
export const findAllThingForTree = () =>
  instance.get("/thing/v1/core/thing/findAllThingForTreeByTableName");
/**
 * 获取物实例列表-分页
 */
export const indInsts = (data: any) =>
  instance.post("/thing/v1/adapter/thing/common/findPage", data);

/**
 * 根据thingCode获取物规格
 */
export const findByCode = (thingCode: string) =>
  instance.get(`/thing/v1/core/thing/findByCode/${thingCode}`);
/**
 * 查物实例详情
 */
export const findThingProperties = (id: string) =>
  instance.get(`/thing/v1/adapter/thing/common/findById/${id}`);
// 编辑
export const editThing = (data: any) =>
  instance.post(`/thing/v1/adapter/thing/common/modify`, data);
// 新增
export const addThing = (data: any) =>
  instance.post(`/thing/v1/adapter/thing/common/create`, data);
// 删除
export const deleteThing = (id: string) =>
  instance.delete(`/thing/v1/adapter/thing/common/remove/${id}`);
// 获取关系tab
export const getTabs = (direction: string, thingCode: string) =>
  instance.get(
    `/thing/v1/core/relation/findByDirection/${direction}/${thingCode}`
  );

// 获取关系
export const getRelationZ = (id: string, thingCode: string) =>
  instance.post(`/thing/v1/adapter/thing/relation/findZ`, {
    zthingCode: thingCode,
    instId: id,
  });
export const getRelationA = (id: string, thingCode: string) =>
  instance.post(`/thing/v1/adapter/thing/relation/findA`, {
    athingCode: thingCode,
    instId: id,
  });
// 根据条件查询物实例
export const findThingByParams = (data: any) =>
  instance.post(
    `/thing/v1/adapter/thing/common/simpleFindEntityAndThing`,
    data
  );

export default "";
