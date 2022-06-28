import { defineComponent, onMounted, nextTick, ref, shallowRef, reactive } from "vue";
import { RouterView } from "vue-router";
import { setRem } from "@/pageComponent/utils";
import utils from "@/utils";
import { TabPane, Tabs } from "ant-design-vue";
import './assets/less/index.less';
import List from "./list";
import Info from "./info";
const com = defineComponent({
  components: {
    List,
    Info
  },
  setup() {
    onMounted(() => {});
    const isList: Boolean = false;
    return () => <div class="pssIndex">{isList ? <List /> : <Info />}</div>;
  },
});
export default utils.installComponent(com, "pss-list");

