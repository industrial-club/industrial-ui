/**
 * 生产情况
 */

import { AxiosResponse } from "axios";
import { getInstance } from "./axios";
import { production, productionMarketings } from "@/utils/interface/production";

let instance = getInstance({ serverName: "card/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const production: (code: string) => Promise<AxiosResponse<production>> = async (
  code: string
) => {
  const res = await instance.post(`/productionSituations`, {
    workShopType: code,
  });
  return res;
};

const productionNumber: (
  code: string
) => Promise<AxiosResponse<productionMarketings>> = async (code: string) => {
  const res = await instance.post(`/productionNumber`, {
    workShopType: code,
  });
  return res;
};

export { production, productionNumber };
