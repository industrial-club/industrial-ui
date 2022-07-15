import { getInstance } from "../axios";

let instance = getInstance({ serverName: "filterpress/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};
interface listItem {
  [key: string]: string | number;
}
interface obj {
  [key: string]: Array<listItem> | any;
}
interface pageParamlistData {
  [key: string]: obj;
}
const filterPressConfigurationApi = {
  /**
   * 查询压滤页面配置
   */
  getPageParamList() {
    return instance.get(`page/getPageParamList`);
  },

  /**
   * 单个下发
   */
  setPageParamValueSingle(data: { [key: string]: string }) {
    return instance.post(`page/setPageParamValueSingle`, data);
  },
};

export default filterPressConfigurationApi;
export { pageParamlistData, listItem };
