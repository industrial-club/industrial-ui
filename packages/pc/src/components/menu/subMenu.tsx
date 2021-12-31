import { defineComponent, PropType, ref } from "vue";
import util from "@/utll";
import { inlMenuItem, renderMenuItem } from "./index";

const { className, installComponent, getSlots } = util;
const props = {
  name: {
    type: String,
    default: "",
  },
  child: {
    type: Array as PropType<Array<inlMenuItem>>,
    default: [],
  },
  url: String,
};

const com = defineComponent({
  props,
  setup(_props, _context) {
    const cn = ref(className(["menu-sub", "menu-item"]));

    const renderMenusSub = (item: inlMenuItem): JSX.Element => {
      const menusubel: Array<JSX.Element> = [];
      for (let i of item.child) {
        if (i.child && i.child.length > 0) {
          menusubel.push(renderMenusSub(i));
        } else {
          menusubel.push(renderMenuItem(i));
        }
      }
      return (
        <div class={cn.value}>
          <div class={className(["menu-sub-title", "menu-item"])}>
            <span class={className(["menu-sub-name"])}>{item.name}</span>
          </div>
          <ul class={className("menu-sub-list")}>{menusubel}</ul>
        </div>
      );
    };

    const renderMenusSubBox = (item: Array<inlMenuItem>) => {
      const menusubel: Array<JSX.Element> = [];
      for (let i of item) {
        if (i.child && i.child.length > 0) {
          menusubel.push(renderMenusSub(i));
        } else {
          menusubel.push(renderMenuItem(i));
        }
      }
      return menusubel;
    };
    return () => renderMenusSubBox(_props.child);
  },
});

export default installComponent(com, "menu-sub");
