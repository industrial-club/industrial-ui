export interface weatherItem {
  name: string;
  STATIONS1: string;
  STATIONS2: string;
  STATIONS3: string;
}

export interface weather {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    weatherDatas: Array<weatherItem>;
  };
}
