import { getInstance } from "./axios";

let instance = getInstance({ serverName: "spms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

api.todoPage = async () => {
  return instance.post("/todo/page");
};

api.deivceList = async () => {
  return instance.get("/cabinet/device/list");
};

api.getloopByEq = async (equipmentId: any) => {
  return instance.get(`/cabinet/apply/loop/${equipmentId}`);
};

export default api;
