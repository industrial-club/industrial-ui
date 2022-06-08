import { defineComponent, onMounted } from 'vue';
import { checkUser } from 'vitevuu';
import { RouterView } from 'vue-router';

export default defineComponent({
  setup() {
    onMounted(() => {});
    return () => <RouterView class='flex1' />;
  },
});
