import { instance } from "@/api/axios";

interface SaveSysConfigItem {
  customerId?: number; // 客户Id
  customerName?: string; // 客户名称
  homepageCopyright?: string; // 主页版权信息
  id?: number; // 系统配置Id
  loginCopyright?: string; // 登录页版权信息
  loginSysDesc?: string; // 登录页系统描述
  productId?: number; // 产品Id
  productName?: string; // 产品名称
  projectId?: number; // 项目Id
  projectName?: string; // 项目名称
  style?: number; // 风格：1-深色系，2-浅色系
  updateDt?: string; // 修改日期时间
  updateUser?: string; // 修改人
}
// 保存系统配置
const saveSysConfig = async (list: SaveSysConfigItem) => {
  const res = await instance.post(
    `/common/v1/sysconfig/saveSysConfig?clientType=web`,
    list
  );
  return res;
};
// 取消系统配置
const cancelEditing = async () => {
  const res = await instance.post(
    `/common/v1/sysconfig/cancelEditing?clientType=web`
  );
  return res;
};
// 获取图片
const searchImage = (imgType: number, editImg: number): Promise<any> => {
  return instance.get(
    `/common/v1/sysconfig/searchImage?imgType=${imgType}&editImg=${editImg}&clientType=web`,
    {
      responseType: "blob",
      headers: {
        "Content-Disposition": "attachment",
        "Content-Type": "text/html;charset=UTF-8",
      },
    }
  );
};
// 上传图片
const uploadImage = async (imgType: number, file: any) => {
  const res = await instance.post(
    `/common/v1/sysconfig/uploadImage?imgType=${imgType}`,
    file,
    {
      params: {
        clientType: "web",
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res;
};
// 获取系统配置信息
const getSysConfig = async () => {
  const res = await instance.get(
    "/common/v1/sysconfig/getSysConfig?clientType=web"
  );
  return res;
};
const getCustomerList = async () => {
  const res = await instance.get("/common/v1/customer/all");
  return res;
};
const getProjectList = async () => {
  const res = await instance.get("/common/v1/project/all/summary");
  return res;
};
const getSystemList = async () => {
  const res = await instance.get("/common/v1/product/all/summary");
  return res;
};

export {
  saveSysConfig,
  cancelEditing,
  searchImage,
  uploadImage,
  getSysConfig,
  getCustomerList,
  getProjectList,
  getSystemList,
};
