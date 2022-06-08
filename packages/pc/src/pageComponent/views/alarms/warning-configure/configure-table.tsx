import { defineComponent, inject, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Modal, message } from "ant-design-vue";
import { TransformCellTextProps } from "ant-design-vue/es/table/interface";
import {
  deleteAlarmRule,
  getAllRule,
  updateAvailable,
} from "@/pageComponent/api/alarm/warningConfigure";
import TableTool from "./table-tool";
import BatchImportDialog from "./batch-import-dialog";
import { IUrlObj } from "./index";

const columns = [
  // {
  //   title: '报警等级',
  // },
  {
    title: "报警名称",
    dataIndex: "name",
  },
  {
    title: "报警设备",
  },
  {
    title: "报警状态",
    slots: { customRender: "status" },
  },
  {
    title: "操作",
    slots: { customRender: "operation" },
  },
];

const WarningConfigure = defineComponent({
  props: {
    onShowAdd: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const urlObj = inject<IUrlObj>("urlObj")!;

    const router = useRouter();

    const page = reactive({
      current: 1,
      size: 10,
      total: 0,
    });
    const form = ref({});
    const allRuleList = ref<Array<any>>([]);
    const isLoading = ref(false);
    /* ===== 批量导入 ===== */
    const isBatchImportDialogShow = ref(false);
    const handleImportClick = () => {
      isBatchImportDialogShow.value = true;
    };
    const getAllRuleList = async () => {
      isLoading.value = true;
      try {
        const res = await getAllRule(urlObj.ruleList)({
          pageNum: page.current,
          pageSize: page.size,
          sort: "desc",
          ...form.value,
        });
        allRuleList.value = res.data.records;
        page.total = res.data.total;
      } finally {
        isLoading.value = false;
      }
    };
    const search = (data: { keyword: string }) => {
      if (data.keyword !== "") {
        form.value = data;
      } else {
        form.value = {};
      }
      getAllRuleList();
    };

    // 切换报警状态
    const handleSwitchStatus = (record: any, checked: boolean) => {
      Modal.confirm({
        title: `确定${checked ? "启用" : "停用"}`,
        content: `确定${checked ? "启用" : "停用"}报警规则"${record.name}"？`,
        async onOk() {
          await updateAvailable(urlObj.switchEnable)(record.id, checked);
          message.success(`${checked ? "启用" : "停用"}成功`);
          getAllRuleList();
        },
      });
    };

    // 删除一条配置
    const handleDelete = (record: any) => {
      Modal.confirm({
        title: "确认删除",
        content: `确认删除报警记录“${record.name}”？`,
        async onOk() {
          await deleteAlarmRule(urlObj.deleteRule)(record.id);
          message.success("删除成功");
          getAllRuleList();
        },
      });
    };

    // 编辑配置
    const handleEdit = (record: any) => {
      props.onShowAdd(record);
    };

    onMounted(() => {
      getAllRuleList();
    });
    return () => (
      <div class="warning-configure">
        <TableTool
          onSubmit={search}
          onImportClick={handleImportClick}
          onAddClick={() => props.onShowAdd()}
        />
        <a-table
          columns={columns}
          dataSource={allRuleList.value}
          loading={isLoading.value}
          rowKey="id"
          pagination={{
            showTotal: (total: number) => `共${total}条数据`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: page.current,
            total: page.total,
            pageSize: page.size,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (p: number) => {
              page.current = p;
              getAllRuleList();
            },
            onShowSizeChange: (current, size) => {
              page.size = size;
              page.current = 1;
              getAllRuleList();
            },
          }}
        >
          {{
            status: ({ record }: TransformCellTextProps) => (
              <a-switch
                checked={record.available}
                checkedChildren="开"
                unCheckedChildren="关"
                onClick={(checked) => handleSwitchStatus(record, checked)}
              />
            ),
            operation: ({ record }: TransformCellTextProps) => (
              <a-space>
                <a-button
                  size="small"
                  type="link"
                  onClick={() => handleEdit(record)}
                >
                  编辑
                </a-button>
                <a-button
                  size="small"
                  danger
                  type="link"
                  onClick={() => handleDelete(record)}
                >
                  删除
                </a-button>
              </a-space>
            ),
          }}
        </a-table>
        <BatchImportDialog
          v-model={[isBatchImportDialogShow.value, "visible"]}
          onRefresh={getAllRuleList}
        />
      </div>
    );
  },
});

export default WarningConfigure;
