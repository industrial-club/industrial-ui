import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  setup() {
    return () => <RouterView class="flex1" />;
  },
});
