import { signalFireLogsItem } from "./alarm";
import { energyItem } from "./energy";

export interface realDatasItem {
  code: string;
  name: string;
  unit: string;
  value: number;
}
export interface columnDatasItem {
  name: string;
  timeString: string;
  type: string;
  value: number;
}
export interface lineDatasItem {
  dt: number;
  timeStr?: string;
  mc: string;
  tc: string;
  v: string;
}
export interface dusNoisesItem {
  [key: string]: {
    currentValue: number;
    lineDatas: Array<lineDatasItem>;
    standardValue: string;
  };
}
export interface EfficientConcentrateDatasItem {
  metricName: string;
  name: string;
  lineData: Array<lineDatasItem>;
}
export interface ControlParametersDatasItem {
  metricName: string;
  name: string;
  value: string;
}
export interface columnWaterDatasItem {
  timeString: string;
  name: string;
  type: string;
  value: number;
}
export interface cumulativeDatasItem {
  unit: string;
  code: string;
  name: string;
  value: number;
}
export interface coalWashRqwDatas {
  code: string;
  name: string;
  unit: string;
  value: number;
}
export interface workShopCockpit {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    columnDatas: Array<columnDatasItem>;
    realDatas: Array<realDatasItem>;
    dusNoises: dusNoisesItem;
    energyData: Array<energyItem>;
    imageRecognitionData: {
      imageRecognitionData: Array<signalFireLogsItem>;
      imageRecognitionNumber: number;
    };
    EfficientConcentrateDatas: Array<EfficientConcentrateDatasItem>;
    ControlParametersDatas: {
      [key: string]: Array<ControlParametersDatasItem>;
    };
    columnWaterDatas: Array<columnWaterDatasItem>;
    columnAshDatas: Array<columnWaterDatasItem>;
    carryingCapacityDatas: Array<columnWaterDatasItem>;
    cumulativeDatas: Array<cumulativeDatasItem>;
    capacityMonitoringDatas: Array<cumulativeDatasItem>;
    coalWashRqwDatas: coalWashRqwDatas;
  };
}
