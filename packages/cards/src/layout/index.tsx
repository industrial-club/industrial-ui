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
        name: "aa",
        componentName: "alarm",
        row: "1/3",
        col: "1/2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "生产情况",
        componentName: "production",
        row: "1/3",
        col: "5/5",
        key: "",
        tabs: [
          {
            name: "11",
            id: "1",
          },
          {
            name: "22",
            id: "2",
          },
          {
            name: "33",
            id: "3",
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
          const componentName = resolveComponent(
            `${prefix}-${item.componentName}`
          );
          if (item.tabs && item.tabs.length > 0) {
            item.key = item.tabs[0].id;
          }
          let com = (
            <inl-card-box
              tabList={item.tabs}
              titleName={item.name}
              v-model={[item.key, "activeKey"]}
            >
              <componentName code={item.key} />
            </inl-card-box>
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
                tabList={item.tabs}
                titleName={item.name}
                v-model={[item.key, "activeKey"]}
              >
                <componentName code={item.key} />
              </inl-card-box>
            );
          }

          return com;
        })}
      </div>
    );
  },
});
