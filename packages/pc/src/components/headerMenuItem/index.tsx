import { defineComponent, PropType, ref, watch } from "vue";
import utils from "@/utils";

const props = {
  active: {
    type: (String as PropType<string>) || (Number as PropType<number>),
    default: "",
  },
  value: {
    type: (String as PropType<string>) || (Number as PropType<number>),
    default: "",
  },
  className: {
    type: String as PropType<string>,
    default: "",
  },
};

const HeaderMenuItem = defineComponent({
  props,
  emits: ["activeChange"],
  setup(prop, { slots, emit }) {
    const active = ref("");
    watch(
      () => prop.active,
      (e) => {
        active.value = e;
      },
      {
        immediate: true,
      }
    );
    return () => (
      <div
        class={[
          "inl-header-menu-item",
          active.value === prop.value ? "inl-header-menu-item-active" : "",
          prop.className,
        ]}
        onClick={() => {
          emit("activeChange", prop.value);
        }}
      >
        {slots.icon?.()}
        <span>{slots.default?.()}</span>
      </div>
    );
  },
});
export default utils.installComponent(HeaderMenuItem, "header-menu-item");
