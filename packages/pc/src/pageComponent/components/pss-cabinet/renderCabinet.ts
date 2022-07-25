export type CabinetState =
  | "blackout"
  | "charged"
  | "unknown"
  | "highlight"
  | "unhighlight";
const boxState = "custom-icon/boxState.json";
type CabinetNode = ht.Node | ht.Block;
type renderState = "group" | "row";
type shape3dType =
  | "box"
  | "sphere"
  | "cone"
  | "torus"
  | "cylinder"
  | "star"
  | "rect"
  | "roundRect"
  | "triangle"
  | "rightTriangle"
  | "parallelogram"
  | "trapezoid"
  | "billboard"
  | "plane";

enum PartsKey {
  bashou = "bs",
  scard1 = "sc1",
  scard2 = "sc2",
  bigCard = "bc",
  box = "bx"
}

export interface CabinetConfig {
  x: number;
  y: number;
  z: number;
  groupOffset: number;
  columnOffset: number;
  columnNameHeight: number;
  renderState: renderState;
  plane?: {
    bc: string;
    x?: number;
    y: number;
    z?: number;
  };
  domId: string;
  boxColor: string;
  data: CabinetItem;
}

export type customConf = Pick<
  CabinetConfig,
  "data" | "renderState" | "domId" | "plane"
>;

export interface CabinetItem {
  name: string;
  id: string;
  cards?: number;
  state?: CabinetState;
  child?: Array<CabinetItem>;
}

class renderCabinet {
  constructor(opt: customConf) {
    this.reset.config(opt);
    this.reset.base();
    this.renderOverall();
  }

  protected dm: ht.DataModel;

  protected g3d: ht.graph3d.Graph3dView;

  protected config: CabinetConfig = {
    x: 400,
    y: 100,
    z: 240,
    renderState: "group",
    boxColor: "#17858E",
    plane: {
      bc: "#123445",
      y: 5
    },
    domId: "",
    groupOffset: 160 * 5,
    columnOffset: 2,
    columnNameHeight: 60,
    data: {
      name: "第一组",
      id: "1",
      child: []
    }
  };

  // 重置
  protected reset = {
    config: (opt: customConf) => {
      this.config = Object.assign(this.config, opt, {});
    },
    base: () => {
      this.dm = new ht.DataModel();
      this.dm.setBackground("black");
      this.g3d = new ht.graph3d.Graph3dView(this.dm);
      window["g3d"] = this.g3d;

      if (this.config.domId && document.getElementById(this.config.domId)) {
        const dm = document.getElementById(this.config.domId) as HTMLDivElement;
        this.g3d.addToDOM(dm);
      } else {
        this.g3d.addToDOM();
      }

      this.g3d.setGridVisible(false);
      this.reset.addEvent();

      // setTimeout(() => {
      //   this.moveCamera(
      //     [-1097.1719926025933, 773.1469998056731, 485.6102800320624],
      //     [-266.25412553643935, 473.14699980566957, -70.78481177791639],
      //     true
      //   );
      // }, 1000);
    },
    addEvent: () => {
      this.g3d.mi(e => {
        const data = e.data as ht.Node;
        const event = e.event;
        if (e.kind === "onClick") {
          const tag = data.getTag();
          const iscard = tag.indexOf("card");
          const id = tag.replace("card", "");

          if (iscard === 0 && e.type === "image") {
            this.cabinetLoopClick(event, id);
          }

          if (this.config.renderState === "group") {
            window.rowClick(id);
          }
        }
        // 块高亮
        if (e.kind === "onMove") {
          const tag = data.getTag();
          const id = tag.replace("bx", "");
          data.s("all.opacity", 0.5);
        }
        if (e.kind === "onLeave") {
          const tag = data.getTag();
          data.s("all.opacity", 0.1);
        }
      });
    }
  };

  protected errorEvent = (s: string) => {
    throw new Error(s);
  };

  // 回路事件
  protected cabinetLoopClick = (e: MouseEvent, id: string) => {
    if (!window.cabinetLoopClick) {
      return this.errorEvent("window上不存在 ·cabinetLoopClick· 事件 .");
    }
    const map = this.dm.getTagMap();
    for (let i in map) {
      if (i.indexOf("bx") === 0) {
        // 处理所有盒子隐藏高亮
        const bxid = i.replace("bx", "");
        this.states.unhighlight(bxid);
      }
    }

    // 给当前点击的盒子添加高亮
    this.states.highlight(id);
    window.cabinetLoopClick(e, id);
  };

