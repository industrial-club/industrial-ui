declare namespace cabinet {
  type state = "blackout" | "charged" | "unknown" | "highlight" | "unhighlight";
  // 配置文件
  type c = {
    domId?: string;
    renderState?: "group" | "row";
    cabinet?: {
      x: number;
      y: number;
      z: number;
      boxColor: string;
      columnOffset: number;
      offsetZ: number;
      column: {
        h: number;
      };
    };
    background?: {
      color: string;
    };
    data: item;
  };

  export interface item {
    name: string;
    id: string;
    cards?: number;
    state?: state;
    info?: any;
    child?: Array<item>;
  }

  export type parts = "brake" | "card" | "handle" | "light" | "panel";

  /**
   * 配电柜的零件配置
   * @param {Record<parts, { obj: string; mtl: string }>} objData 过滤器函数
   */
  export type objPartsArr = Array<parts>;
}
declare module "cabinet" {
  export = cabinet;
}
