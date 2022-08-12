import { defineComponent, PropType, provide, ref, watch } from "vue";
import tabsItem from "./tab.item";

export interface TabsItem {
  name: string;
  id: string;
}

const props = {
  tabs: {
    type: Array as PropType<Array<TabsItem>>,
  },
  activeKey: {
    type: String,
  },
};

export default defineComponent({
  components: { tabsItem },
  props,
  emits: ["update:activeKey", "change"],
  setup(_props, _context) {
    const activeKey = ref("");
    watch(
      () => _props.activeKey,
      (e) => {
        activeKey.value = `${e}`;
      },
      {
        immediate: true,
      }
    );
    return () => (
      <div class="tab">
        {_props.tabs?.map((item) => (
          <tabsItem
            v-model={[activeKey.value, "activeKey"]}
            name={item.name}
            id={item.id}
            onClick={() => {
              activeKey.value = item.id;
              _context.emit("update:activeKey", item.id);
              _context.emit("change", item);
            }}
          />
        ))}
      </div>
    );
  },
});
