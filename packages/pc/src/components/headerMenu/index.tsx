import { defineComponent, PropType, ref, watch } from "vue";
import utils from "@/utils";
import { dividerProps } from "ant-design-vue/lib/divider";
import useVModel from "@/pageComponent/hooks/useVModel";

const props = {
  active: {
    type: (String as PropType<string>) || (Number as PropType<number>),
    default: "",
  },
  type: {
    type: String as PropType<string>,
    default: "center",
  },
  title: {
    type: String as PropType<string>,
  },
  mode: {
    type: String as PropType<string>,
    default: "center",
  },
  className: {
    type: String as PropType<string>,
    default: "",
  },
  titleClassName: {
    type: String as PropType<string>,
    default: "",
  },
  itemClassName: {
    type: String as PropType<string>,
    default: "",
  },
  menuList: {
    type: Array as PropType<Array<any>>,
    default: [],
  },
};

const HeaderMenu = defineComponent({
  props,
  emits: ["change", "update:active"],
  setup(prop, { slots, emit }) {
    const active = useVModel(prop, "active", emit);
    const menuLeft = prop.menuList.slice(
      0,
      prop.menuList.length % 2 === 0
        ? prop.menuList.length / 2
        : prop.menuList.length
    );
    const menuRight = prop.menuList.slice(
      prop.menuList.length % 2 === 0 ? prop.menuList.length / 2 : 0,
      prop.menuList.length
    );
    return () => (
      <div class={["inl-header-menu", prop.className]}>
        <div
          class={["inl-header-menu-content", `inl-header-menu-${prop.mode}`]}
        >
          {prop.mode === "center" ? (
            <>
              <div class="inl-header-menu-content-left">
                {menuLeft.map((item) => (
                  <inl-header-menu-item
                    active={prop.active}
                    value={item.key}
                    className={prop.itemClassName}
                    onActiveChange={(value) => {
                      emit("update:active", value);
                      emit("change", value);
                    }}
                  >
                    {item.name}
                  </inl-header-menu-item>
                ))}
              </div>
              <inl-header-menu-title
                mode={prop.mode}
                className={prop.titleClassName}
              >
                {prop.title}
              </inl-header-menu-title>
              <div class="inl-header-menu-content-right">
                {menuRight.map((item) => (
                  <inl-header-menu-item
                    active={prop.active}
                    value={item.key}
                    className={prop.itemClassName}
                    onActiveChange={(value) => {
                      emit("update:active", value);
                      emit("change", value);
                    }}
                  >
                    {item.name}
                  </inl-header-menu-item>
                ))}
              </div>
            </>
          ) : (
            <>
              <inl-header-menu-title
                mode={prop.mode}
                className={prop.titleClassName}
              >
                {prop.title}
              </inl-header-menu-title>
              <div class="inl-header-menu-content-right">
                {prop.menuList.map((item) => (
                  <inl-header-menu-item
                    active={prop.active}
                    value={item.key}
                    className={prop.itemClassName}
                    onActiveChange={(value) => {
                      emit("update:active", value);
                      emit("change", value);
                    }}
                  >
                    {item.name}
                  </inl-header-menu-item>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
});

export default utils.installComponent(HeaderMenu, "header-menu");
