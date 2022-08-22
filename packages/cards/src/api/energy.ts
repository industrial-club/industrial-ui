import { energy } from "@/utils/interface/energy";
import { AxiosResponse } from "axios";
import { getInstance } from "./axios";

let instance = getInstance({ serverName: "card/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const energyConsume: (code: string) => Promise<AxiosResponse<energy>> = async (
  code: string
) => {
  const res = await instance.post<energy>(`/energyConsume`, {
    workShopType: code,
  });
  return res;
};

export default energyConsume;
