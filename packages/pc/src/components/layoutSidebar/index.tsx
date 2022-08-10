import {
  defineComponent,
  reactive,
  PropType,
  computed,
  watchEffect,
  watch,
  nextTick,
  ref,
  onMounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import useMenuCode from "@/hooks/useMenuCode";
import utils from "@/utils";
import {
  getParentMenuByCode,
  getOpenUrl,
  getActiveNavByProp,
  getMenuByCode,
} from "@/utils/route";

interface State {
  openKeys: Array<string>;
  selectedKeys: Array<string>;
}

/**
 * 布局组件 - 侧边菜单
 *  1: 递归渲染当前导航菜单的子菜单
 *  2: 实时更新选中的菜单code
 *  3: 如果跳转的是新窗口 需要加上协议、ip、端口、token、userId
 *  4: 首次进入 默认选中第一个菜单 自动展开菜单组
 */
const LayoutSidebar = defineComponent({
  props: {
    menu: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const menuCode = useMenuCode();

    const state: State = reactive({
      openKeys: [],
      selectedKeys: [],
    });
    watchEffect(() => {
      // 当前选中的菜单
      if (menuCode.value) {
        state.selectedKeys = [menuCode.value];
      }
    });

    // 当前应该展示的菜单
    const menuList = ref<any[]>([]);
    watchEffect(() => {
      if (!props.menu?.length || props.isGroup) return;
      // 普通情况
      const activeNav = getActiveNavByProp("code", menuCode.value, props.menu);
      if (activeNav) menuList.value = activeNav.subList;
    });
    // 组类型菜单
    const cancleWatchGroup = watch(
      () => props.menu,
      (val) => {
        if (val.length) {
          cancleWatchGroup();
          if (props.isGroup) {
            const currentMenu = getMenuByCode(menuCode.value, val);
            currentMenu && (menuList.value = currentMenu.subList);
          }
        }
      }
    );

    // 跳转到菜单
    const jump2Menu = (menu: any) => {
      // 打开新窗口
      if (menu.mode === 1) {
        const url = getOpenUrl(menu.url);
        window.open(url);
      } else {
        // 打开新标签/iframe
        menuCode.value = menu.code;
      }
    };

    const cancleWatch = watch(
      [() => props.menu, menuCode],
      async () => {
        await nextTick();
        if (props.menu?.length && menuCode.value) {
          // 只初始化监听一次
          cancleWatch();
          const navCodeList = props.menu.map((item) => item.code);
          const isNavMenuCode = navCodeList.includes(menuCode.value);
          // 如果当前选择的是导航栏的菜单 默认选择第一个菜单
          if (isNavMenuCode || props.isGroup) {
            const getFirstMenu = (menu: any) => {
              if (Array.isArray(menu.subList) && menu.subList.length) {
                return getFirstMenu(menu.subList[0]);
              } else {
                return menu;
              }
            };
            const firstMenu = getFirstMenu(menuList.value[0]);
            firstMenu && jump2Menu(firstMenu);
          }

          // 设置默认展开的菜单
          const openCodes = getParentMenuByCode(
            menuCode.value,
            props.menu
          ).filter((item) => !navCodeList.includes(item));
          state.openKeys = openCodes;
        }
      },
      { immediate: true }
    );

    // 递归渲染菜单
    const getMenuItem = (menuList: any[]) => {
      return menuList.map((item) => {
        const isSubMenu = Array.isArray(item.subList) && item.subList.length;

        const menuProp = {
          key: item.code,
          title: item.name,
          "v-slots": {
            icon: () =>
              item.icon && (
                <icon-font sytle={{ fontSize: "20px" }} type={item.icon} />
              ),
          },
        };
        return isSubMenu ? (
          <a-sub-menu {...menuProp}>{getMenuItem(item.subList)}</a-sub-menu>
        ) : (
          <a-menu-item {...menuProp} onClick={() => jump2Menu(item)}>
            {item.name}
          </a-menu-item>
        );
      });
    };

    return () => (
      <a-menu
        class="layout-sidebar"
        mode="inline"
        forceSubMenuRender
        v-models={[
          [state.selectedKeys, "selectedKeys"],
          [state.openKeys, "openKeys"],
        ]}
      >
        {getMenuItem(menuList.value)}
      </a-menu>
    );
  },
});

export default utils.installComponent(LayoutSidebar, "layout-sidebar");
