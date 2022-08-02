import { defineComponent } from "vue";
import { prefix } from "../../config";

export default defineComponent({
  setup(props, ctx) {
    return () => <div class={prefix + "_box"}>{ctx.slots.default!()}</div>;
  },
});
