import { defineComponent } from "vue";
import { Menu } from "ant-design-vue";

const item = Menu.Item;
const SubMenu = Menu.SubMenu;

export default defineComponent({
  setup() {
    return () => (
      <Menu theme="dark">
        <item>item1</item>
        <SubMenu title={"sub"}>
          <item>sub-item1</item>
          <item>sub-item1</item>
        </SubMenu>
      </Menu>
    );
  },
});
