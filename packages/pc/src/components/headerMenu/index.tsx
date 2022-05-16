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
};

const menuList = [
  {
    name: "智能监控",
    key: "monitor",
  },
  {
    name: "报警管理",
    key: "alarm",
  },
  {
    name: "辅助系统",
    key: "assist",
  },
  {
    name: "设备管理",
    key: "device",
  },
  {
    name: "在线监测",
    key: "online",
  },
  {
    name: "系统管理",
    key: "system",
  },
];
const HeaderMenu = defineComponent({
  props,
  setup(prop, { slots, emit }) {
    const active = useVModel(prop, "active", emit);
    const menuLeft = menuList.slice(
      0,
      menuList.length % 2 === 0 ? menuList.length / 2 : menuList.length
    );
    const menuRight = menuList.slice(
      menuList.length % 2 === 0 ? menuList.length / 2 : 0,
      menuList.length
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
                {menuList.map((item) => (
                  <inl-header-menu-item
                    active={prop.active}
                    value={item.key}
                    className={prop.itemClassName}
                    onActiveChange={(value) => {
                      emit("update:active", value);
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
