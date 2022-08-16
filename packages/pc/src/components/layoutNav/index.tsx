import {
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import useMenuCode from "@/hooks/useMenuCode";
import { cloneDeep } from "lodash";
import { getActiveNavByProp } from "@/utils/route";

import utils from "@/utils";

interface State {
  selectedKeys: Array<string>;
}

/**
 * 布局组件 - 顶部菜单
 *  1: 默认进入系统 选择上一次的菜单(localStorage)或第一个菜单
 *  2: 监听menuCode变化，如果是当前导航下的菜单，要选中对应导航菜单
 *  3: 监听menuCode 设置当前选中的导航
 */
const LayoutNav = defineComponent({
  emits: ["navChange"],
  props: {
    menu: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const menuCode = useMenuCode();

    const state: State = reactive({
      selectedKeys: [],
    });

    // 设置到localStorage中，为了保存上一次选择的菜单
    watch(
      () => state.selectedKeys,
      (val) => {
        if (val[0]) {
          localStorage.setItem("activeNavKey", val[0]);
        }
      },
      { immediate: true }
    );

    // 跳转对应的导航
    const jump2Menu = (menu: any) => {
      const { code } = menu;
      code && (menuCode.value = code);
      emit("navChange", menu);
    };

    // 进入默认的菜单
    const toDefaultMenu = () => {
      const activeNavKey = localStorage.getItem("activeNavKey");
      if (activeNavKey) {
        const activeNav = props.menu.find((item) => item.code === activeNavKey);
        activeNav && jump2Menu(activeNav);
      } else {
        props.menu[0] && jump2Menu(props.menu[0]);
      }
    };

    // 监听菜单code
    const isInit = ref(false);
    watchEffect(async () => {
      if (!props.menu?.length) return;
      if (menuCode.value) {
        // 设置选中的菜单
        const activeNav = getActiveNavByProp(
          "code",
          menuCode.value,
          props.menu
        );
        if (activeNav) {
          state.selectedKeys = [activeNav.code];
        } else if (!isInit.value) {
          const prevRouteQuery = cloneDeep(route.query);
          toDefaultMenu();
          setTimeout(() => {
            router.push({ query: prevRouteQuery });
          });
        }
      } else {
        // 第一次进入系统 没有选择菜单 默认选择第一个
        toDefaultMenu();
      }
      isInit.value = true;
    });

    return () => (
      <a-menu
        class="layoutNav"
        mode="horizontal"
        v-model={[state.selectedKeys, "selectedKeys"]}
      >
        {props.menu.map((item) => (
          <a-menu-item
            key={item.code}
            title={item.name}
            onClick={() => jump2Menu(item)}
          >
            {{
              icon: () =>
                item.icon && (
                  <icon-font
                    style={{ fontSize: "20px" }}
                    type={item.icon}
                  ></icon-font>
                ),
              default: () => item.name,
            }}
          </a-menu-item>
        ))}
      </a-menu>
    );
  },
});

export default utils.installComponent(LayoutNav, "layout-nav");
