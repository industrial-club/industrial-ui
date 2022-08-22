import { weather } from "@/utils/interface/meteorological";
import { AxiosResponse } from "axios";
import { getInstance } from "./axios";

let instance = getInstance({ serverName: "card/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const weatherData: (code: string) => Promise<AxiosResponse<weather>> = async (
  code: string
) => {
  const res = await instance.post<weather>(`/weatherData`, {
    workShopType: code,
  });
  return res;
};

export default weatherData;
