import { defineComponent, PropType, watch } from "vue";
import util from "inl-util";

const { className, installComponent, getSlots } = util;

const props = {
  type: {
    type: String as PropType<InlPc.Type>,
    default: "",
  },
  size: {
    type: String as PropType<InlPc.Size>,
    default: "",
  },
  disabled: Boolean,
  icon: String,
  shape: {
    type: String as PropType<InlPc.Shape>,
    default: "",
  },
  block: Boolean,
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    let cls: InlPc.Class = "";
    if (_props.disabled) {
      console.log(_props.disabled);
    }
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
