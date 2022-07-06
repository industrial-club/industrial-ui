/**
 *  布局组件 - 内容区
 */

import {
  PropType,
  Component,
  computed,
  defineComponent,
  ref,
  watch,
} from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { flatMenuList } from "@/utils/route";
import utils from "@/utils";

export interface IRouteItem {
  code: string;
  component: Component;
  isExtend?: boolean; // 是否为扩展的路由 - 不在菜单中展示
  name?: string;
  icon?: string;
}

const LayoutContent = defineComponent({
  props: {
    // 所有组件的一维数组
    allRoutes: {
      type: Array as PropType<IRouteItem[]>,
      default: () => [],
    },
    userMenuTree: {
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

    const tabs = ref<any[]>([]);
    const activeCode = ref<String>();
    const userNavList = computed(() => flatMenuList(props.userMenuTree));

    const tabsRef = ref<HTMLElement>();

    // query的code变化 存入tabs中
    watch(
      route,
      () => {
        const { menuCode: code } = route.query as any;
        // 以http开头 为 iframe
        if (code && code.startsWith("http")) {
          const tab = userNavList.value.find((item: any) => item.url === code);
          if (tab && !tabs.value.find((item) => item.code === tab.code)) {
            tabs.value.push({
              ...tab,
              key: Date.now(),
            });
          }
        } else if (code && !tabs.value.find((tab) => tab.code === code)) {
          const route = props.allRoutes.find((item) => item.code === code);
          if (!route || !route.component || route.component === RouterView) {
            return;
          }
          const tab = route.isExtend
            ? route
            : userNavList.value.find((item: any) => item.code === code);

          tab && tabs.value.push({ ...tab, key: Date.now });
        }
        activeCode.value = code;
      },
      { immediate: true }
    );

    // 关闭tag
    const handleCloseTag = (idx: number) => {
      const removed = tabs.value.splice(idx, 1);
      if (removed[0]?.code === activeCode.value) {
        router.push(`/?menuCode=${tabs.value[tabs.value.length - 1]?.code}`);
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

    // 刷新组件
    const refreshCpn = (idx: number) => (tabs.value[idx].key = Date.now());

    // 当前tabs中缓存的组件
    const cacheComponents = computed(() => {
      const iframeRoutes = tabs.value
        .filter((item) => item.mode === 2)
        .map((item) => ({
          url: item.url,
          code: item.code,
          component: () => <iframe src={item.url} frameborder="0"></iframe>,
        }));
      const tabRoutes = props.allRoutes.filter((item) => {
        return tabs.value.find((tab) => tab.code === item.code);
      });

      return [...tabRoutes, ...iframeRoutes];
    });

    return () => (
      <a-layout-content class="layout-content" style={{ overflow: "auto" }}>
        <div class="layout-container">
          {props.showTabs && (
            <div class="tabs-container">
              <a-button
                onClick={() =>
                  tabsRef.value!.scroll({
                    left: tabsRef.value!.scrollLeft - 400,
                    behavior: "smooth",
                  })
                }
              >
                <left-outlined />
              </a-button>
              <div class="tabs-list" ref={tabsRef}>
                {tabs.value.map((item, index) => (
                  <router-link
                    key={item.code}
                    class={[
                      "tab-item",
                      item.code === activeCode.value ||
                      item.url === activeCode.value
                        ? "active"
                        : "",
                    ]}
                    to={`/?menuCode=${item.mode === 2 ? item.url : item.code}`}
                  >
                    <a-dropdown
                      trigger={["contextmenu"]}
                      v-slots={{
                        overlay: () => (
                          <a-menu>
                            <a-menu-item>
                              <a onClick={() => closeToRight(index)}>
                                关闭右侧
                              </a>
                            </a-menu-item>
                            <a-menu-item>
                              <a onClick={() => closeToLeft(index)}>关闭左侧</a>
                            </a-menu-item>
                            <a-menu-item>
                              <a onClick={() => closeOthers(index)}>关闭其他</a>
                            </a-menu-item>
                            {/* <a-menu-item>
                              <a onClick={() => refreshCpn(index)}>刷新</a>
                            </a-menu-item> */}
                          </a-menu>
                        ),
                      }}
                    >
                      <span class="tab-item-text">
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
                              <close-circle-filled />
                            ) : (
                              <close-outlined />
                            )}
                          </span>
                        )}
                      </span>
                    </a-dropdown>
                  </router-link>
                ))}
              </div>
              <a-button
                onClick={() =>
                  tabsRef.value!.scroll({
                    left: tabsRef.value!.scrollLeft + 400,
                    behavior: "smooth",
                  })
                }
              >
                <right-outlined />
              </a-button>
            </div>
          )}
          <div
            class="main-content"
            style={{ marginTop: props.showTabs ? "" : "0" }}
          >
            {cacheComponents.value.map(
              (cpn: any, index) =>
                cpn && (
                  <cpn.component
                    key={cpn.code || cpn.url}
                    style={{
                      display:
                        cpn.code === activeCode.value ||
                        cpn.url === activeCode.value
                          ? ""
                          : "none",
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
