import { defineComponent, ref } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import api from "@/pageComponent/api/org/teamManager";

import {
  Table,
  Input,
  Button,
  Switch,
  Space,
  message,
  Modal,
} from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import UpdateTeamDialog from "./updateTeamDialog";

const column = [
  {
    title: "所属部门",
    dataIndex: "depName",
  },
  {
    title: "岗位名称",
    dataIndex: "jobPostName",
  },
  {
    title: "班组名称",
    dataIndex: "name",
  },
  {
    title: "班组组长",
    dataIndex: "leaderName",
  },
  {
    title: "班组成员",
    dataIndex: "memberNames",
  },
  {
    title: "创建人",
    dataIndex: "createUser",
  },
  {
    title: "创建时间",
    dataIndex: "createDt",
  },
  {
    title: "启动",
    index: "valid",
    slots: { customRender: "valid" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

export default defineComponent({
  setup(prop, context) {
    const form = ref({
      keyWord: "",
    });

    const { currPage, total, handlePageChange, isLoading, refresh, tableList } =
      useTableList(
        () =>
          api.getTeamListByPage({
            pageNum: currPage.value,
            pageSize: 10,
            keyword: form.value.keyWord,
          }),
        "workgroupList"
      );
    refresh();

    /* 查看 */
    const [isViewDialogShow, handleViewClick, viewRecord] =
      useModalVisibleControl();
    /* 新增 */
    const [isAddDialogShow, handleAddClick] = useModalVisibleControl();
    /* 编辑 */
    const [isEditDialogShow, handleEditClick, editRecord] =
      useModalVisibleControl();

    /* 删除 */
    const handleDeleteClick = (record: any) => {
      Modal.confirm({
        title: "删除班组",
        content: `确定删除班组“${record.name}”?`,
        async onOk() {
          await api.deleteTeamById(record.id);
          message.success("删除成功");
          refresh();
        },
      });
    };

    /* 切换启用状态 */
    const handleSwitchEnable = async (record: any, checked: boolean) => {
      Modal.confirm({
        title: "提示",
        content: `确定${checked ? "启用" : "禁用"}吗`,
        async onOk() {
          await api.switchEnableTeam({
            id: record.id,
            valid: checked ? 1 : 0,
          });
          message.success(`${checked ? "启用" : "禁用"}成功`);
          refresh();
        },
      });
    };

    return () => (
      <div class="postManager">
        <div class="control">
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Button type="primary" onClick={handleAddClick}>
              新建班组
            </Button>
            <Input
              placeholder="请输入"
              allowClear
              suffix={<SearchOutlined />}
              v-model={[form.value.keyWord, "value"]}
              onChange={refresh}
            ></Input>
          </Space>
        </div>

        <Table
          size="middle"
          loading={isLoading.value}
          dataSource={tableList.value}
          columns={column}
          pagination={{ total: total.value, onChange: handlePageChange }}
          v-slots={{
            valid: ({ record }: any) => {
              return (
                <Switch
                  checked={record.valid === 1}
                  onClick={
                    ((checked: boolean, e: any) =>
                      handleSwitchEnable(record, checked)) as any
                  }
                />
              );
            },
            action: ({ record }: any) => {
              return (
                <Space>
                  <Button type="link" onClick={() => handleViewClick(record)}>
                    查看
                  </Button>
                  <Button type="link" onClick={() => handleEditClick(record)}>
                    编辑
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDeleteClick(record)}
                  >
                    删除
                  </Button>
                </Space>
              );
            },
          }}
        />

        <UpdateTeamDialog
          mode="view"
          record={viewRecord.value}
          v-model={[isViewDialogShow.value, "visible"]}
        />
        <UpdateTeamDialog
          mode="add"
          v-model={[isAddDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
        <UpdateTeamDialog
          mode="edit"
          record={editRecord.value}
          v-model={[isEditDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
      </div>
    );
  },
});
