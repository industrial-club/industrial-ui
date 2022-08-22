interface fireLevel {
  color: string;
  level: number;
  name: string;
}

export interface signalFireLogsItem {
  alarmContent: string;
  alarmName: string;
  definitionId: string;
  fireLevel: fireLevel;
  id: number;
  levelId: string;
  thingCode: string;
  thingName: string;
  typeId: string;
  typeName: string;
  userReason: string;
  cameraCode: string;
  cameraLevel: number;
  cameraUrl: string;
  createTime: number;
}
export interface typesItem {
  color: string;
  id: string;
  level: string;
  name: string;
  value: number;
}
export interface levelsItem {
  color: string;
  id: string;
  level: string;
  name: string;
  value: number;
}
export interface alarmInformation {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    signalFireLogs: [signalFireLogsItem];
    levelTags: [typesItem];
    levels: [levelsItem];
  };
}

export interface data {
  typeIdList: Array<string>;
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
  workShopType: string;
}
