import { getInstance } from "../axios";

let instance = getInstance({ serverName: "filterpress/v1" });

const api: { [key: string]: any } = {};

api.setInstance = (serverName: string, prefix?: string) => {
  instance = getInstance({ serverName: serverName, prefix });
};

const pressureFiltrationHomeApi = {
  /**
   * getPlateCountInfo
   */
  getPlateCountInfo() {
    return instance.get(`/business/plate/getPlateCountInfo`);
  },

  /**
   * getFilterFeedingStatusList
   */
  getFilterFeedingStatusList() {
    return instance.get(`/business/feedingStatus/getFilterFeedingStatusList`);
  },

  /**
   * updateFeedingStatus
   */
  updateFeedingStatus(data) {
    return instance.post(`/business/feedingStatus/update`, data);
  },

  /**
   * queryPopNotificationListAll
   */
  queryPopNotificationListAll() {
    return instance.get(`/notification/queryPopNotificationListAll`);
  },

  /**
   * queryCancelPopNotificationListAll
   */
  queryCancelPopNotificationListAll() {
    return instance.get(`/notification/queryCancelPopNotificationListAll`);
  },
};

export default pressureFiltrationHomeApi;
