import { defineComponent, PropType, provide, ref } from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import api, { setInstance } from "@/pageComponent/api/org/postManager";
import utils from "@/utils";

import { message, Modal } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import UpdatePostDialog from "./updatePostDialog";

export interface IUrlObj {
  // 岗位列表
  list: string;
  // 新增岗位
  add: string;
  // 更新岗位
  update: string;
  // 删除岗位
  delete: string;
  // 部门列表 (添加、编辑 部门下拉框)
  depList: string;
  // 切换岗位启用状态
  switchStatus: string;
}

const column = [
  {
    title: "岗位名称",
    dataIndex: "name",
  },
  {
    title: "所属部门",
    dataIndex: "depName",
  },
  {
    title: "使用人数",
    dataIndex: "employeeCount",
  },
  {
    title: "岗位描述",
    dataIndex: "remark",
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
    title: "启用状态",
    key: "valid",
    slots: { customRender: "valid" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const PostManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    urlPrefix: {
      type: String,
    },
  },
  setup(prop, context) {
    if (prop.urlPrefix) setInstance(prop.urlPrefix);
    const urlMap = { ...prop.url };
    provide("urlMap", urlMap);

    const form = ref({
      keyWord: "",
    });

    const { currPage, total, handlePageChange, isLoading, refresh, tableList } =
      useTableList(
        () =>
          api.getPostList(urlMap.list)({
            pageNum: currPage.value,
            pageSize: 10,
            keyword: form.value.keyWord,
          }),
        "jobPostList"
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
      if (record.employeeCount > 0) {
        return message.warning("该岗位已引用，请删除引用才能删除或禁用");
      }
      Modal.confirm({
        title: "删除岗位",
        content: `是否删除岗位“${record.name}”?`,
        async onOk() {
          await api.deletePostById(urlMap.delete)(record.id);
          message.success("删除成功");
          refresh();
        },
      });
    };

    /* 切换启用状态 */
    const handleSwitchEnable = async (record: any, checked: boolean) => {
      if (!checked && record.employeeCount > 0) {
        return message.warning("该岗位已引用，请删除引用才能删除或禁用");
      }
      Modal.confirm({
        title: "提示",
        content: `确定${checked ? "启用" : "禁用"}吗`,
        async onOk() {
          await api.switchPostEnable(urlMap.switchStatus)({
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
              新建岗位
            </a-button>
            <a-input
              placeholder="请输入岗位名称"
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
                <>
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
                </>
              );
            },
          }}
        />

        <UpdatePostDialog
          mode="view"
          record={viewRecord.value}
          v-model={[isViewDialogShow.value, "visible"]}
        />
        <UpdatePostDialog
          mode="add"
          v-model={[isAddDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
        <UpdatePostDialog
          mode="edit"
          record={editRecord.value}
          v-model={[isEditDialogShow.value, "visible"]}
          onRefresh={refresh}
        />
      </div>
    );
  },
});

export default utils.installComponent(PostManager, "post-manager");
