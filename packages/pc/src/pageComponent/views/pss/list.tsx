import { defineComponent, onMounted, nextTick, ref, shallowRef, reactive } from "vue";
import { RouterView } from "vue-router";
import { setRem } from "@/pageComponent/utils";
import utils from "@/utils";
import { TabPane, Tabs } from "ant-design-vue";
import Tables from "./components/table";
import './assets/less/index.less';
export default defineComponent({
  components: {
    Tables,
  },
  setup() {
    const active = ref<string>("do");
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
          component: null,
        },
        {
          key: "self",
          name: "我发起的",
          count: 0,
          component: null,
        },
      ],
    });
    onMounted(() => {});

    return () => (
      <div class="pssList">
        <Tabs v-model={[tabConfig.activeKey, "activeKey"]} animated={false}>
          {tabConfig.tabs.map((tab) => (
            <TabPane
              key={tab.key}
              v-slots={{
                tab: () => {
                  return (
                    <div class={["tab-label", `tab-label-${tab.key}`]}>
                      <span class="tab-name">{tab.name}</span>
                      <span class="tab-value">{tab.count}</span>
                    </div>
                  );
                },
              }}
            >
              <tab.component />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  },
});

