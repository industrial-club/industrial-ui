import { defineComponent, ref, watch } from "vue";
import { Menu } from "ant-design-vue";

const item = Menu.Item;
const SubMenu = Menu.SubMenu;
export default defineComponent({
  setup() {
    const theme = ref("dark");
    watch(
      theme,
      () => {
        if (theme.value === "dark") {
          document
            .getElementsByTagName("html")[0]
            .setAttribute("data-doc-theme", "dark");
          document
            .getElementsByTagName("body")[0]
            .setAttribute("data-theme", "dark");
          document.getElementsByTagName("html")[0].style.colorScheme = "dark";
        } else {
          document
            .getElementsByTagName("html")[0]
            .setAttribute("data-doc-theme", "light");
          document
            .getElementsByTagName("body")[0]
            .setAttribute("data-theme", "light");
          document.getElementsByTagName("html")[0].style.colorScheme = "light";
        }
      },
      { immediate: true }
    );
    return () => (
      <div>
        <a-select
          ref="select"
          v-models={[[theme.value, "value"]]}
          style="width: 120px"
        >
          <a-select-option value="default">默认主题</a-select-option>
          <a-select-option value="dark">黑色主题</a-select-option>
        </a-select>

        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">Dashed Button</a-button>
        <a-button type="text">Text Button</a-button>
        <a-button type="link">Link Button</a-button>

        <Menu>
          <item>item1</item>
          <SubMenu title={"sub"}>
            <item>sub-item1</item>
            <item>sub-item1</item>
          </SubMenu>
        </Menu>
      </div>
    );
  },
  components: {},
});
