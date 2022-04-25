/*
 * @Abstract: 人员表格
 * @Author: wang liang
 * @Date: 2022-04-07 13:51:43
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:55:35
 */

import { computed, defineComponent, ref, watch } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import api from "@/pageComponent/api/org/depManager";

import { Space, Button, Table, Input, Modal } from "ant-design-vue";
import UpdateEmployeeDialog from "./updateEmployeeDialog";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "所属部门",
    dataIndex: "depName",
    key: "depName",
  },
  {
    title: "岗位名称",
    dataIndex: "jobPostNames",
    key: "jobPostNames",
  },
  {
    title: "直接上级",
    dataIndex: "bossName",
    key: "bossName",
  },
  {
    title: "电话",
    dataIndex: "mobile",
    key: "mobile",
  },
  {
    title: "创建人",
    dataIndex: "createUser",
    key: "createUser",
  },
  {
    title: "创建时间",
    dataIndex: "createDt",
    key: "createDt",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const EmployeeTable = defineComponent({
  props: {
    depId: {
      type: [Number, String],
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const keyword = ref("");

    const isTopLevel = computed(() => `${props.depId}`.startsWith("sys"));

    const { isLoading, tableList, refresh, currPage, handlePageChange, total } =
      useTableList(() => {
        if (props.depId) {
          // 选煤厂不加部门id  查全部
          const depId = isTopLevel.value ? null : props.depId;
          return api.getEmployeeList({
            departmentId: depId,
            keyword: keyword.value,
            pageNum: currPage.value,
            pageSize: 10,
          });
        }
        return Promise.resolve({ data: [] });
      }, "employeeList");

    /* 当前选中的部门变化 重新查询列表 */
    watch(
      () => props.depId,
      (val) => {
        if (val) {
          currPage.value = 1;
          refresh();
        } else {
          tableList.value = [];
          total.value = 0;
          currPage.value = 1;
        }
      },
      { immediate: true }
    );

    // 查看
    const [isViewDialogShow, handleViewClick, viewRecord] =
      useModalVisibleControl();
    // 新增
    const [isAddDialogShow, handleAddClick] = useModalVisibleControl();
    // 编辑
    const [isEditDialogShow, handleEditClick, editRecord] =
      useModalVisibleControl();

    // 删除
    const handleDeleteClick = (record: any) => {
      Modal.confirm({
        title: "删除人员",
        content: `确定删除人员${record.name}?`,
        async onOk() {
          await api.deleteEmployeeById(record.id);
          refresh();
        },
      });
    };

    return () => (
      <div class="employee-table">
        <h2 class="部门人员详情"></h2>
        <div class="operation">
          <Space>
            <Button
              type="primary"
              disabled={isTopLevel.value || !props.isValid}
              onClick={handleAddClick}
            >
              新建
            </Button>
          </Space>
          <Input
            style={{ width: "200px" }}
            placeholder="请输入"
            allowClear
            v-model={[keyword.value, "value"]}
            onInput={refresh}
          />
        </div>
        <Table
          loading={isLoading.value}
          columns={columns}
          dataSource={tableList.value}
          pagination={{
            pageSize: 10,
            current: currPage.value,
            "onUpdate:current": handlePageChange,
            total: total.value,
          }}
        >
          {{
            action: ({ record }: any) => (
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
            ),
          }}
        </Table>

        <UpdateEmployeeDialog
          mode="view"
          record={viewRecord.value}
          v-model={[isViewDialogShow.value, "visible"]}
        />
        <UpdateEmployeeDialog
          mode="add"
          depId={props.depId}
          v-model={[isAddDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
        <UpdateEmployeeDialog
          mode="edit"
          record={editRecord.value}
          depId={props.depId}
          v-model={[isEditDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
      </div>
    );
  },
});

export default EmployeeTable;
