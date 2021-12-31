import { defineComponent, PropType } from "vue";
import { className, getSlots, installComponent } from "inl-util";

const props = {
  arrange: {
    type: String as PropType<"row" | "column">,
    default: "row",
  },
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    const cls = className(["layout-header", `layout-header-${_props.arrange}`]);
    return () => <div class={cls}>{getSlots(_context).default()}</div>;
  },
});

export default installComponent(com, "layout-header");
