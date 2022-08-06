import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * 双向绑定路由中的菜单编码
 */
export default function useMenuCode() {
  const router = useRouter();
  const route = useRoute();

  // 监听路由中的menuCode 进行同步
  const menuCode = ref<string>();
  watch(
    route,
    () => {
      const { menuCode: code } = route.query;
      menuCode.value = code as string;
    },
    { immediate: true, deep: true }
  );

  // 外部更新menuCode时，跳转到对应的路由
  watch(menuCode, (val) => {
    if (val !== route.query.menuCode) {
      router.push({
        query: {
          menuCode: val,
        },
      });
    }
  });

  return menuCode;
}
