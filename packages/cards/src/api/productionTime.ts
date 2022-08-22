import { ProductionDuration } from "@/utils/interface/productionTime";
import { AxiosResponse } from "axios";
import { getInstance } from "./axios";

let instance = getInstance({ serverName: "card/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const productionDuration: (
  query: string,
  code: string
) => Promise<AxiosResponse<ProductionDuration>> = async (
  query: string,
  code: string
) => {
  const res = await instance.get(
    `/productionDuration?queryMode=${query}&workShopType=${code}`
  );
  return res;
};

export default productionDuration;
