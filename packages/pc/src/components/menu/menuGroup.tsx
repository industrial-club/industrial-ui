import { defineComponent, PropType, ref, inject, Ref, watch } from "vue";
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
    const cn = ref(className(["menu-group", "menu-item"]));
    const key = inject<Ref<string>>("activeKey")!;
    const allOpen = inject<Ref<boolean>>("allOpen")!; // 是否全部打开
    const isopen = ref(false);

    if (allOpen) {
      isopen.value = true;
    }

    const menuGroupClick = () => {
      isopen.value = !isopen.value;
    };

    const renderMenusSubBox = (item: Array<inlMenuItem>) => {
      const menusubel: Array<JSX.Element> = [];
      for (let i of item) {
        if (i.child && i.child.length > 0) {
          menusubel.push(<inl-menu-group {...i} />);
        } else {
          menusubel.push(renderMenuItem(i));
        }
      }
      return (
        <li class={cn.value}>
          <div
            class={className(["menu-group-title", "menu-item"])}
            onClick={menuGroupClick}
          >
            <span class={className(["menu-group-name"])}>{_props.name}</span>
            <i
              class={[
                "industrial",
                "rotate",
                isopen.value ? "rotate-open" : "rotate-close",
              ]}
            ></i>
          </div>
          <ul
            class={[
              ...className(["menu-group-list"]),
              "expand",
              isopen.value ? "expand-open" : "expand-close",
            ]}
          >
            {menusubel}
          </ul>
        </li>
      );
    };
    return () => renderMenusSubBox(_props.child);
  },
});

export default installComponent(com, "menu-group");
