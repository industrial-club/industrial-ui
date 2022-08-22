export interface indicatorDatasItem {
  ELECTRIC__INDICATOR_CYJWVQDQLValue: string;
  timeString: string;
  name: string;
  type: string;
  value: string | number;
}

export interface energyStatisticsIndicatorDatasItem {
  indicatorCurrentValue: string;
  indicatorName: string;
  indicatorCode: string;
  indicatorDatas: Array<indicatorDatasItem>;
}
export interface energyItem {
  energyCode: string;
  energyName: string;
  energyStatisticsIndicatorDatas: Array<energyStatisticsIndicatorDatasItem>;
}

export interface energy {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    energyData: Array<energyItem>;
  };
}
