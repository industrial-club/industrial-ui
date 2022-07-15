import { defineComponent, onMounted, ref, shallowRef, reactive } from "vue";
import { TabPane, Tabs } from "ant-design-vue";
import Tables from "./components/table";
import "./assets/less/index.less";

export default defineComponent({
  components: {
    Tables,
  },
  setup() {
    const tabConfig = reactive<{
      activeKey: string;
      tabs: Array<{ name: string; key: string; component: any; count: number }>;
    }>({
      activeKey: "do",
      tabs: [
        {
          key: "do",
          name: "代办",
          count: 0,
          component: shallowRef(Tables),
        },
        {
          key: "done",
          name: "已办",
          count: 0,
          component: shallowRef(Tables),
        },
        {
          key: "self",
          name: "我发起的",
          count: 0,
          component: shallowRef(Tables),
        },
      ],
    });

    return () => (
      <div class="pssList" id="pssList">
        <Tabs v-model={[tabConfig.activeKey, "activeKey"]}>
          {tabConfig.tabs.map((tab) => (
            <TabPane
              key={tab.key}
              v-slots={{
                tab: () => {
                  return (
                    <div class={["tab-label", `tab-label-${tab.key}`]}>
                      <span class="tab-name">{tab.name}</span>
                      {/* <span class="tab-value"> ({tab.count})</span> */}
                    </div>
                  );
                },
              }}
            >
              <tab.component tab={tab.key} />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  },
});
