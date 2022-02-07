import { defineComponent, PropType, watch } from "vue";
import util from "inl-util";

const { className, installComponent, getSlots } = util;

export type InlButtonSize = "m" | "l" | "xl" | "xxl";
export type InlButtonType = "default" | "success" | "error" | "warn" | "";
export type InlButtonShape = "circle" | "round" | "";

const props = {
  type: {
    type: String as PropType<InlButtonType>,
    default: "",
  },
  size: {
    type: String as PropType<InlButtonSize>,
    default: "",
  },
  disabled: Boolean,
  icon: String,
  shape: {
    type: String as PropType<InlButtonShape>,
    default: "",
  },
  block: Boolean,
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    let cls: any = "";

    watch(
      () => [_props.type, _props.size, _props.shape, _props.block],
      () => {
        cls = className([
          "button",
          _props.type ? `button-type-${_props.type}` : "",
          _props.size ? `button-size-${_props.size}` : "",
          _props.shape ? `button-shape-${_props.shape}` : "",
          _props.block ? "button-block" : "",
        ]);
      },
      {
        immediate: true,
      }
    );
    const defText = getSlots(_context).default;
    return () => (
      <button class={cls}>
        {_props.icon ? <i class={_props.icon}></i> : ""}
        <span>
          <defText />
        </span>
      </button>
    );
  },
});

export default installComponent(com, "button");
