export interface listItem {
  value: number;
  name: string;
  unit: string;
}
export interface title {
  name: string;
  value: number;
  unit: string;
}
export interface item {
  sumTitle: title;
  thingTitle: title;
  rowData: Array<listItem>;
}
export interface datasItem {
  list: Array<item>;
}
export interface totalWashingVolume {
  value: number;
  name: string;
  unit: string;
  title: string;
  list: Array<listItem>;
}
export interface dataObj {
  totalVolume: totalWashingVolume;
  datas: Array<datasItem>;
  cardParamName: string;
}
interface Itemval {
  code: string;
  name: string;
  unit: string;
  value: number;
}

export interface itemFace {
  cardParamName: string;
  dayKiloton: Itemval;
  hourlyTon: Itemval;
  monthTenKiloton: Itemval;
  proportionKiloton: Itemval;
  shiftTon: Itemval;
}

export interface production {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    data: {
      BlockCoal: itemFace;
      MixCoal: itemFace;
      CleanCoal: itemFace;
      Gangue: itemFace;
      Selected: dataObj;
      Wash: dataObj;
    };
  };
}
export interface lineDataItemval {
  timeString: string;
  washingProportionValue: number;
}
export interface CoalItem {
  timeString: string;
  name: string;
  SelectedCoalValue?: number;
  EndCoalValue?: number;
  BlockCleanCoalValue?: number;
  type: string;
  value: number;
}
export type ChartData = Array<CoalItem>;

export interface productionMarketings {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    lineData: [lineDataItemval];
    columnData: ChartData;
  };
}
