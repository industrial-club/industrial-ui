import { defineComponent, PropType } from "vue";
import util from "inl-util";

const { className, getSlots, installComponent } = util;

export type InlLayoutArrange = "row" | "column";

const props = {
  arrange: {
    type: String as PropType<InlLayoutArrange>,
    default: "row",
  },
  isBody: Boolean,
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    const cls = className([
      "layout",
      `layout-${_props.arrange}`,
      _props.isBody ? "layout-body" : "",
    ]);
    return () => <div class={cls}>{getSlots(_context).default()}</div>;
  },
});

export default installComponent(com, "layout");
