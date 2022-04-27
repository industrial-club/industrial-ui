import {
  defineComponent,
  reactive,
  ref,
  h,
  resolveComponent,
  watch,
} from "vue";
import { Menu, MenuItem, SubMenu } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

// props
const props = {
  menu: {
    type: Array,
    default: [],
  },
  path: {
    type: String,
    default: "",
  },
};

interface SOLT {
  icon?: Function;
  title: Function;
}

interface State {
  openKeys: Array<string>;
  selectedKeys: Array<string>;
}

export default defineComponent({
  components: { Menu, MenuItem, SubMenu },
  props,
  setup(prop, context) {
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      openKeys: [],
      selectedKeys: [],
    });

    watch(
      route,
      (nVal) => {
        const urlList = nVal.path.split("/");
        state.openKeys = [urlList[urlList.length - 2]];
        state.selectedKeys = [urlList[urlList.length - 1]];
      },
      { deep: true, immediate: true }
    );

    const toPath = (path: string) => {
      router.push({
        path: prop.path + path,
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

    const getMenuItem = (item: any, fPath?: string) => {
      const { meta } = item;
      let ele;

      if (meta.hide !== true) {
        ele = (
          <MenuItem
            key={item.path}
            onClick={() => toPath((fPath ? `${fPath}/` : "") + item.path)}
            v-slots={getSlots(meta.title, meta?.icon || "container-outlined")}
          >
            {meta.title}
          </MenuItem>
        );
      }
      return ele;
    };

    const getSubMenu = (obj: any, fPath?: string) => {
      return obj.map((item: any, index: string) => {
        const { meta } = item;
        let result;

        if (meta.hide !== true) {
          if (item?.children && item?.children.length > 0) {
            result = (
              <SubMenu key={item.path} v-slots={getSlots(meta.title)}>
                {getSubMenu(item.children, item.path)}
              </SubMenu>
            );
          } else {
            result = getMenuItem(item, fPath);
          }
        }
        return result;
      });
    };

    return () => (
      <Menu
        mode="inline"
        v-models={[
          [state.selectedKeys, "selectedKeys"],
          [state.openKeys, "openKeys"],
        ]}
      >
        {getSubMenu(prop.menu)}
      </Menu>
    );
  },
});
