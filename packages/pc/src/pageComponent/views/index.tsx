import { defineComponent, onMounted, nextTick } from "vue";
import { RouterView } from "vue-router";
import { setRem } from "@/pageComponent/utils";

export default defineComponent({
  setup() {
    onMounted(() => {
      // 初始化
      setRem();
      // 窗口变化后，重置rem
      window.addEventListener("resize", function resize(e) {
        nextTick(() => {
          setRem();
        });
      });
    });

    return () => <RouterView />;
  },
});