  // 零部件渲染细则
  protected renderParts = {
    keys: {
      bashou: "把手",
      card: "卡片",
      box: "盒子"
    },
    // 地板
    plane: () => {
      const plane = this.renders.node("node", "plane");
      const maxRow = this.config.data.child.length;
      let maxColumn = 0;
      for (let i = 0; i < maxRow; i++) {
        maxColumn =
          this.config.data.child[i].child.length > maxColumn
            ? this.config.data.child[i].child.length
            : maxColumn;
      }
      plane.s3(
        this.config.plane.x || this.config.x * maxColumn + 200,
        this.config.plane.y,
        (this.config.z + this.config.groupOffset) * maxRow
      );
      plane.setStyleMap({
        "3d.movable": false,
        "all.color": this.config.plane.bc
      });
      plane.setTag("plane");
      this.dm.add(plane);
    },

    // 渲染单个配电箱
    distributionBox: (item: CabinetItem): CabinetNode => {
      const distributionBox = this.renders.node("block");
      const box = this.renderParts.box(item.id);
      const [a, b] = this.renderParts.handle(item.id);
      const gc = this.renderParts.gCard(item);
      const nodeList = [box, a, b, gc];
      for (let i of nodeList) {
        distributionBox.addChild(i);
        this.dm.add(i);
      }

      this.setState(item.id, item.state);

      this.dm.add(distributionBox);
      return distributionBox;
    },

    // 渲染挂牌位置
    gCard: (item: CabinetItem): CabinetNode => {
      const gCard = this.renders.node("node", "billboard");
      const [x, y] = [60 * 0.78, 60];
      gCard.s3(x, y, 2);
      gCard.p3(
        -this.config.x / 3,
        this.config.y / 2 - 10 - y / 2,
        this.config.z / 2 + 1
      );
      const visible = item.cards > 0 ? true : false;
      gCard.s({
        "texture.scale": 5,
        "3d.visible": visible,
        shape3d: "billboard",
        "texture.cache": true,
        "shape3d.image": "custom-icon/gCard.json"
      });
      gCard.setAttr("v", item.cards);
      gCard.setTag(`card${item.id}`);
      if (this.config.renderState === "row") {
        gCard.s("interactive", true);
      } else {
        gCard.s("interactive", false);
      }
      return gCard;
    },
    // 把手部分
    handle: (id: string): Array<CabinetNode> => {
      const cylinder = this.renders.node("node");
      const bs = this.renders.node("node");
      const p3 = {
        x: -this.config.x / 3,
        y: this.config.y - 20,
        z: this.config.z / 2
      };
      cylinder.setAnchor3d(0, 0, 0);

      cylinder.p3(p3.x, p3.y, p3.z);

      cylinder.s3(20, 10, 20);
      cylinder.setStyleMap({
        shape3d: "cylinder",
        "shape3d.top.color": "#35ADD9",
        "shape3d.color": "#4688E4",
        "shape3d.bottom.color": "red"
      });
      cylinder.setRotationX(Math.PI / 2);

      bs.s3(30, 10, 5);
      bs.p3(p3.x + 30, p3.y - 15, p3.z + 5);
      bs.s("all.color", "#b3a9fe");
      bs.setTag(`${PartsKey.bashou}${id}`);
      return [cylinder, bs];
    },
    // 卡片部分

    // 盒子部分
    box: (id: string): CabinetNode => {
      const box = this.renders.node("node");
      const { x, y, z } = this.config;
      box.setStyleMap({
        "wf.loadQuadWireframe": true,
        "wf.geometry": true,
        "texture.scale": 5,
        "all.color": this.config.boxColor,
        "front.image": boxState
      });
      box.s3(x, y, z);

      box.p3(0, 0, 0);
      box.setTag(`${PartsKey.box}${id}`);
      return box;
    }
  };

  // 渲染整体
  protected renderOverall = () => {
    this.renderParts.plane();
    const block = this.renders.node("block");
    let index = 0;
    for (let i of this.config.data.child) {
      const group = this.renders.group(i);
      group.p3(0, this.config.plane.y, -index * this.config.groupOffset);
      block.addChild(group);
      index++;
    }
    block.setAnchor3d(0.5, 0, 0.5);
    this.dm.add(block);
  };

  // 更新渲染数据
  public setData = (data: CabinetItem, renderState?: renderState) => {
    this.dm.clear();
    this.config.data = data;
    if (renderState) this.config.renderState = renderState;
    this.renderOverall();
  };

  // 设置单个柜子的状态
  public setState = (id: string, state: CabinetState) => {
    const s = state || "unknown";
    this.states[s](id);
  };

  // 移动相机
  public moveCamera = (
    eye: Array<number>,
    center: Array<number>,
    animation?: boolean
  ) => {
    this.g3d.moveCamera(eye, center, animation);
  };

  protected getTag = (id: string): Record<string, CabinetNode> => {
    const box = this.dm.getDataByTag(`${PartsKey.box}${id}`) as ht.Node;
    const bs = this.dm.getDataByTag(`${PartsKey.bashou}${id}`) as ht.Node;
    return { box, bs };
  };

  // 设置渲染模式
  public setRenderState = (state: renderState) => {};

