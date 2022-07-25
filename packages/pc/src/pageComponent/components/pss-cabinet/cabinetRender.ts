const parts = [
  "brake",
  "card",
  "handle",
  "light",
  "panel",
  "light_on",
  "light_off",
  "light_unknown",
  "light_single_unknown",
  "light_single",
  "light_red_on"
];

class cabinet {
  // 初始化
  constructor(opt: cabinet.c) {
    this.reset.all(opt);
    this.registered();
    setTimeout(() => {
      this.render.overall();
      this.reset.event();
    }, 100);
  }

  protected config: cabinet.c = {
    data: {
      id: "",
      name: ""
    },
    renderState: "group",
    cabinet: {
      x: 80,
      y: 22,
      z: 80,
      boxColor: "#F5F4EB",
      columnOffset: 1,
      offsetZ: 200,
      column: {
        h: 13
      }
    }
  };

  protected dm: ht.DataModel;
  protected g3d: ht.graph3d.Graph3dView;

  protected render = {
    overall: () => {
      const plane = this.render.plane();
      // this.parts.assembly();
      const all = this.create.block();
      const { offsetZ } = this.config.cabinet;
      let index = 0;
      this.dm.add(all);
      all.addChild(plane);
      for (const i of this.config.data.child) {
        const g = this.render.group(i);
        g.p3(0, 0, -index * offsetZ);

        all.addChild(g);
        index++;
      }
    },
    group: (item: cabinet.item) => {
      const group = this.create.block();
      const { columnOffset, x } = this.config.cabinet;
      let index = 0;
      let max = 0;
      this.dm.add(group);
      for (let i of item.child) {
        if (i.child && i.child.length > max) max = i.child.length;
      }
      for (let i of item.child) {
        const c = this.render.column(i, max);
        c.p3((columnOffset + x) * index, 0, 0);
        group.addChild(c);
        index++;
      }
      if (this.config.renderState === "group") {
        const wall = this.render.groupWall(item);
        group.addChild(wall);
      }
      group.setAnchor3d(0.5, 0, 0.5);
      return group;
    },
    groupWall: (item: cabinet.item) => {
      let column = 0,
        row = item.child.length;
      const { x, y, z, columnOffset } = this.config.cabinet;
      for (let i of item.child) {
        if (column < i.child.length) {
          column = i.child.length;
        }
      }
      column = column + 1;
      const wall = this.create.node();
      wall.s3(
        x * row + row * columnOffset + 15,
        y * column + y / 3 + column * columnOffset + 40,
        z + 5
      );
      wall.setAnchor3d(0, 0, 0);
      wall.p3(-47.5, -20, 0);
      wall.setTag(`wall${item.id}`);
      wall.s({
        "all.transparent": true,
        "all.opacity": 0.1,
        interactive: true
      });
      this.dm.add(wall);
      return wall;
    },
    // 渲染任务个数
    taskLength: (
      opt: { columnLength: number; maxLength: number },
      item: cabinet.item
    ) => {
      const node = this.create.node();
      const { x, y } = this.config.cabinet;
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
      node.p3([(opt.columnLength * x) / 2, opt.maxLength * y + 20, 0]);
      this.dm.add(node);
      return node;
    },
    column: (item: cabinet.item, max: number) => {
      const column = this.create.block();
      const { columnOffset, y } = this.config.cabinet;
      const h = y / 3;
      const tail = this.parts.tail(item, h);
      const xz = max - item.child.length;
      const { headerFill, headerName } = this.parts.head(item, max);
      column.setSyncSize(false);

      this.dm.add(column);

      let index = 0;
      for (let i of item.child) {
        const assembly = this.parts.assembly(i);
        assembly.p3(0, (y + columnOffset) * index, 0);
        column.addChild(assembly);
        index++;
      }

      column.addChild(tail);
      column.addChild(headerFill);
      column.addChild(headerName);
      if (xz > 0) {
        const fillNode = this.parts.fillNode(item, max);
        column.addChild(fillNode);
      }
      return column;
    },
    // 地板
    plane: () => {
      const { x, y, z, offsetZ, columnOffset } = this.config.cabinet;
      const g = this.config.data.child.length;
      let columnMaxL = 0;
      for (let i of this.config.data.child) {
        if (i.child.length > columnMaxL) {
          columnMaxL = i.child.length;
        }
      }
      const plane = this.create.node();
      const planeZ = g * (z + offsetZ);
      const planeX = columnMaxL * (x + columnOffset) + offsetZ * 2;
      plane.s({
        "all.color": "#234A49"
      });
      plane.p3(0, 0, -planeZ * 0.25 + offsetZ * 0.3);
      plane.s3(planeX, 5, planeZ);
      this.dm.add(plane);
      return plane;
    }
  };

