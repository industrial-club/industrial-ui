import { defineComponent, PropType, provide, ref } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api from "@/pageComponent/api/auth/roleManager";
import utils from "@/utils";

import { message, Modal } from "ant-design-vue";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import UpdateRoleDialog from "./updateRoleDialog";

export interface IUrlObj {
  // 角色列表
  list: string;
  // 切换角色启用状态
  switchStatus: string;
  // 保存角色 新增/更新
  save: string;
  // 删除角色
  delete: string;
  // 获取角色权限树- 编辑角色
  editPermission: string;
  // 获取角色权限树- 新建角色
  addPermission: string;
}

const DEFAULT_URL: IUrlObj = {
  list: "/comlite/v1/role/all/page",
  save: "/comlite/v1/role/insertRole",
  addPermission: "/comlite/v1/role/getRoleTree",
  delete: "/comlite/v1/role/deleteRoleType",
  editPermission: "/comlite/v1/role/getRoleTreeEdit",
  switchStatus: "/comlite/v1/role/roleEnabe",
};

const columns = [
  {
    title: "角色名称",
    dataIndex: "roleTypeName",
  },
  {
    title: "角色人数",
    dataIndex: "userCount",
  },
  {
    title: "角色描述",
    dataIndex: "roleDesc",
  },
  {
    title: "创建人",
    dataIndex: "createdPerson",
  },
  {
    title: "创建时间",
    dataIndex: "createdTimeStr",
  },
  {
    title: "启用状态",
    key: "status",
    slots: { customRender: "status" },
  },
  {
    title: "操作",
    key: "operaton",
    slots: { customRender: "operation" },
  },
];

/**
 * 角色管理
 */
const RoleManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const urlMap = { ...DEFAULT_URL, ...props.url };
    provide("urlMap", urlMap);

    const filter = ref({
      keyword: "",
    });

    const { isLoading, refresh, tableList, total, currPage, handlePageChange } =
      useTableList(
        () =>
          api.getRoleListByPager(urlMap.list)({
            keyword: filter.value.keyword,
            pageNum: currPage.value,
            pageSize: 10,
          }),
        "roleList"
      );
    refresh();

    /* 控制启用 */
    const handleSwitchEnable = async (status: boolean, record: any) => {
      Modal.confirm({
        title: "提示",
        content: `是否${status ? "启用" : "禁用"}角色“${record.roleTypeName}”?`,
        async onOk() {
          await api.switchRoleEnableStatus(urlMap.switchStatus)({
            roleTypeId: record.roleTypeId,
            enable: Number(status),
          });
          message.success(`${status ? "启用" : "禁用"}成功`);
          refresh();
        },
      });
    };

    /* ===== 查看逻辑 ===== */
    const isViewDialogShow = ref(false);
    const viewRoleRecord = ref({});
    const handleViewClick = (row: any) => {
      isViewDialogShow.value = true;
      viewRoleRecord.value = row;
    };

    /* ===== 新增逻辑 ===== */
    const isAddDialogShow = ref(false);
    const handleAddClick = () => (isAddDialogShow.value = true);

    /* ===== 编辑逻辑 ===== */
    const isEditDialogShow = ref(false);
    const editRoleRecord = ref({});
    const handleEditClick = (row: any) => {
      isEditDialogShow.value = true;
      editRoleRecord.value = row;
    };

    /* 删除角色 */
    const handleDeleteClick = (record: any) => {
      if (record.userCount > 0) {
        Modal.error({
          content: `角色“${record.roleTypeName}”的使用人数不为“0”,不能删除。请先清空使用人数。`,
        });
      } else {
        Modal.confirm({
          title: "删除角色",
          content: `确定删除角色“${record.roleTypeName}”?`,
          async onOk() {
            await api.deleteRoleById(urlMap.delete)(record.roleTypeId);
            message.success("删除成功");
            refresh();
          },
        });
      }
    };

    const handleSubmit = () => {
      refresh();
    };

    return () => (
      <div class="role-manager">
        <div class="table-search">
          <a-form
            v-model={filter.value}
            name="basic"
            layout="inline"
            class="searchLine"
            onSubmit={handleSubmit}
          >
            <a-form-item label="角色名称">
              <a-input
                placeholder="请输入角色名称"
                allowClear
                v-model={[filter.value.keyword, "value"]}
              />
            </a-form-item>

            <a-button type="primary" html-type="submit">
              <SearchOutlined />
              查询角色
            </a-button>
          </a-form>
          <div class="operator">
            <a-button type="primary" onClick={handleAddClick}>
              <PlusOutlined />
              新建角色
            </a-button>
          </div>
        </div>

        <a-table
          pagination={{
            pageSize: 10,
            current: currPage.value,
            "onUpdate:current": handlePageChange,
            total: total.value,
          }}
          loading={isLoading.value}
          columns={columns}
          dataSource={tableList.value}
        >
          {{
            status: ({ record }: any) => (
              <a-switch
                checked={record.enable === 1}
                onClick={
                  ((status: boolean) =>
                    handleSwitchEnable(status, record)) as any
                }
              />
            ),
            operation: ({ record }: any) => (
              <a-space>
                <a-button
                  size="small"
                  type="link"
                  onClick={() => handleViewClick(record)}
                >
                  查看
                </a-button>
                {record.editFlg && (
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => handleEditClick(record)}
                  >
                    编辑
                  </a-button>
                )}
                {record.deleteFlg && (
                  <a-button
                    size="small"
                    type="link"
                    danger
                    onClick={() => handleDeleteClick(record)}
                  >
                    删除
                  </a-button>
                )}
              </a-space>
            ),
          }}
        </a-table>

        {/* 对话框 */}
        <UpdateRoleDialog
          mode="add"
          v-model={[isAddDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
        <UpdateRoleDialog
          mode="edit"
          v-model={[isEditDialogShow.value, "visible"]}
          record={editRoleRecord.value}
          onRefresh={refresh}
        />
        <UpdateRoleDialog
          mode="view"
          v-model={[isViewDialogShow.value, "visible"]}
          record={viewRoleRecord.value}
        />
      </div>
    );
  },
});

export default utils.installComponent(RoleManager, "role-manager");
