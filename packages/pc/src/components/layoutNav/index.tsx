/**
 * 布局组件 - 顶部菜单
 */
import { defineComponent, PropType, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getActiveNavByCode } from "@/utils/route";

import utils from "@/utils";

// props
const props = {
  menu: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  userMenuTree: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
};

interface SOLT {
  icon?: Function;
  title: Function;
}

interface State {
  selectedKeys: Array<string>;
}

const LayoutNav = defineComponent({
  emits: ["routeChange"],
  props,
  setup(prop, context) {
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      selectedKeys: [],
    });

    // 菜单初始化后选中第一个
    watch(
      () => prop.menu,
      () => {
        if (prop.menu.length && !route.query.menuCode) {
          state.selectedKeys = [prop.menu[0].code];
          context.emit("routeChange", prop.menu[0]);
        }
      },
      { immediate: true }
    );

    const toPath = (code: string, item?: any) => {
      router.push(`/?menuCode=${code}`);
    };

    watch(
      [route, () => prop.menu],
      () => {
        const { menuCode: code } = route.query as any;
        if (code) {
          const activeNav = getActiveNavByCode(code, prop.userMenuTree);
          if (activeNav) {
            state.selectedKeys = [activeNav.code];
            context.emit("routeChange", activeNav);
          }
        } else if (prop.menu.length) {
          state.selectedKeys = [prop.menu[0].code];
          toPath(prop.menu[0].code);
        }
      },
      { immediate: true }
    );

    const getMenuItem = (obj: any, fPath?: string) => {
      return obj.map((item: any, index: string) => {
        return (
          <a-menu-item
            key={item.code}
            title={item.name}
            onClick={() => toPath(item.code, item)}
            v-slots={{
              icon: () =>
                item.icon && (
                  <icon-font
                    style={{ fontSize: "20px" }}
                    type={item.icon}
                  ></icon-font>
                ),
            }}
          >
            {item.name}
          </a-menu-item>
        );
      });
    };

    return () => (
      <a-menu
        class="layoutNav"
        mode="horizontal"
        v-model={[state.selectedKeys, "selectedKeys"]}
      >
        {getMenuItem(prop.menu)}
      </a-menu>
    );
  },
});

export default utils.installComponent(LayoutNav, "layout-nav");
