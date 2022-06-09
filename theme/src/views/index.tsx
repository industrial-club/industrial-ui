import { defineComponent, ref, watch } from "vue";
import { Menu, Switch, Radio, message } from "ant-design-vue";

const item = Menu.Item;
const SubMenu = Menu.SubMenu;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export default defineComponent({
  setup() {
    const checked = ref(false);
    const radio = ref("a");
    return () => (
      <div>
        <inl-change-theme-select />
        <a-button
          type="primary"
          onClick={() => {
            message.success("操作成功");
          }}
        >
          Primary Button
        </a-button>
        <a-button
          onClick={() => {
            message.error("操作失败");
          }}
        >
          Default Button
        </a-button>
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
        <Switch v-model={[checked.value, "checked"]}></Switch>
        <RadioGroup v-model={[radio.value, "value"]} button-style="solid">
          <RadioButton value="a">Hangzhou</RadioButton>
          <RadioButton value="b">Shanghai</RadioButton>
          <RadioButton value="c">Beijing</RadioButton>
          <RadioButton value="d">Chengdu</RadioButton>
        </RadioGroup>
      </div>
    );
  },
  components: {},
});
