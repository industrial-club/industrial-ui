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

    watch(
      () => key,
      () => {},
      { deep: true }
    );

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
          <div class={className(["menu-group-title", "menu-item"])}>
            <span class={className(["menu-group-name"])}>{_props.name}</span>
          </div>
          <ul class={className(["menu-group-list", "menu-group-list-open"])}>
            {menusubel}
          </ul>
        </li>
      );
    };
    return () => renderMenusSubBox(_props.child);
  },
});

export default installComponent(com, "menu-group");
