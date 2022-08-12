import { defineComponent, ref, PropType, watch } from "vue";
import prodTop from "./components/top";
import prodBottom from "./components/botton";

const props = {
  code: String,
};
export default defineComponent({
  name: "production",
  cname: "生产情况",
  components: { prodTop, prodBottom },
  props,
  setup(_props, _context) {
    watch(
      () => _props.code,
      (e) => {
        console.log(e);
      },
      {
        immediate: true,
      }
    );
    return () => (
      <div class="production_box">
        <prodTop code={_props.code} />
        <prodBottom code={_props.code} />
      </div>
    );
  },
});
