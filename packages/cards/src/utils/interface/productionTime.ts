export interface state {
  state: string;
  time: number;
  timeString: string;
}
export interface item {
  month: string;
  time: number;
  state: string;
}
export interface ProductionDuration {
  cardCode: string;
  cardIcon: string;
  cardName: string;
  cardParams: {
    statisticalChart: Array<state>;
    total: {
      [key: string]: number;
    };
  };
}
