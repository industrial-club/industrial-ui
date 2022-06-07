import { defineComponent, ref, provide, PropType } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import api, { setInstance } from "@/pageComponent/api/org/teamManager";
import utils from "@/utils";

import { message, Modal } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import UpdateTeamDialog from "./updateTeamDialog";

export interface IUrlObj {
  // 班组列表
  list: string;
  // 新增班组
  add: string;
  // 更新班组
  update: string;
  // 删除班组
  delete: string;
  // 启用/禁用班组
  switchStatus: string;
  // 获取部门列表(添加、编辑 部门下拉框)
  depList: string;
  // 岗位下拉列表
  postList: string;
  // 获取人员列表 (下拉框)
  empList: string;
}

const column = [
  {
    title: "班组名称",
    dataIndex: "name",
  },
  {
    title: "所属部门",
    dataIndex: "depName",
  },
  {
    title: "岗位名称",
    dataIndex: "jobPostName",
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

const TeamManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    prefix: {
      type: String,
    },
    serverName: {
      type: String,
    },
  },
  setup(prop, context) {
    setInstance({ prefix: prop.prefix, serverName: prop.serverName });
    const urlMap = { ...prop.url };
    provide("urlMap", urlMap);
    provide("urlPrefix", {
      prefix: prop.prefix,
      serverName: prop.serverName,
    });

    const form = ref({
      keyWord: "",
    });

    const { currPage, total, handlePageChange, isLoading, refresh, tableList } =
      useTableList(
        () =>
          api.getTeamListByPage(urlMap.list)({
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
          await api.deleteTeamById(urlMap.delete)(record.id);
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
          await api.switchEnableTeam(urlMap.switchStatus)({
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
          <a-space style={{ width: "100%", justifyContent: "space-between" }}>
            <a-button type="primary" onClick={handleAddClick}>
              新建班组
            </a-button>
            <a-input
              placeholder="请输入班组名称"
              allowClear
              suffix={<SearchOutlined />}
              v-model={[form.value.keyWord, "value"]}
              onChange={refresh}
            ></a-input>
          </a-space>
        </div>

        <a-table
          loading={isLoading.value}
          dataSource={tableList.value}
          columns={column}
          pagination={{ total: total.value, onChange: handlePageChange }}
          v-slots={{
            valid: ({ record }: any) => {
              return (
                <a-switch
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
                <a-space>
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => handleViewClick(record)}
                  >
                    查看
                  </a-button>
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => handleEditClick(record)}
                  >
                    编辑
                  </a-button>
                  <a-button
                    size="small"
                    type="link"
                    danger
                    onClick={() => handleDeleteClick(record)}
                  >
                    删除
                  </a-button>
                </a-space>
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

export default utils.installComponent(TeamManager, "team-manager");
