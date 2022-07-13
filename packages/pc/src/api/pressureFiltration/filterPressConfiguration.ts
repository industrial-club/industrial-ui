import { getInstance } from "../axios";

let instance = getInstance({ serverName: "notification/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const filterPressConfigurationApi = {
  /**
   * 字典查询
   */
  getEnumList(enumName) {
    return instance.get(`/enum/${enumName}`);
  },
};

export default filterPressConfigurationApi;
