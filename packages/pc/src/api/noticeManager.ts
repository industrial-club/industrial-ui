import { getInstance } from "./axios";

let instance = getInstance({ serverName: "vms/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const noticeManagerApi = {};

export default noticeManagerApi;
