/**
 * 布局组件 - 侧边菜单
 */
import { defineComponent, reactive, ref, watch, PropType } from "vue";
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
      () => {
        const { menuCode: code } = route.query as any;
        state.selectedKeys = [code];
      },
      { immediate: true }
    );

    const toPath = (code: string) => {
      router.push(`/?menuCode=${code}`);
    };

    watch(
      [() => prop.menu, route],
      () => {
        if (
          prop.menu.length &&
          prop.userMenuTree.find(
            (item: any) => item.code === route.query.menuCode
          )
        ) {
          toPath(prop.menu[0].code);
        }
      },
      { immediate: true, deep: true }
    );

    const getMenuItem = (item: any, fPath?: string) => {
      return (
        <a-menu-item
          key={item.code}
          title={item.name}
          onClick={() => {
            toPath(item.code);
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
