import {
  PropType,
  Component,
  computed,
  defineComponent,
  ref,
  watch,
  shallowRef,
  onMounted,
} from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import useMenuCode from "@/hooks/useMenuCode";
import _ from "lodash";
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
 *  1: 监听menuCode变化 如果不在当前打开的标签页中 就添加一个标签页
 *  2: 如果是已经打开的标签页 把对应的标签页设为激活状态
 *  3: 2中组件 一种是iframe组件 另一种是普通组件
 *  4: 通过更新组件的key来刷新组件
 *  5: isMultiple字段表示可以多开标签 根据multiKey判断当前展示的是哪一个标签
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
    const menuCode = useMenuCode();

    const tabs = ref<any[]>([]);
    const activeCode = ref<string>();
    const activeMultiKey = ref<string>();

    const tabsRef = ref<HTMLElement>();
    const marginTop = ref<string>("");

    // 扩展的菜单组件
    const extendRoutes = computed(() =>
      props.allRoutes.filter((item) => item.isExtend)
    );

    // 监听menuCode 加入到tabs中
    watch(
      [menuCode, () => route.query.multiKey],
      async ([val]) => {
        await nextTick();
        if (!val) return;
        const { query } = route;
        // 可以打开多个同类标签
        const { isMultiple, multiKey: lastMultiKey } = query as any;

        const multiKey =
          lastMultiKey ||
          (isMultiple ? (Math.random() * 10 ** 10).toFixed(0) : undefined);
        // 已经打开的tabs 不需要重复添加 设置为active
        const isInTabs = tabs.value.find((item) => item.code === val);
        if ((isInTabs && !isMultiple) || (isInTabs && lastMultiKey)) {
          if (tabs.value.find((item) => item.code === val)) {
            activeCode.value = val;
            activeMultiKey.value = multiKey;
          }
          return;
        }
        // 获取到对应的菜单对象
        const menu = _.cloneDeep(
          getMenuByCode(val, props.menu) ||
            extendRoutes.value.find((item) => item.code === val)
        );
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
            multiKey,
            query: _.omit(query, "menuCode"), // 携带原本的query参数
            cpn,
            key: Date.now(),
          });
          activeCode.value = val;
          activeMultiKey.value = multiKey;
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
    const handleCloseTag = async (idx: number) => {
      const removed = tabs.value.splice(idx, 1);
      await nextTick();
      if (removed[0]?.code === activeCode.value) {
        const tabElList = document.querySelectorAll(".tabs-list .tab-item");
        (tabElList[tabElList.length - 1] as HTMLDivElement).click();
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

    onMounted(() => {
      if (props.showTabs) {
        const el = document.getElementsByClassName("tabs-container")[0];
        marginTop.value = window.getComputedStyle(el).height;
      } else {
        marginTop.value = "0";
      }
    });

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
                        item.code === activeCode.value &&
                          item.multiKey === activeMultiKey.value &&
                          "active",
                      ]}
                      to={{
                        query: {
                          menuCode: item.code,
                          multiKey: item.multiKey,
                          ...item.query,
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
                            {item.code === activeCode.value &&
                            item.multiKey === activeMultiKey.value ? (
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
            style={{
              marginTop: props.showTabs ? marginTop.value : "0",
              height: `calc(100% - ${marginTop.value})`,
            }}
          >
            {tabs.value.map(
              (menuItem: any, index) =>
                menuItem && (
                  <menuItem.cpn
                    key={menuItem.key}
                    style={{
                      display:
                        menuItem.code === activeCode.value &&
                        menuItem.multiKey === activeMultiKey.value
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
