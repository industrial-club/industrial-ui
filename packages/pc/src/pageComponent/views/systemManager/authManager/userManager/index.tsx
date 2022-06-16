import {
  defineComponent,
  h,
  resolveComponent,
  ref,
  PropType,
  provide,
} from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api, { setInstance } from "@/api/auth/userManager";
import utils from "@/utils";

import { Modal, message } from "ant-design-vue";
import UpdateUserDialog from "./updateUserDialog";
import UserProfileDialog from "./userProfileDialog";

export interface IUrlObj {
  // 列表查询
  list: string;
  // 用户详情
  detail: string;
  // 新增用户
  add: string;
  // 更新用户
  update: string;
  // 删除用户
  delete: string;
  // 角色列表（下拉框）
  roleList: string;
  // 员工列表(下拉框)
  employeeList: string;
  // 重置密码
  resetPass: string;
  // 员工详情
  employeeDetail: string;
}

interface FormState {
  userName: string;
}

const column = [
  {
    title: "用户名",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "所属角色",
    dataIndex: "roleTypeNames",
    key: "roleTypeNames",
  },
  {
    title: "员工姓名",
    dataIndex: "employeeName",
    key: "employeeName",
    slots: { customRender: "employeeName" },
  },
  {
    title: "电话",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "创建人",
    dataIndex: "createUser",
    key: "createUser",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const UserManager = defineComponent({
  props: {
    // 请求url集合 (/api/后面的)
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
  setup(props) {
    setInstance({ prefix: props.prefix, serverName: props.serverName });
    provide("urlPrefix", {
      prefix: props.prefix,
      serverName: props.serverName,
    });

    const urlMap = { ...props.url };
    provide("urlMap", urlMap);

    const formState = ref<FormState>({
      userName: "",
    });

    /* 调用hook 初始化查询一次 */
    const {
      currPage,
      handlePageChange,
      isLoading,
      refresh,
      tableList,
      total,
      pageSize,
      hanldePageSizeChange,
    } = useTableList(
      () =>
        api.getUserList(urlMap.list)({
          keyWord: formState.value.userName,
          pageNum: currPage.value,
          pageSize: pageSize.value,
        }),
      "userJsons"
    );
    refresh();

    const handleSubmit = () => {
      refresh();
    };

    /* ===== 新增用户 ===== */
    const isAddDialogShow = ref(false);
    const handleAddClick = () => (isAddDialogShow.value = true);

    /* ==== 查看用户 ===== */
    const isViewDialogShow = ref(false);
    const viewUserRecord = ref({});
    const handleView = async (row: any) => {
      const { data } = await api.detail(urlMap.detail)({ userId: row.userId });
      viewUserRecord.value = {
        ...data,
        employeeName: row.employeeName,
        employeeId: row.employeeId,
        roleIds: row.roleIds,
      };
      isViewDialogShow.value = true;
    };

    /* ===== 编辑用户 ===== */
    const isEditDialogShow = ref(false);
    const editUserRecord = ref({});
    const handleEditClick = async (row: any) => {
      const { data } = await api.detail(urlMap.detail)({ userId: row.userId });
      editUserRecord.value = {
        ...data,
        employeeName: row.employeeName,
        employeeId: row.employeeId,
        roleIds: row.roleIds,
      };
      isEditDialogShow.value = true;
    };

    /* ===== 展示用户详情 ===== */
    const isDescDialogShow = ref(false);
    const descUserRecord = ref({});
    const handleDecs = (e: MouseEvent, row: any) => {
      e.preventDefault();
      isDescDialogShow.value = true;
      descUserRecord.value = row;
    };

    /* 删除用户 */
    const handleDeleteUser = (record: any) => {
      Modal.confirm({
        title: "删除用户",
        content: `确定删除用户“${record.userName}”?`,
        async onOk() {
          await api.deleteUserById(urlMap.delete)(record.userId);
          message.success("删除成功");
          refresh();
        },
      });
    };

    return () => (
      <div class="userManager">
        <div class="table-search" style={{ marginBottom: "16px" }}>
          <a-form
            model={formState.value}
            name="basic"
            layout="inline"
            class="searchLine"
            onSubmit={handleSubmit}
          >
            <a-form-item label="用户名称">
              <a-input
                placeholder="请输入用户名称"
                allowClear
                v-model={[formState.value.userName, "value"]}
              />
            </a-form-item>

            {/* <a-form-item> */}
            <a-button
              type="primary"
              html-type="submit"
              v-slots={{
                icon: () => h(resolveComponent("SearchOutlined")),
              }}
            >
              搜索
            </a-button>
            {/* </a-form-item> */}
          </a-form>
          <div class="operation">
            <a-button
              type="primary"
              v-slots={{
                icon: () => h(resolveComponent("PlusOutlined")),
              }}
              onClick={handleAddClick}
            >
              新建用户
            </a-button>
          </div>
        </div>

        <a-table
          dataSource={tableList.value}
          columns={column}
          rowKey="userId"
          loading={isLoading.value}
          pagination={{
            pageSize: pageSize.value,
            current: currPage.value,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共${total}条`,
            total: total.value,
            "onUpdate:current": handlePageChange,
            "onUpdate:pageSize": hanldePageSizeChange,
          }}
          v-slots={{
            employeeName: ({ record }: any) => {
              return (
                <a onClick={(e) => handleDecs(e, record)}>
                  {record.employeeName}
                </a>
              );
            },
            action: ({ record }: any) => {
              return (
                <>
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => handleView(record)}
                  >
                    查看
                  </a-button>
                  {record.editFlg && (
                    <a-button
                      size="small"
                      type="link"
                      onClick={() => handleEditClick(record)}
                      style="margin: 0 10px"
                    >
                      编辑
                    </a-button>
                  )}
                  {record.deleteFlg && (
                    <a-button
                      size="small"
                      type="link"
                      danger
                      onClick={() => handleDeleteUser(record)}
                    >
                      删除
                    </a-button>
                  )}
                </>
              );
            },
          }}
        />

        {/* 对话框 */}
        <UpdateUserDialog
          mode="add"
          v-model={[isAddDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
        <UpdateUserDialog
          mode="edit"
          v-model={[isEditDialogShow.value, "visible"]}
          record={editUserRecord.value}
          onRefresh={refresh}
        />
        <UpdateUserDialog
          mode="view"
          v-model={[isViewDialogShow.value, "visible"]}
          record={viewUserRecord.value}
        />
        <UserProfileDialog
          record={descUserRecord.value}
          v-model={[isDescDialogShow.value, "visible"]}
        />
      </div>
    );
  },
});

export default utils.installComponent(UserManager, "user-manager");
