import { workShopCockpit } from "@/utils/interface/workShopCockpit";
import { AxiosResponse } from "axios";
import { getInstance } from "./axios";

let instance = getInstance({ serverName: "card/v1", timeout: 30 });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const workShopCockpitData: (
  code: string,
  type: string
) => Promise<AxiosResponse<workShopCockpit>> = async (code, type) => {
  const res = await instance.post<workShopCockpit>(
    `/workShop/getWorkShopCockpitData`,
    {
      workShopType: code,
      cardCode: type,
    }
  );
  return res;
};
export default workShopCockpitData;
