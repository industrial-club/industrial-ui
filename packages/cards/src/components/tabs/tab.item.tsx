import { defineComponent, ref, inject, watch, Ref } from "vue";

const props = {
  name: String,
  id: String,
  activeKey: String,
};
export default defineComponent({
  props,
  setup(_props, _context) {
    const classes = ref("tab_item");
    const activeKey = ref<string>("");
    watch(
      () => _props.activeKey,
      (e) => {
        if (e) {
          activeKey.value = e;
        }
        classes.value =
          activeKey?.value === _props.id
            ? "tab_item tab_item_active"
            : "tab_item";
      },
      {
        immediate: true,
      }
    );
    return () => <div class={classes.value}>{_props.name}</div>;
  },
});
