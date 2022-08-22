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
// export const getTabs = (direction: string, thingCode: string) =>
//   instance.get(
//     `/thing/v1/core/relation/findGroupByDirection/${direction}/${thingCode}`
//   );
// 获取关系tab新
export const getTabs = (direction: string, thingCode: string) =>
  instance.get(
    `/thing/v1/core/relation/findGroupByDirection/${direction}/${thingCode}`
  );
// 新增关系
export const addRelation = (data: any) =>
  instance.post(`/thing/v1/adapter/thing/relation/create`, data);
// 删除关系
export const deleteRelation = (data: any) =>
  instance.post(`/thing/v1/adapter/thing/relation/delete`, data);
// 获取关系新
export const getRelationZ = (id: string, relaClass: string) =>
  instance.get(
    `/thing/v1/adapter/thing/relation/findZInstsByClass/${id}/${relaClass}`
  );
export const getRelationA = (id: string, relaClass: string) =>
  instance.get(
    `/thing/v1/adapter/thing/relation/findAInstsByClass/${id}/${relaClass}`
  );
// 获取关系
// export const getRelationZ = (id: string, thingCode: string) =>
//   instance.post(`/thing/v1/adapter/thing/relation/findZ`, {
//     zthingCode: thingCode,
//     instId: id,
//   });
// export const getRelationA = (id: string, thingCode: string) =>
//   instance.post(`/thing/v1/adapter/thing/relation/findA`, {
//     athingCode: thingCode,
//     instId: id,
//   });
// 根据条件查询物实例
export const findThingByParams = (data: any) =>
  instance.post(
    `/thing/v1/adapter/thing/common/simpleFindEntityAndThing`,
    data
  );
// 上传图片
export const uploadCommon = (data, headers) =>
  instance.post(`/thing/v1/core/thing/uploadCommon`, data, {
    headers,
  });
// 导入Excel
export const importExcel = (data, headers) =>
  instance.post(`/thing/v1/core/excelOpt/importExcel`, data, {
    headers,
  });
// 导出Excel
export const exportExcelTemplate = () =>
  instance.post(
    `/thing/v1/core/excelOpt/exportExcelTemplate`,
    {},
    {
      responseType: "blob",
      headers: {
        "Content-Disposition": "attachment",
        "Content-Type": "text/html;charset=UTF-8",
      },
    }
  );
export default "";
