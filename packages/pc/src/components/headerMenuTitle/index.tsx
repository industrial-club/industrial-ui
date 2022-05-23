import { defineComponent, PropType } from "vue";
import utils from "@/utils";

const props = {
  className: {
    type: String as PropType<string>,
    default: "",
  },
  mode: {
    type: String as PropType<string>,
    default: "center",
  },
};

const HeaderMenuTitle = defineComponent({
  props,
  setup(prop, { slots, emit }) {
    return () => (
      <div
        class={[
          "inl-header-menu-title",
          `inl-header-menu-${prop.mode}-title`,
          prop.className,
        ]}
      >
        <div class="inl-header-menu-title-text">{slots.default?.()}</div>
      </div>
    );
  },
});

export default utils.installComponent(HeaderMenuTitle, "header-menu-title");
