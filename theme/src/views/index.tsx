import { defineComponent, ref, watch } from "vue";
import {
  Menu,
  Switch,
  Radio,
  message,
  Select,
  Tabs,
  TabPane,
  Table,
} from "ant-design-vue";

const item = Menu.Item;
const SubMenu = Menu.SubMenu;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const SelectOption = Select.Option;

const columns = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    sorter: true,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Action",
    key: "action",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
export default defineComponent({
  setup() {
    const checked = ref(false);
    const radio = ref("a");
    const activeKey = ref("1");
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
        <Select style={{ width: "200px" }}>
          <SelectOption value="jack">Jack</SelectOption>
          <SelectOption value="lucy">Lucy</SelectOption>
        </Select>
        <Tabs v-model={[activeKey.value, "activeKey"]}>
          <TabPane key="1" tab="Tab 1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane key="2" tab="Tab 2" force-render>
            Content of Tab Pane 2
          </TabPane>
          <TabPane key="3" tab="Tab 3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
        <Table data-source={data} columns={columns}></Table>
      </div>
    );
  },
  components: {},
});
