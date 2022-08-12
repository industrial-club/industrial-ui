import { defineComponent, PropType, ref, watch, resolveComponent } from "vue";
import tabs from "@/components/tabs";
import { prefix } from "../../config";

const props = {
  componentName: {
    type: String,
    default: "",
    required: true,
  },
  titleName: {
    type: String,
    default: "",
    required: true,
  },
  tabList: {
    type: Array as PropType<Array<{ [key: string]: string }>>,
  },
};

export default defineComponent({
  components: {
    tabs,
  },
  props,
  setup(_props, _ctx) {
    const componentName = resolveComponent(`${prefix}-${_props.componentName}`);
    const activeKey = ref("");
    watch(
      () => _props.tabList,
      (e) => {
        if (e) {
          activeKey.value = e[0].id;
        }
      },
      {
        immediate: true,
        deep: true,
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
            ></tabs>
          ) : null}
        </div>
        <div class={prefix + "_box-body"}>
          <componentName code={activeKey.value}></componentName>
        </div>
      </div>
    );
  },
});
