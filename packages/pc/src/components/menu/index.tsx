import { defineComponent, PropType, ref, provide, watch } from "vue";
import util from "@/utll";

export interface inlMenuItem {
  id?: string;
  name: string;
  url: string;
  icon?: string;
  iconPrefix?: string;
  child: Array<this>;
}
export type InlMenuMode = "vertical" | "horizontal" | "inline";
export type InlMenuTheme = "dark" | "light";

const { className, installComponent, getSlots } = util;
const props = {
  router: Boolean,
  activeKey: {
    type: String,
    default: "",
  },
  mode: {
    type: String as PropType<InlMenuMode>,
  },
  theme: {
    type: String as PropType<InlMenuTheme>,
    default: "dark",
  },
  width: {
    type: Number,
    default() {
      return 200;
    },
  },
  menus: {
    type: Array as PropType<Array<inlMenuItem>>,
    default: [],
  },
};

export const renderMenuItem = (i: inlMenuItem) => {
  return <inl-menu-item {...i} />;
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    const classes = ref(className(["menu", _props.theme]));
    const { inlMenuTitle } = getSlots(_context);
    const activeKey = ref(_props.activeKey);
    const updataFun = (item: inlMenuItem) => {
      activeKey.value = item.url;
      _context.emit("change", item);
    };
    // 选中的key
    provide("activeKey", activeKey);
    provide("updataFun", updataFun);
    provide("router", _props.router);

    // 渲染菜单头部
    const renderInlTitle = () => {
      if (!inlMenuTitle) {
        return () => <div class={className(["menu-title"])}></div>;
      }
      return <div class={className(["menu-title"])}>{inlMenuTitle()}</div>;
    };

    // 渲染menu
    const renderMenus = () => {
      const menusList: Array<JSX.Element> = [];
      for (let i of _props.menus) {
        if (i.child && i.child.length > 0) {
          menusList.push(<inl-menu-sub {...i} />);
        } else {
          menusList.push(renderMenuItem(i));
        }
      }
      return menusList;
    };

    return () => (
      <aside class={classes.value}>
        {renderInlTitle()}
        <ul class={className(["menu-list"])}>{renderMenus()}</ul>
      </aside>
    );
  },
});

export default installComponent(com, "menu");
