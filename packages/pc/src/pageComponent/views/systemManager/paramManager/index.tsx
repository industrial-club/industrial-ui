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
import { defineComponent, ref } from "vue";

import { Tabs, TabPane } from "ant-design-vue";
import { api } from "@/pageComponent/api/param";
import TabItem from "./tabItem";

const ParamManager = defineComponent({
  setup() {
    const tabs = ref([]);

    /* 获取标签页数据 */
    const getTabs = async () => {
      const { data } = await api.getGroupList({ level: "tab" });
      tabs.value = data;
    };

    getTabs();

    return () => (
      <div class="param-manager">
        <Tabs>
          {tabs.value.map((item: any) => (
            <TabPane key={item.id} tab={item.name}>
              <TabItem tabId={item.id} />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  },
});

export default ParamManager;
