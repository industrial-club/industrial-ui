import {
  defineComponent,
  PropType,
  resolveComponent,
  HtmlHTMLAttributes,
  ref,
} from "vue";
import { prefix } from "./../config";

export type LayoutPlatform = "app" | "pad" | "pc";
export interface CardInfo {
  name: string;
  row: string;
  col: string;
  componentName: string;
  tabs?: Array<{ [key: string]: string }>;
  key?: string;
}

const props = {
  layout: {
    type: String as PropType<LayoutPlatform>,
    default: "pc",
  },
  row: {
    type: Number,
    default: 4,
  },
  col: {
    type: Number,
    default: 5,
  },
  cards: {
    type: Array as PropType<Array<CardInfo>>,
    default: [
      {
        name: "生产情况",
        componentName: "production",
        row: "1/2",
        col: "1/1",
      },
      {
        name: "气象站环境数据",
        componentName: "meteorological",
        row: "3/1",
        col: "1/1",
      },
      {
        name: "能源消耗",
        componentName: "energy",
        row: "1/1",
        col: "5/1",
        tabs: [
          {
            name: "药耗",
            id: "0",
          },
          {
            name: "介耗",
            id: "1",
          },
          {
            name: "水耗",
            id: "2",
          },
          {
            name: "电耗",
            id: "3",
          },
        ],
      },
      {
        name: "生产时长",
        componentName: "productionTime",
        row: "2/1",
        col: "5/1",
        tabs: [
          {
            name: "天",
            id: "DAY",
          },
          {
            name: "月",
            id: "MONTH",
          },
        ],
      },
    ],
  },
};

export default defineComponent({
  props,
  setup(prop, ctx) {
    const classname = prefix + "_layout";
    const row = (1 / prop.row) * 100 + "%";
    const col = (1 / prop.col) * 100 + "%";

    const layoutStyle = {
      gridTemplateColumns: `repeat(${prop.col}, ${col})`,
      gridTemplateRows: `repeat(${prop.row}, ${row})`,
    };

    return () => (
      <div
        class={[classname, `${classname}_${prop.layout}`]}
        style={layoutStyle}
      >
        {prop.cards.map((item) => {
          let com = (
            <inl-card-box
              componentName={item.componentName}
              tabList={item.tabs}
              titleName={item.name}
            ></inl-card-box>
          );

          if (item.col && item.row) {
            const rows = item.row.split("/");
            const cols = item.col.split("/");
            const rowStart = rows[0];
            const rowEnd = `span ${rows[1]}`;
            const colStart = cols[0];
            const colEnd = `span ${cols[1]}`;
            const gridArea = `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`;
            com = (
              <inl-card-box
                style={{ gridArea }}
                componentName={item.componentName}
                tabList={item.tabs}
                titleName={item.name}
              ></inl-card-box>
            );
          }

          return com;
        })}
      </div>
    );
  },
});
