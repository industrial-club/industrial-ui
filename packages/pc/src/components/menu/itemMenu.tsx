import { defineComponent, inject, Ref, ref, watch } from "vue";
import util from "@/utll";

const { className, installComponent, getSlots } = util;
const props = {
  name: {
    type: String,
    default: "",
  },
  url: String,
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    const key = inject<Ref<string>>("activeKey")!;
    const updataFun = inject<any>("updataFun")!;

    const cn = ref();

    watch(
      () => key,
      () => {
        cn.value = className([
          "menu-item",
          _props.url === key.value ? "menu-item-active" : "",
        ]);
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return () => (
      <li
        class={cn.value}
        onClick={() => {
          // _context.emit("changeActive", _props);
          updataFun(_props);
        }}
      >
        <span class={className(["menu-item-name"])}>{_props.name}</span>
      </li>
    );
  },
});

export default installComponent(com, "menu-item");
