import { defineComponent, ref, watch } from "vue";
import {
  UserOutlined,
  PlusOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  InboxOutlined,
  MailOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import { TreeProps } from "ant-design-vue";
const menuList = [
  {
    name: "智能监控",
    key: "monitor",
  },
  {
    name: "报警管理",
    key: "alarm",
  },
  {
    name: "辅助系统",
    key: "assist",
  },
  {
    name: "设备管理",
    key: "device",
  },
  {
    name: "在线监测",
    key: "online",
  },
  {
    name: "系统管理",
    key: "system",
  },
];
export default defineComponent({
  setup() {
    const v = ref(false);
    const textVal = ref("aaaaa");
    const collapsed = ref(false);
    const openKeys = ref(["sub1"]);
    const selectedKeys = ref(["1"]);
    const name = ref("monitor");
    const dataSource = [
      {
        key: "1",
        name: "胡彦斌",
        age: 32,
        address: "西湖区湖底公园1号",
      },
      {
        key: "2",
        name: "胡彦祖",
        age: 42,
        address: "西湖区湖底公园1号",
      },
    ];
    const treeData = ref<TreeProps["treeData"]>([
      {
        title: "parent 1",
        key: "0-0",
        children: [
          {
            title: "parent 1-0",
            key: "0-0-0",
            children: [
              { title: "leaf", key: "0-0-0-0" },
              {
                key: "0-0-0-1",
              },
              { title: "leaf", key: "0-0-0-2" },
            ],
          },
          {
            title: "parent 1-1",
            key: "0-0-1",
            children: [{ title: "leaf", key: "0-0-1-0" }],
          },
          {
            title: "parent 1-2",
            key: "0-0-2",
            children: [
              { title: "leaf 1", key: "0-0-2-0" },
              {
                title: "leaf 2",
                key: "0-0-2-1",
              },
            ],
          },
        ],
      },
      {
        title: "parent 2",
        key: "0-1",
        children: [
          {
            title: "parent 2-0",
            key: "0-1-0",
            children: [
              { title: "leaf", key: "0-1-0-0" },
              { title: "leaf", key: "0-1-0-1" },
            ],
          },
        ],
      },
    ]);
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "住址",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "操作",
        dataIndex: "operation",
      },
    ];
    const visible = ref(false);
    const renderTable = () => {
      return (
        <a-table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 1 }}
        >
          {{
            bodyCell: ({ column }: any) => {
              if (column.dataIndex === "operation") {
                return <a>设置</a>;
              }
            },
          }}
        </a-table>
      );
    };
    watch(
      () => name.value,
      (e) => {
        console.log(e);
      }
    );
    return () => (
      <div class={"form-demo"}>
        <a-form
          label-col={{
            style: {
              width: "150px",
            },
          }}
          wrapper-col={{
            span: 14,
          }}
        >
          <a-form-item label="输入框：">
            <a-input vModels={[[textVal.value, "value"]]} />
            <a-input disabled vModels={[[textVal.value, "value"]]} />
          </a-form-item>

          <a-form-item label=" ">
            <a-checkbox>Remember me</a-checkbox>
          </a-form-item>
          <a-form-item label="Activity type">
            <a-checkbox-group>
              <a-checkbox value="1" name="type">
                Online
              </a-checkbox>
              <a-checkbox value="2" name="type">
                Promotion
              </a-checkbox>
              <a-checkbox value="3" name="type">
                Offline
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="开关">
            <a-switch v-models={[[v.value, "checked"]]} />
            <a-switch
              v-models={[[v.value, "checked"]]}
              checked-children="开"
              un-checked-children="关"
            />
            <a-switch v-models={[[v.value, "checked"]]} disabled />
          </a-form-item>

          <a-form-item label="下拉框">
            <a-select>
              <a-select-option value="Zhejiang">Zhejiang</a-select-option>
              <a-select-option value="Jiangsu">Jiangsu</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="时间选择">
            <a-date-picker />
          </a-form-item>

          <a-form-item label="表格">{renderTable()}</a-form-item>

          <a-form-item label="头像">
            <a-avatar>
              {{
                icon: () => <UserOutlined />,
              }}
            </a-avatar>
            <a-avatar>U</a-avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
            <a-avatar shape="square">
              {{
                icon: () => <UserOutlined />,
              }}
            </a-avatar>
            <a-avatar shape="square">U</a-avatar>
            <a-avatar shape="square" src="https://joeschmoe.io/api/v1/random" />
          </a-form-item>

          <a-form-item label="标签">
            <a-tag>Tag 1</a-tag>
            <a-tag closable>Tag 1</a-tag>
            <a-tag
              style={{ borderStyle: "dashed", backgroundColor: "transparent" }}
            >
              <PlusOutlined />
              Tag 1
            </a-tag>
            <a-tag color="green">green</a-tag>
            <a-tag color="blue">blue</a-tag>
            <a-tag color="orange">orange</a-tag>
            <a-tag color="red">red</a-tag>
          </a-form-item>

          <a-form-item label="气泡卡片">
            <a-popover
              title="Title"
              trigger="click"
              v-slots={{
                content: () => (
                  <>
                    <p>Content</p>
                    <p>Content</p>
                  </>
                ),
              }}
            >
              <a-button type="primary">Hover me</a-button>
            </a-popover>
          </a-form-item>

          <a-form-item label="气泡确认框">
            <a-popconfirm
              title="Are you sure delete this task?"
              ok-text="Yes"
              cancel-text="No"
            >
              <a href="#">Delete</a>
            </a-popconfirm>
          </a-form-item>

          <a-form-item label="对话框">
            <div>
              <a-button
                type="primary"
                onClick={() => {
                  visible.value = true;
                }}
              >
                Open Modal
              </a-button>
              <a-modal
                v-model={[visible.value, "visible"]}
                title="Basic Modal"
                onOk={() => {
                  visible.value = false;
                }}
              >
                <a-table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{ pageSize: 1 }}
                >
                  {{
                    bodyCell: ({ column }: any) => {
                      if (column.dataIndex === "operation") {
                        return <a>设置</a>;
                      }
                    },
                  }}
                </a-table>
              </a-modal>
            </div>
          </a-form-item>

          <a-form-item label="警告提示">
            <a-alert message="Success Tips" type="success" show-icon closable />
            <a-alert
              message="Informational Notes"
              type="info"
              show-icon
              closable
            />
            <a-alert message="Warning" type="warning" show-icon closable />
            <a-alert message="Error" type="error" show-icon closable />
            <a-alert
              message="Error Text"
              description="Error Description Error Description Error Description Error Description Error Description Error Description"
              type="success"
              closable
              show-icon
              onClose="onClose"
            />
            <a-alert
              message="Info Text"
              show-icon
              type="info"
              close-text="查看详情"
            />
          </a-form-item>
          <a-form-item label="面包屑">
            <a-breadcrumb>
              <a-breadcrumb-item>Home</a-breadcrumb-item>
              <a-breadcrumb-item>
                <a href="">Application Center</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item>
                <a href="">Application List</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item>An Application</a-breadcrumb-item>
            </a-breadcrumb>
            <a-breadcrumb>
              <a-breadcrumb-item>Ant Design Vue</a-breadcrumb-item>
              <a-breadcrumb-item>
                <a href="">Component</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item
                v-slots={{
                  overlay: () => (
                    <a-menu>
                      <a-menu-item>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://www.alipay.com/"
                        >
                          General
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://www.taobao.com/"
                        >
                          Layout
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="http://www.tmall.com/"
                        >
                          Navigation
                        </a>
                      </a-menu-item>
                    </a-menu>
                  ),
                }}
              >
                <a href="">General</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item>Button</a-breadcrumb-item>
            </a-breadcrumb>
          </a-form-item>

          <a-form-item label="导航">
            <div style="width: 256px">
              <a-button
                type="primary"
                style="margin-bottom: 16px"
                onClick={() => {
                  collapsed.value = !collapsed.value;
                }}
              >
                {collapsed.value ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )}
              </a-button>
              <a-menu
                v-models={[
                  [openKeys.value, "openKeys"],
                  [selectedKeys.value, "selectedKeys"],
                ]}
                mode="inline"
                inline-collapsed={collapsed.value}
              >
                <a-menu-item
                  key="1"
                  v-slots={{
                    icon: () => <PieChartOutlined />,
                  }}
                >
                  <span>Option 1</span>
                </a-menu-item>
                <a-menu-item
                  key="2"
                  v-slots={{
                    icon: () => <DesktopOutlined />,
                  }}
                >
                  <span>Option 2</span>
                </a-menu-item>
                <a-menu-item
                  key="3"
                  v-slots={{
                    icon: () => <InboxOutlined />,
                  }}
                >
                  <span>Option 3</span>
                </a-menu-item>
                <a-sub-menu
                  key="sub1"
                  v-slots={{
                    icon: () => <MailOutlined />,
                    title: () => <span>Navigation One</span>,
                  }}
                >
                  <a-menu-item key="5">Option 5</a-menu-item>
                  <a-menu-item key="6">Option 6</a-menu-item>
                  <a-menu-item key="7">Option 7</a-menu-item>
                  <a-menu-item key="8">Option 8</a-menu-item>
                </a-sub-menu>
                <a-sub-menu
                  key="sub2"
                  v-slots={{
                    icon: () => <AppstoreOutlined />,
                    title: () => <span>Navigation Two</span>,
                  }}
                >
                  <a-menu-item key="9">Option 9</a-menu-item>
                  <a-menu-item key="10">Option 10</a-menu-item>
                  <a-sub-menu key="sub3" title="Submenu">
                    <a-menu-item key="11">Option 11</a-menu-item>
                    <a-menu-item key="12">Option 12</a-menu-item>
                  </a-sub-menu>
                </a-sub-menu>
              </a-menu>
            </div>
            <a-menu
              v-models={[
                [openKeys.value, "openKeys"],
                [selectedKeys.value, "selectedKeys"],
              ]}
              mode="horizontal"
            >
              <a-menu-item
                key="1"
                v-slots={{
                  icon: () => <PieChartOutlined />,
                }}
              >
                <span>Option 1</span>
              </a-menu-item>
              <a-menu-item
                key="2"
                v-slots={{
                  icon: () => <DesktopOutlined />,
                }}
              >
                <span>Option 2</span>
              </a-menu-item>
              <a-menu-item
                key="3"
                v-slots={{
                  icon: () => <InboxOutlined />,
                }}
              >
                <span>Option 3</span>
              </a-menu-item>
              <a-sub-menu
                key="sub1"
                v-slots={{
                  icon: () => <MailOutlined />,
                  title: () => <span>Navigation One</span>,
                }}
              >
                <a-menu-item key="5">Option 5</a-menu-item>
                <a-menu-item key="6">Option 6</a-menu-item>
                <a-menu-item key="7">Option 7</a-menu-item>
                <a-menu-item key="8">Option 8</a-menu-item>
              </a-sub-menu>
              <a-sub-menu
                key="sub2"
                v-slots={{
                  icon: () => <AppstoreOutlined />,
                  title: () => <span>Navigation Two</span>,
                }}
              >
                <a-menu-item key="9">Option 9</a-menu-item>
                <a-menu-item key="10">Option 10</a-menu-item>
                <a-sub-menu key="sub3" title="Submenu">
                  <a-menu-item key="11">Option 11</a-menu-item>
                  <a-menu-item key="12">Option 12</a-menu-item>
                </a-sub-menu>
              </a-sub-menu>
            </a-menu>
          </a-form-item>
          <a-form-item label="树">
            <a-tree
              show-line={true}
              show-icon={true}
              default-expanded-keys={["0-0-0"]}
              tree-data={treeData.value}
            ></a-tree>
          </a-form-item>
        </a-form>
        <inl-about />

        <inl-header-menu
          v-model={[name.value, "active"]}
          title={"数据可视化大屏标题"}
          mode="center"
          menuList={menuList}
          onChange={(e) => {
            console.log(e);
          }}
        ></inl-header-menu>
      </div>
    );
  },
});
