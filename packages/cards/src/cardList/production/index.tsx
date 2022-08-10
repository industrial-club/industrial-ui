import { defineComponent, reactive, PropType } from "vue";
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
    return () => (
      <inl-card-box>
        <div class="production_box">
          {/* <prodTop code={_props.code} /> */}
          <prodBottom code={_props.code} />
        </div>
      </inl-card-box>
    );
  },
});
