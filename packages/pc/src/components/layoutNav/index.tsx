/**
 * 布局组件 - 顶部菜单
 */
import { defineComponent, onMounted, PropType, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getActiveNavByProp } from "@/utils/route";

import utils from "@/utils";
import useWatchOnce from "@/pageComponent/hooks/useWatchOnce";

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

    // 刷新页面后恢复选中的nav标签
    watch(
      () => state.selectedKeys,
      (val) => {
        if (val[0]) {
          localStorage.setItem("activeNavKey", val[0]);
        }
      }
    );
    const cancleWatchMenu = watch(
      () => prop.menu,
      (val) => {
        if (val.length > 0) {
          cancleWatchMenu();
          if (state.selectedKeys.length === 0) {
            const activeKey = localStorage.getItem("activeNavKey");
            if (!activeKey) return;
            const activeNav = val.find((item: any) => item.code === activeKey);
            if (activeNav) {
              state.selectedKeys = [activeKey];
              context.emit("routeChange", activeNav);
            }
          }
        }
      },
      { immediate: true }
    );

    // 菜单初始化后选中第一个
    watch(
      () => prop.menu,
      () => {
        if (
          prop.menu.length &&
          !route.query.menuCode &&
          !state.selectedKeys.length
        ) {
          state.selectedKeys = [prop.menu[0].code];
          context.emit("routeChange", prop.menu[0]);
        }
      },
      { immediate: true, flush: "post" }
    );

    const toPath = (code: string, item?: any) => {
      router.push(`/?menuCode=${code}`);
    };

    watch(
      [route, () => prop.menu],
      () => {
        const { menuCode: code } = route.query as any;
        if (code) {
          const activeNavCode = getActiveNavByProp(
            "code",
            code,
            prop.userMenuTree
          );
          const activeNavUrl = getActiveNavByProp(
            "url",
            code,
            prop.userMenuTree
          );
          const activeNav = activeNavCode || activeNavUrl;
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