  protected state = {
    set: (item: cabinet.item, arr: Record<string, ht.Node>) => {
      if (item.state && this.state[item.state]) {
        this.state[item.state](item, arr);
      } else {
        this.state.unknown(item, arr);
      }
    },
    blackout: (item: cabinet.item, arr: Record<string, ht.Node>) => {},
    charged: (item: cabinet.item, arr: Record<string, ht.Node>) => {
      const brake = arr["brake"];
      const light = arr["light"];
      light.s({
        shape3d: "light_red_on",
        "texture.scale": 10
      });
      brake.setRotationZ(-Math.PI / 2);
    },
    unknown: (item: cabinet.item, arr: Record<string, ht.Node>) => {
      const brake = arr["brake"];
      const light = arr["light"];
      light.s({
        shape3d: "light_single_unknown" // light_unknown
      });
      brake.setRotationZ((Math.PI / 2) * -0.2);
    }
  };

  protected parts = {
    assembly: (item: cabinet.item, hideParts?: Boolean) => {
      // 组装单个配电柜
      const blockCabinet = this.create.block();
      const box = this.parts.box();
      this.dm.add(blockCabinet);
      blockCabinet.addChild(box);
      blockCabinet.setAnchor3d(0.5, 0, 0);
      if (hideParts) return blockCabinet;
      const { h1, h2 } = this.parts.handle(item);
      const brake = this.parts.brake(item);
      // const panel = this.parts.panel(item);
      const light = this.parts.light(item);
      const blueCard = this.parts.blueCard(item);

      let partsNode = [h1, h2, brake, light, blueCard]; // panel

      if (item.cards && item.cards !== 0 && !isNaN(item.cards)) {
        const card = this.parts.card(item);
        const cardv = this.parts.cardv(item);
        partsNode.push(card, cardv);
      }
      for (let i of partsNode) {
        blockCabinet.addChild(i);
      }
      this.state.set(item, { brake, light });

      return blockCabinet;
    },
    box: () => {
      const box = this.create.node();
      const { x, y, z, boxColor } = this.config.cabinet;
      box.s3(x, y, z);
      box.s({
        "all.color": boxColor
      });
      this.dm.add(box);
      return box;
    },
    fillNode: (item: cabinet.item, m: number) => {
      const fillNode = this.create.node();
      const { x, z, y, columnOffset, boxColor } = this.config.cabinet;
      const p3 = {
        x,
        z,
        y: (y + columnOffset) * (m - item.child.length) - columnOffset
      };
      fillNode.s3(x, p3.y, z);
      fillNode.s({
        "all.color": boxColor
      });
      fillNode.setAnchor3d(0.5, 0, 0);
      fillNode.p3(0, item.child.length * (y + columnOffset), 0);

      this.dm.add(fillNode);
      return fillNode;
    },
    head: (item: cabinet.item, m: number) => {
      const headerFill = this.parts.assembly(item, true);
      const { x, z, y, columnOffset, boxColor, column } = this.config.cabinet;
      const p3 = [0, 0, 0];

      p3[1] = m * y + columnOffset * m;
      headerFill.p3(p3);

      const headerName = this.create.node();
      const np3 = p3;
      np3[1] = p3[1] + y + columnOffset;
      headerName.s3(x, column.h, z);
      headerName.s({
        "all.color": "red"
      });

      headerName.p3(np3);
      headerName.setAnchor3d(0.5, 0, 0);
      headerName.s({
        "texture.scale": 10,
        "texture.cache": true,
        "front.image": "custom-icon/cnv.json",
        "all.color": boxColor
      });
      headerName.setAttr("v", item.name);
      this.dm.add(headerName);
      return { headerFill, headerName };
    },
    tail: (item: cabinet.item, h: number) => {
      const { x, z, columnOffset, boxColor } = this.config.cabinet;
      const tail = this.create.block();
      this.dm.add(tail);
      const node1 = this.create.node();
      const node2 = this.create.node();
      node1.s3(x, h, z);
      node2.s3(x * 0.7, h / 2, z + 0.5);
      node2.p3(0, 0, 0.5);
      node2.s({
        "all.color": "black"
      });
      node1.s({
        "all.color": boxColor
      });
      this.dm.add(node1);
      this.dm.add(node2);
      tail.addChild(node1);
      tail.addChild(node2);
      tail.setAnchor3d(0.5, 0, 0);
      tail.p3(0, -(h + columnOffset), 0);
      return tail;
    },
    handle: (item: cabinet.item) => {
      const h1 = this.create.node();
      const h2 = this.create.node();
      const offset = 12;
      const { x, z } = this.config.cabinet;
      const p3 = [x / 2 - offset, 3, z];
      h1.s({
        shape3d: "handle"
      });
      h2.s({
        shape3d: "handle"
      });

      h1.setAnchor3d(0.5, 0.5, 0);
      h2.setAnchor3d(0.5, 0.5, 0);

      h1.p3(p3);
      h2.p3(-p3[0], p3[1], p3[2]);
      this.dm.add(h1);
      this.dm.add(h2);
      return { h1, h2 };
    },
    brake: (item: cabinet.item) => {
      const brake = this.create.node();
      const { x, y, z } = this.config.cabinet;
      brake.s({
        shape3d: "brake"
      });
      brake.p3(-x / 2 + 30, y * 0.5, z);
      this.dm.add(brake);
      return brake;
    },
    panel: (item: cabinet.item) => {
      const panel = this.create.node();
      const { x, y, z } = this.config.cabinet;
      panel.s({
        shape3d: "panel"
      });
      panel.p3(x / 4, y * 0.58, z + 1);
      this.dm.add(panel);
      return panel;
    },
    light: (item: cabinet.item) => {
      const light = this.create.node();
      const { x, y, z } = this.config.cabinet;
      light.s({
        shape3d: "light_single" //light
      });
      light.p3(x / 4, y * 0.65, z + 2);
      this.dm.add(light);
      return light;
    },
    card: (item: cabinet.item) => {
      const card = this.create.node();
      const { x, y, z } = this.config.cabinet;
      card.s({
        shape3d: "card"
      });
      card.p3(-x / 2 + 30, y * 0.23, z + 0.5);
      this.dm.add(card);
      return card;
    },
    cardv: (item: cabinet.item) => {
      const cardv = this.create.node();
      const { x, y, z } = this.config.cabinet;
      cardv.s({
        shape3d: "billboard",
        "texture.scale": 10,
        "texture.cache": true,
        interactive: true,
        "shape3d.image": "custom-icon/cardVal.json"
      });
      cardv.p3(-x / 2 + 30, y * 0.05, z + 1);
      cardv.s3(20, 10, 1);
      this.dm.add(cardv);
      cardv.setTag(`cardv${item.id}`);
      cardv.setAttr("v", item.cards);
      return cardv;
    },
    blueCard: (item: cabinet.item) => {
      const blueCard = this.create.node();
      const { x, y, z } = this.config.cabinet;
      blueCard.p3(-x / 2 + 12, y * 0.65, z + 0.5);
      blueCard.s3(15, 10, 1);
      this.dm.add(blueCard);
      blueCard.s({
        shape3d: "billboard",
        "texture.cache": true,
        "texture.scale": 10,
        "shape3d.image": "custom-icon/bCard.json"
      });
      blueCard.setAttr("v", item.name || "未知");
      return blueCard;
    }
  };

