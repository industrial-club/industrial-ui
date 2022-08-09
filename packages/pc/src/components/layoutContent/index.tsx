import {
  PropType,
  Component,
  computed,
  defineComponent,
  ref,
  watch,
  shallowRef,
} from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import useMenuCode from "@/hooks/useMenuCode";
import { getMenuByCode, getOpenUrl } from "@/utils/route";
import utils from "@/utils";

export interface IRouteItem {
  code: string;
  component: Component;
  isExtend?: boolean; // 是否为扩展的路由 - 不在菜单中展示
  name?: string;
  icon?: string;
}

/**
 * 布局组件 - 内容区
 */
const LayoutContent = defineComponent({
  props: {
    // 所有组件的一维数组
    allRoutes: {
      type: Array as PropType<IRouteItem[]>,
      default: () => [],
    },
    menu: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    showTabs: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const menuCode = useMenuCode();

    const tabs = ref<any[]>([]);
    const activeCode = ref<String>();

    const tabsRef = ref<HTMLElement>();

    // 扩展的菜单组件
    const extendRoutes = computed(() =>
      props.allRoutes.filter((item) => item.isExtend)
    );

    // 监听menuCode 加入到tabs中
    watch(
      menuCode,
      (val) => {
        if (!val) return;
        // 已经打开的tabs 不需要重复添加 设置为active
        const isInTabs = tabs.value.find((item) => item.code === val);
        if (isInTabs) {
          if (tabs.value.find((item) => item.code === val)) {
            activeCode.value = val;
          }
          return;
        }
        // 获取到对应的菜单对象
        const menu =
          getMenuByCode(val, props.menu) ||
          extendRoutes.value.find((item) => item.code === val);
        if (!menu) return;
        let cpn: any;
        // mode为2是iframe
        if (menu.mode === 2) {
          const iframeUrl = getOpenUrl(menu.url);
          cpn = shallowRef(<iframe src={iframeUrl} frameborder="0"></iframe>);
        } else {
          const menuCpn = props.allRoutes.find(
            (item) => item.code === val
          )?.component;
          if (menuCpn && menuCpn !== RouterView) {
            cpn = shallowRef(menuCpn);
          }
        }

        if (cpn) {
          tabs.value.push({
            ...menu,
            cpn,
            key: Date.now(),
          });
          activeCode.value = val;
        }
      },
      { immediate: true }
    );

    // tabs滚动条滚动
    const handleScrollTabs = (distance: number) => {
      tabsRef.value!.scroll({
        left: tabsRef.value!.scrollLeft + distance,
        behavior: "smooth",
      });
    };

    // 关闭tag
    const handleCloseTag = (idx: number) => {
      const removed = tabs.value.splice(idx, 1);
      if (removed[0]?.code === activeCode.value) {
        const newMenuCode = tabs.value[tabs.value.length - 1]?.code;
        menuCode.value = newMenuCode;
      }
    };
    // 关闭到右侧
    const closeToRight = (idx: number) =>
      (tabs.value = tabs.value.filter((_, i) => i <= idx));
    // 关闭到左侧
    const closeToLeft = (idx: number) =>
      (tabs.value = tabs.value.filter((_, i) => i >= idx));
    // 关闭其他
    const closeOthers = (idx: number) =>
      (tabs.value = tabs.value.filter((_, i) => i === idx));
    // 刷新
    const refreshCpn = (idx: number) => (tabs.value[idx].key = Date.now());

    return () => (
      <a-layout-content class="layout-content" style={{ overflow: "auto" }}>
        <div class="layout-container">
          {props.showTabs && (
            <div class="tabs-container">
              <a-button
                class="btn-scroll left"
                onClick={() => handleScrollTabs(-400)}
              >
                <left-outlined />
              </a-button>
              <div class="tabs-list" ref={tabsRef}>
                {tabs.value.map((item, index) => (
                  <a-dropdown
                    trigger={["contextmenu"]}
                    v-slots={{
                      overlay: () => (
                        <a-menu>
                          <a-menu-item>
                            <a onClick={() => closeToRight(index)}>关闭右侧</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a onClick={() => closeToLeft(index)}>关闭左侧</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a onClick={() => closeOthers(index)}>关闭其他</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a onClick={() => refreshCpn(index)}>刷新</a>
                          </a-menu-item>
                        </a-menu>
                      ),
                    }}
                  >
                    <router-link
                      key={item.code}
                      class={[
                        "tab-item",
                        item.code === activeCode.value && "active",
                      ]}
                      to={{
                        query: {
                          menuCode: item.code,
                        },
                      }}
                    >
                      <a class="tab-item-text">
                        {item.icon && (
                          <icon-font class="icon" type={item.icon} />
                        )}
                        <span class="tab-name">{item.name}</span>
                        {tabs.value.length > 1 && (
                          <span
                            class="btn-close"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCloseTag(index);
                            }}
                          >
                            {item.code === activeCode.value ? (
                              <close-circle-filled
                                style={{ color: "#cdd0d3" }}
                              />
                            ) : (
                              <close-outlined />
                            )}
                          </span>
                        )}
                      </a>
                    </router-link>
                  </a-dropdown>
                ))}
              </div>
              <a-button
                class="btn-scroll right"
                onClick={() => handleScrollTabs(400)}
              >
                <right-outlined />
              </a-button>
            </div>
          )}
          <div
            class="main-content"
            style={{ marginTop: props.showTabs ? "" : "0" }}
          >
            {tabs.value.map(
              (menuItem: any, index) =>
                menuItem && (
                  <menuItem.cpn
                    key={menuItem.key}
                    style={{
                      display: menuItem.code === activeCode.value ? "" : "none",
                    }}
                  />
                )
            )}
          </div>
        </div>
      </a-layout-content>
    );
  },
});

export default utils.installComponent(LayoutContent, "layout-content");
