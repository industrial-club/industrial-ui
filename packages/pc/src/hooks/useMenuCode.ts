import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * 双向绑定路由中的菜单编码
 */
export default function useMenuCode() {
  const router = useRouter();
  const route = useRoute();

  // 监听路由中的menuCode 进行同步
  const menuCode = computed({
    get() {
      return route.query.menuCode as string;
    },
    set(val) {
      router.push({
        query: {
          menuCode: val,
        },
      });
    },
  });

  return menuCode;
}
