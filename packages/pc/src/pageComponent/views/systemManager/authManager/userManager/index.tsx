import { defineComponent, reactive, h, resolveComponent, ref } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api from "@/pageComponent/api/auth/userManager";

import {
  Table,
  Form,
  FormItem,
  Input,
  Button,
  Space,
  Modal,
  message,
} from "ant-design-vue";
import UpdateUserDialog from "./updateUserDialog";
import UserProfileDialog from "./userProfileDialog";

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

export default defineComponent({
  setup() {
    const formState = reactive<FormState>({
      userName: "",
    });

    /* 调用hook 初始化查询一次 */
    const { currPage, handlePageChange, isLoading, refresh, tableList, total } =
      useTableList(
        () =>
          api.getUserList({
            keyWord: formState.userName,
            pageNum: currPage.value,
            pageSize: 10,
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
      const { data } = await api.detail({ userId: row.id });
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
      const { data } = await api.detail({ userId: row.id });
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
          await api.deleteUserById(record.userId);
          message.success("删除成功");
          refresh();
        },
      });
    };

    return () => (
      <div class="userManager">
        <Form
          v-model={formState}
          name="basic"
          layout="inline"
          class="searchLine"
          onSubmit={handleSubmit}
        >
          <div>
            <FormItem label="用户名称">
              <Input
                placeholder="请输入用户名称"
                allowClear
                v-model={[formState.userName, "value"]}
              />
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                html-type="submit"
                v-slots={{
                  icon: () => h(resolveComponent("SearchOutlined")),
                }}
              >
                搜索
              </Button>
            </FormItem>
          </div>

          <FormItem>
            <Button
              type="primary"
              v-slots={{
                icon: () => h(resolveComponent("PlusOutlined")),
              }}
              onClick={handleAddClick}
            >
              新建用户
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={tableList.value}
          columns={column}
          size="middle"
          loading={isLoading.value}
          pagination={{
            pageSize: 10,
            current: currPage.value,
            "onUpdate:current": handlePageChange,
            total: total.value,
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
                  <Button type="link" onClick={() => handleView(record)}>
                    查看
                  </Button>
                  {record.editFlg && (
                    <Button
                      type="link"
                      onClick={() => handleEditClick(record)}
                      style="margin: 0 10px"
                    >
                      编辑
                    </Button>
                  )}
                  {record.deleteFlg && (
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteUser(record)}
                    >
                      删除
                    </Button>
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