  // 柜子的各种状态
  protected states: Record<CabinetState, (a: string) => void> = {
    // 断电
    blackout: id => {
      const { box } = this.getTag(id);
      box.setAttr("state", "blackout");
    },
    // 带电
    charged: id => {
      const { box, bs } = this.getTag(id);
      box.setAttr("state", "charged");
      bs.setAnchor3d([1, -1.4, 0.2]);
      bs.setRotationZ(Math.PI / 2);
    },
    // 未知
    unknown: id => {
      const { box, bs } = this.getTag(id);
      box.setAttr("state", "unknown");
      bs.setAnchor3d([0.5, 0.5, 0.2]);
      bs.setRotationZ((Math.PI / 2) * -0.2);
    },
    // 选中高亮
    highlight: id => {
      const { box } = this.getTag(id);
      box.s("wf.color", "rgb(39,232,194)");
    },
    // 离开取消高亮
    unhighlight: id => {
      const { box } = this.getTag(id);
      box.s("wf.color", "rgb(35,196,164)");
    }
  };
  protected renders = {
    reset: (node: CabinetNode) => {
      node.setAnchor3d([0.5, 0, 0.5]);
      node.p3(0, 0, 0);
      return node;
    },
    node: (type: "block" | "node", s3dt?: shape3dType): CabinetNode => {
      let node = new ht.Node();
      if (type !== "node") {
        node = new ht.Block();
      }
      if (s3dt) {
        node.s("shape3d", s3dt);
      }
      return this.renders.reset(node);
    },
    // 渲染任务个数
    taskLength: (
      opt: { columnLength: number; maxLength: number },
      item: CabinetItem
    ) => {
      const node = this.renders.node("node", "billboard");
      const visible = item.cards > 0 ? true : false;
      node.s3([74, 112, 20]);
      node.s({
        "texture.cache": true,
        "3d.visible": visible,
        shape3d: "billboard",
        "texture.scale": 5,
        "shape3d.image": "custom-icon/alert.json",
        autorotate: true
      });
      node.setAttr("l", item.cards);
      node.p3([
        (opt.columnLength * this.config.x) / 2,
        opt.maxLength * this.config.y + this.config.columnNameHeight + 20,
        0
      ]);
      this.dm.add(node);
      return node;
    },
    // 渲染墙面相关
    metope: (
      opt: { columnLength: number; maxLength: number },
      id: string
    ): CabinetNode => {
      const metope = this.renders.node("node");
      const { x, y, z } = this.config;
      metope.s3(
        x * opt.columnLength + opt.columnLength * this.config.columnOffset,
        y * opt.maxLength +
          opt.maxLength * this.config.columnOffset +
          this.config.columnNameHeight,
        z + 20
      );
      metope.setStyleMap({
        "all.color": this.config.boxColor,
        "all.transparent": true,
        "all.opacity": 0.1,
        interactive: true
      });
      metope.p3(0, 0, 0);
      metope.setTag(`metope${id}`);
      this.dm.add(metope);
      return metope;
    },
    //根据列渲染列名称
    columnName: (name: string, block: CabinetNode, h: number): CabinetNode => {
      const node = this.renders.node("node");
      node.s3(this.config.x, this.config.columnNameHeight, this.config.z);
      node.setStyleMap({
        "texture.scale": 10,
        "texture.cache": true,
        "front.image": "custom-icon/columnName.json",
        "all.color": this.config.boxColor
      });
      node.setAttrObject({
        color: "#3AAAD0",
        name
      });
      node.p3(0, h - this.config.columnOffset, 0);
      this.dm.add(node);
      return node;
    },
    column: (item: CabinetItem, maxLength: number): CabinetNode => {
      const column = this.renders.node("block");
      const max = maxLength - item.child.length;
      let index = 0;
      for (let i of item.child) {
        const distributionBox = this.renderParts.distributionBox(i);
        distributionBox.p3(
          0,
          this.config.y * index + index * this.config.columnOffset,
          0
        );

        column.addChild(distributionBox);
        index++;
      }
      if (max > 0) {
        const bcBlock = this.renders.node("node");
        bcBlock.s3(
          this.config.x,
          this.config.y * max + this.config.columnOffset * max,
          this.config.z
        );

        bcBlock.p3(
          0,
          item.child.length * this.config.y +
            this.config.columnOffset * item.child.length,
          0
        );
        bcBlock.s("all.color", this.config.boxColor);
        this.dm.add(bcBlock);

        column.addChild(bcBlock);
      }

      return column;
    },

    group: (item: CabinetItem): CabinetNode => {
      const group = this.renders.node("block");
      const columnLength = item.child.length;
      let maxLength = 0; // 列最大item个数

      let index = 0;
      for (let i of item.child) {
        maxLength = i.child.length > maxLength ? i.child.length : maxLength;
      }
      const h = maxLength * (this.config.y + this.config.columnOffset);
      for (let i of item.child) {
        const column = this.renders.column(i, maxLength);
        const columnName = this.renders.columnName(i.name, column, h);
        column.addChild(columnName);
        column.p3(
          this.config.x * index + index * this.config.columnOffset,
          0,
          0
        );

        group.addChild(column);
        index++;
      }

      // 绘制每组的墙面
      group.setAnchor3d([0.5, 0, 0.5]);
      const alert = this.renders.taskLength({ columnLength, maxLength }, item);
      group.addChild(alert);

      if (this.config.renderState === "group") {
        const metope = this.renders.metope(
          { columnLength, maxLength },
          item.id
        );

        group.addChild(metope);
      }

      this.dm.add(group);
      return group;
    }
  };
}

export default renderCabinet;
