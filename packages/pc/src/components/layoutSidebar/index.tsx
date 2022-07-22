/**
 * 布局组件 - 侧边菜单
 */
import { defineComponent, reactive, ref, watch, PropType, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import utils from "@/utils";
import { getMenuByCode, getParentMenuByCode } from "@/utils/route";

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

interface State {
  openKeys: Array<string>;
  selectedKeys: Array<string>;
}

const LayoutSidebar = defineComponent({
  props,
  setup(prop, context) {
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      openKeys: [],
      selectedKeys: [],
    });

    const onOpenChange = (openKeys: string[]) => {
      state.openKeys = openKeys;
    };

    watch(
      route,
      async () => {
        await nextTick();
        const { menuCode: code } = route.query as any;
        state.selectedKeys = [code];
      },
      { immediate: true }
    );

    const toPath = (menu: any) => {
      if (menu.mode === 0) {
        router.push(`/?menuCode=${menu.code}`);
      } else if (menu.mode === 2) {
        router.push(`/?menuCode=${menu.code}`);
      } else {
        const url = menu.url.startsWith("http")
          ? menu.url
          : location.origin + menu.url;

        const userinfo = JSON.parse(sessionStorage.getItem("userinfo")!);
        const urlObj = new URL(url);
        urlObj.searchParams.set("token", sessionStorage.getItem("token")!);
        urlObj.searchParams.set("userId", userinfo.userId);
        window.open(urlObj.href);
      }
    };

    // 第一次进来
    const cancleWatchMenu = watch(
      [() => prop.menu, route],
      async () => {
        await nextTick();
        const navCodeList = prop.userMenuTree.map((item: any) => item.code);

        const { menuCode } = route.query as any;
        const isGroup = route.query.isGroup === "true";
        const isNavMenu = navCodeList.includes(menuCode);
        if (prop.menu.length && menuCode) {
          cancleWatchMenu();
          // 默认跳转第一个菜单
          if (isNavMenu || isGroup) {
            function findFirstMenu(menu: any) {
              if (Array.isArray(menu.subList) && menu.subList.length) {
                return findFirstMenu(menu.subList[0]);
              }
              return menu;
            }
            const firstMenu = findFirstMenu(prop.menu[0]);
            toPath(firstMenu);
          }
          // 递归展开选中的菜单的父级菜单
          if (!isNavMenu || isGroup) {
            const menu = getParentMenuByCode(menuCode, prop.menu);
            if (menu) {
              state.openKeys = [menu.code];
            }
          }
        }
      },
      {
        immediate: true,
        deep: true,
        flush: "post",
      }
    );

    const getMenuItem = (item: any, fPath?: string) => {
      return (
        <a-menu-item
          key={item.code}
          title={item.name}
          onClick={() => {
            toPath(item);
          }}
          v-slots={{
            icon: () =>
              item.icon && (
                <icon-font sytle={{ fontSize: "20px" }} type={item.icon} />
              ),
          }}
        >
          {item.name}
        </a-menu-item>
      );
    };

    const getSubMenu = (obj: any, fPath?: string) => {
      return obj.map((item: any, index: string) => {
        let result: any;

        if (item.subList?.length > 0) {
          result = (
            <a-sub-menu
              key={item.code}
              title={item.name}
              v-slots={{
                icon: () =>
                  item.icon && (
                    <icon-font sytle={{ fontSize: "20px" }} type={item.icon} />
                  ),
              }}
            >
              {getSubMenu(item.subList, item.code)}
            </a-sub-menu>
          );
        } else {
          result = getMenuItem(item, fPath);
        }
        return result;
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
        onOpenChange={onOpenChange}
      >
        {getSubMenu(prop.menu)}
      </a-menu>
    );
  },
});

export default utils.installComponent(LayoutSidebar, "layout-sidebar");
