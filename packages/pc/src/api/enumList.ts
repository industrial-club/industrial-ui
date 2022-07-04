/**
 * 字典查询
 */

import { getInstance } from "./axios";

let instance = getInstance({ serverName: "common/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const getDepPeopleTreeList = async () => {
  return await instance.get(`/department/all/tree/org/employee`);
};

export default getDepPeopleTreeList;
