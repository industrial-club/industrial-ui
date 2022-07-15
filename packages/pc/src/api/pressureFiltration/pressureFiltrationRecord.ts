import { getInstance } from "../axios";

let instance = getInstance({ serverName: "filterpress/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const pressureFiltrationRecordApi = {
  /**
   * getFilterStatisticLogger
   */
  getFilterStatisticLogger(pageSize, pageNum, data) {
    return instance.post(
      `/logger/getFilterStatisticLogger?pageSize=${pageSize}&pageNum=${pageNum}`,
      data
    );
  },

  /**
   * getModelList
   */
  getModelList() {
    return instance.get(`/business/combobox/getModelList`);
  },

  /**
   * getFilterList
   */
  getFilterList() {
    return instance.get(`/business/combobox/getFilterList`);
  },

  /**
   * getFilterShiftLogger
   */
  getFilterShiftLogger(pageSize, pageNum, data) {
    return instance.post(
      `/logger/getFilterShiftLogger?pageSize=${pageSize}&pageNum=${pageNum}`,
      data
    );
  },
};

export default pressureFiltrationRecordApi;
