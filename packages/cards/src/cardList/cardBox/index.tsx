import { defineComponent, PropType, ref, watch } from "vue";
import tabs from "@/components/tabs";
import { prefix } from "../../config";

const props = {
  titleName: String,
  tabList: {
    type: Array as PropType<Array<{ [key: string]: string }>>,
  },
  activeKey: String,
};

export default defineComponent({
  components: {
    tabs,
  },
  props,
  emits: ["update:activeKey"],
  setup(_props, _ctx) {
    const activeKey = ref("1");
    watch(
      () => _props.activeKey,
      (e) => {
        if (e) {
          activeKey.value = e;
        }
      },
      {
        immediate: true,
      }
    );
    return () => (
      <div class={prefix + "_box"}>
        <div class={prefix + "_box-header"}>
          <div class={prefix + "_box-header-title"}>{_props.titleName}</div>
          {_props.tabList ? (
            <tabs
              v-model={[activeKey.value, "activeKey"]}
              tabs={_props.tabList}
              onChange={() => {
                _ctx.emit("update:activeKey", activeKey.value);
              }}
            ></tabs>
          ) : null}
        </div>
        <div class={prefix + "_box-body"}>{_ctx.slots.default!()}</div>
      </div>
    );
  },
});
