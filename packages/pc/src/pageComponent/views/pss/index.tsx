import { defineComponent, onMounted } from "vue";
import utils from "@/utils";
import "./assets/less/index.less";
import List from "./list";
const com = defineComponent({
  components: {
    List,
  },
  setup() {
    onMounted(() => {});
    return () => (
      <div class="pssIndex">
        <List />
      </div>
    );
  },
});
export default utils.installComponent(com, "pss-list");
