import { defineComponent } from "vue";
import util from "../../utll";

const input = defineComponent({
  setup() {
    return () => <div>aaa</div>;
  },
});

export default util.installComponent(input, "input");
