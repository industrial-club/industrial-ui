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
import { defineComponent, PropType, provide, ref } from "vue";
import { api, setInstance } from "@/pageComponent/api/param";
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
    urlPrefix: {
      type: String,
    },
  },
  setup(props) {
    if (props.urlPrefix) setInstance(props.urlPrefix);
    const urlMap = { ...props.url };
    provide("urlMap", urlMap);

    const tabs = ref([]);

    /* 获取标签页数据 */
    const getTabs = async () => {
      const { data } = await api.getGroupList(urlMap.list)({ level: "tab" });
      tabs.value = data;
    };

    getTabs();

    return () => (
      <div class="param-manager">
        <a-tabs>
          {tabs.value.map((item: any) => (
            <a-tab-pane key={item.id} tab={item.name}>
              <TabItem tabId={item.id} />
            </a-tab-pane>
          ))}
        </a-tabs>
      </div>
    );
  },
});

export default utils.installComponent(ParamManager, "param-manager");
