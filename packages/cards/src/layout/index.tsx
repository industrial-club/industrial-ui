import { defineComponent, PropType, resolveComponent } from "vue";
import { prefix } from "./../config";

export type LayoutPlatform = "app" | "pad" | "pc";
export interface CardInfo {
  name: string;
  row: number;
  col: number;
  componentName: string;
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
        row: 2,
        col: 2,
      },
      {
        name: "aa",
        componentName: "card_2",
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
    return () => (
      <>
        <style>{`.${classname}{grid-template-columns: repeat(${prop.col}, ${col});
  grid-template-rows: repeat(${prop.row}, ${row});}`}</style>
        <div class={[classname, `${classname}_${prop.layout}`]}>
          {prop.cards.map((item, key) => {
            const componentName = resolveComponent(
              `${prefix}-${item.componentName}`
            );
            console.log(key);
            const gridColumn = "span 2";
            return <componentName style={{ gridColumn }} />;
          })}
        </div>
      </>
    );
  },
});
