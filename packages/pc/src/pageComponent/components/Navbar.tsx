import {
  defineComponent,
  reactive,
  ref,
  h,
  resolveComponent,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";

// props
const props = {
  menu: {
    type: Array,
    default: [],
  },
};

interface SOLT {
  icon?: Function;
  title: Function;
}

interface State {
  selectedKeys: Array<string>;
}

export default defineComponent({
  props,
  setup(prop, context) {
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      selectedKeys: [],
    });

    watch(
      route,
      (nVal) => {
        const urlList = nVal.path.split("/");
        state.selectedKeys = [`/${urlList[1]}`];
      },
      { deep: true, immediate: true }
    );

    const toPath = (path: string) => {
      router.push({
        path,
      });
    };

    const getSlots = (title: string, icon?: any) => {
      const obj: SOLT = {
        title: () => title,
      };
      if (icon) {
        obj.icon = () => h(resolveComponent(icon));
      }

      return obj;
    };

    const getMenuItem = (obj: any, fPath?: string) => {
      return obj.map((item: any, index: string) => {
        const { meta } = item;
        let ele;
        if (meta.hide !== true) {
          ele = (
            <a-menu-item
              key={item.path}
              onClick={() => toPath((fPath ? `${fPath}/` : "") + item.path)}
              v-slots={getSlots(meta.title, meta?.icon)}
            >
              {meta.title}
            </a-menu-item>
          );
        }

        return ele;
      });
    };

    return () => (
      <a-menu
        class="topMenu"
        mode="horizontal"
        v-model={[state.selectedKeys, "selectedKeys"]}
      >
        {getMenuItem(prop.menu)}
      </a-menu>
    );
  },
});
