/**
 * 布局组件 - 侧边菜单
 */
import { defineComponent, reactive, ref, watch, PropType, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
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
        if (code?.startsWith("http")) {
          const menuItem = prop.menu.find((item) => item.url === code);
          state.selectedKeys = [menuItem?.code || ""];
        } else {
          state.selectedKeys = [code];
        }
      },
      { immediate: true }
    );

    const toPath = (menu: any) => {
      if (menu.mode === 0) {
        router.push(`/?menuCode=${menu.code}&type=${menu.mode}`);
      } else if (menu.mode === 2) {
        router.push(`/?menuCode=${menu.url}&type=${menu.mode}`);
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

    // 取消 默认跳转第一个菜单
    // watch(
    //   [() => prop.menu, route],
    //   () => {
    //     if (
    //       prop.menu.length &&
    //       prop.userMenuTree.find(
    //         (item: any) => item.code === route.query.menuCode
    //       )
    //     ) {
    //       toPath(prop.menu[0]);
    //     }
    //   },
    //   { immediate: true, deep: true }
    // );

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
        let result;

        if (item.subList?.length > 0) {
          result = (
            <a-sub-menu
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
