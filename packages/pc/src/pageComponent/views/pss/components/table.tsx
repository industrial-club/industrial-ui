import { defineComponent, reactive } from 'vue';
import { Button, Table } from "ant-design-vue";
import { randomKey } from "../utils";

export default defineComponent({
  setup(prop, context) {
    const tableConfig: any = reactive({
      loading: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "column1",
          title: "申请类型",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "发起人",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "当前状态",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "设备编号/名称",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "回路数量",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "控制回路",

          align: "center",
        },
        {
          dataIndex: "column1",
          title: "申请原因",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "计划停电时间",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "计划送电时间",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "执行操作",
          width: "15%",
          align: "center",
          customRender({ text }: any) {
            return (
              <div class="operation">
                <div class="op">
                  <span>拒绝</span>
                  <span>同意</span>
                </div>
                <div>详情</div>
              </div>
            );
          },
        },
      ],
    });
    return () => (
      <div class="pss_content">
        <div></div>
        <div class="operation_btn">
          <Button type="primary">新建工单</Button>
          <Button disabled>批量审批</Button>
        </div>
        <div class="table">
          <Table
            pagination={false}
            rowKey={(record: any) => {
              if (!record.rowKey) {
                record.rowKey = randomKey();
              }
              return record.rowKey;
            }}
            columns={tableConfig.columns}
            loading={tableConfig.loading}
            scroll={{ y: "100%" }}
            dataSource={tableConfig.dataSource}
            class="cus-table"
          ></Table>
        </div>
      </div>
    );
  },
});
