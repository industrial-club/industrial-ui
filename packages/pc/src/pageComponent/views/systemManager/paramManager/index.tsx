/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 10:51:58
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 14:05:35
 */
/*
 * @Abstract: 参数管理
 * @Author: wang liang
 * @Date: 2022-03-25 10:51:58
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-29 15:03:27
 */
import { defineComponent, onMounted, PropType, provide, ref, watch } from "vue";
import { api, setInstance } from "@/api/param";
import utils from "@/utils";

import TabItem from "./tabItem";

export interface IUrlObj {
  // 参数列表
  list: string;
  // 参数定义对象
  define: string;
  // 批量保存
  save: string;
}

const ParamManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    prefix: {
      type: String,
    },
    serverName: {
      type: String,
    },
    menu: {
      type: Object as PropType<any>,
    },
  },
  setup(props) {
    setInstance({ prefix: props.prefix, serverName: props.serverName });
    const urlMap = { ...props.url };
    provide("urlMap", urlMap);

    const menus = ref([]);
    const currentMenu = ref(props.menu);
    const tabs = ref([]);

    const changeMenu = (menu: any) => {
      currentMenu.value = menu;
    };

    const getMenus = async () => {
      const { data } = await api.getGroupList(urlMap.list)({ level: "menu" });
      menus.value = data;
      currentMenu.value = data[0];
    };
    onMounted(() => !props.menu && getMenus());

    /* 获取标签页数据 */
    const getTabs = async () => {
      const { data } = await api.getGroupList(urlMap.list)({
        level: "tab",
        parentId: currentMenu.value.id,
      });
      tabs.value = data;
    };

    watch(
      currentMenu,
      (val) => {
        if (val) getTabs();
      },
      { immediate: true }
    );

    return () => (
      <div class="param-manager">
        {!props.menu && (
          <a-space>
            {menus.value.map((item: any, index: number) => (
              <a-button
                type={currentMenu.value.id === item.id ? "primary" : "default"}
                onClick={() => changeMenu(item)}
              >
                {item.name}
              </a-button>
            ))}
          </a-space>
        )}

        <a-tabs>
          {tabs.value.map((item: any) => (
            <a-tab-pane key={item.id} tab={item.name}>
              <TabItem
                tabId={item.id}
                completeKey={`${currentMenu.value.code}.${item.code}`}
              />
            </a-tab-pane>
          ))}
        </a-tabs>
      </div>
    );
  },
});

export default utils.installComponent(ParamManager, "param-manager");
