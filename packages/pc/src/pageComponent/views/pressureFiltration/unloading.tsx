import { defineComponent } from "vue";
import utils from "@/utils";

const unloading = defineComponent({
  name: "Unloading",
  setup(this, props, ctx) {
    return () => <div class="unloading">卸料</div>;
  },
});

export default utils.installComponent(unloading, "unloading");
