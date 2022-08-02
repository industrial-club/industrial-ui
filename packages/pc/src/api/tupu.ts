/**
 * 配电柜
 */

import { getInstance } from "./axios";

let instance = getInstance({ serverName: "spms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const getCabinetRoomDetails = async (id) => {
  return await instance.get(`cabinet/room/details/${id}`);
};

const getCabinetRoomList = async () => {
  return await instance.get(`cabinet/room/list`);
};

export { getCabinetRoomDetails, getCabinetRoomList };
