import { defineComponent, ref, watch } from "vue";
import { Menu } from "ant-design-vue";

const item = Menu.Item;
const SubMenu = Menu.SubMenu;
export default defineComponent({
  setup() {
    return () => (
      <div>
        <inl-change-theme-select />
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
