import { defineComponent, ref } from "vue";
import control from "./control";
import task from "./task";

const props = {
  isBelt: {
    type: Boolean,
    default: false,
  },
};

export default defineComponent({
  name: "HtModal",
  components: {
    control,
    task,
  },
  props,
  setup(this, _props, _ctx) {
    const activeKey = ref("1");
    const tabsItem = () => {
      if (activeKey.value === "1") {
        return <control isBelt={_props.isBelt}></control>;
      }
      if (activeKey.value === "2") {
        return <task></task>;
      }
    };
    return () => (
      <div class="htModal">
        <div class="htModal-tabs">
          <a-tabs v-model={[activeKey.value, "activeKey"]}>
            <a-tab-pane key="1" tab="控制"></a-tab-pane>
            <a-tab-pane key="2" tab="任务"></a-tab-pane>
          </a-tabs>
        </div>
        <div class="htModal-content">{tabsItem()}</div>
      </div>
    );
  },
});