  protected create = {
    node: () => new ht.Node(),
    block: () => new ht.Block()
  };

  protected registered = () => {
    const heDef = ht.Default as any;
    // 注册相关零部件
    const load = (obj, mtl, p) => {
      heDef.loadObj(obj, mtl, p);
    };

    for (let i of parts) {
      const data = {
        obj: `objs/cabinet/${i}.obj`,
        mtl: `objs/cabinet/${i}.mtl`
      };
      load(data.obj, data.mtl, {
        center: true,
        cube: true,
        finishFunc(modelMap, array, rawS3) {
          heDef.setShape3dModel(i, array);
        }
      });
    }
  };

  // 更新渲染数据
  public setData = (data: cabinet.item, renderState?: any) => {
    this.dm.clear();
    this.config.data = data;
    if (renderState) this.config.renderState = renderState;
    this.render.overall();
  };

  // 移动相机
  public moveCamera = (
    eye: Array<number>,
    center: Array<number>,
    animation?: boolean
  ) => {
    this.g3d.moveCamera(eye, center, animation);
  };

  protected reset = {
    all: (opt: cabinet.c) => {
      this.reset.config(opt);
      this.reset.base();
    },
    config: (opt: cabinet.c) => {
      this.config = Object.assign(this.config, opt);
    },
    base: () => {
      const dmid = document.getElementById(this.config.domId) as HTMLDivElement;
      this.dm = new ht.DataModel();
      this.g3d = new ht.graph3d.Graph3dView(this.dm);
      window["dm"] = this.dm;
      window["g3d"] = this.g3d;

      // 加判断
      this.g3d.addToDOM(dmid);
      this.reset.sceneDecoration();
    },
    sceneDecoration: () => {
      // 天空球
      const sky = new ht.Node();
      sky.s({
        shape3d: "sphere",
        "shape3d.image": "custom-icon/cabinet/tex/HDR.jpg",
        "shape3d.blend": null,
        envmap: 0.58,
        "2d.movable": false,
        "3d.movable": false,
        "shape3d.image.cache": true
      });
      this.g3d.setSkyBox(sky);
    },
    event: () => {
      this.g3d.mi(e => {
        const data = e.data as ht.Node;
        const event = e.event;
        if (e.kind === "onClick") {
          const tag = data.getTag();
          const iscard = tag.indexOf("cardv");
          const isgroup = tag.indexOf("wall");
          const id = tag.replace("cardv", "");
          if (
            iscard === 0 &&
            e.type === "image" &&
            this.config.renderState === "row"
          ) {
            this.cabinetLoopClick(event, id);
          }
          if (this.config.renderState === "group" && isgroup === 0) {
            window.rowClick(id);
          }
        }
      });
    }
  };
  // 回路事件
  protected cabinetLoopClick = (e: MouseEvent, id: string) => {
    if (!window.cabinetLoopClick) {
      return this.errorEvent("window上不存在 ·cabinetLoopClick· 事件 .");
    }

    // 给当前点击的盒子添加高亮
    window.cabinetLoopClick(e, id);
  };
  protected errorEvent = (s: string) => {
    throw new Error(s);
  };
}
export default cabinet;
