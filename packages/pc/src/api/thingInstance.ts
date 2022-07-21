import qs from "querystring";
import { instance } from "./axios";

/* 物实例管理 */

/**
 * 获取物模型列表
 */
export const findAllThingForTree = () =>
  instance.get("/thing/v1/core/thing/findAllThingForTreeByTableName");
/**
 * 获取列表-分页
 */
export const indInsts = (data: any) =>
  instance.post("/thing/v1/adapter/thing/inst/findInstsByConditionPage", data);

/**
 * 根据thingCode获取物规格type
 */
export const findByCode = (thingCode: string) =>
  instance.get(`/thing/v1/core/thing/findByCode/${thingCode}`);

/**
 * 添加实例对象
 */
export const addInst = (data: any) =>
  instance.post(`/thing/v1/adapter/thing/inst/add`, data);

/**
 * 根据id查询物属性
 */
export const findThingProperties = (id: string) =>
  instance.get(`/thing/v1/adapter/thing/inst/get/${id}`);

/**
 * 查询属性【按属性类型划分】
 */
export const findTypeProperties = (thingCode: string) =>
  instance.post(`/thing/v1/core/thing/findTypeProperties/${thingCode}`);

export default "";
