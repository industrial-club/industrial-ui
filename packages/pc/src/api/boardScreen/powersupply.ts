/**
 * 字典查询
 */

import { getInstance } from "../axios";

let instance = getInstance({ serverName: "spms/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const listRoomVO = async () => {
  return await instance.get(`/cabinet/room/list`);
};
const taskJobDetail = async (data) => {
  return await instance.get(`/workflow/data/pc/taskJobDetail`, data);
};
const getAllCabinetByRoomId = async (id) => {
  return await instance.get(`/cabinet/room/details/${id}`);
};
const getloopDetail = async (id) => {
  return await instance.get(`/findlock/loop/${id}`);
};

export { listRoomVO, taskJobDetail, getAllCabinetByRoomId, getloopDetail };
