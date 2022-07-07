import { defineComponent, onMounted, nextTick, ref, shallowRef, reactive } from "vue";
import { RouterView } from "vue-router";
import { setRem } from "@/pageComponent/utils";
import utils from "@/utils";
import {
  Table,
  Pagination,
  Button,
  Row,
  Col,
  Select,
  RangePicker,
  Form,
  FormItem
} from "ant-design-vue";
import { randomKey } from "../pss/utils";
import './assets/index.less';


const com = defineComponent({
  components: {
    
  },
  setup() {
    onMounted(() => {});
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
           title: "车间",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "设备编号/设备",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "回路名称",
           width: "15%",
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
           title: "停电申请人",

           align: "center",
         },
         {
           dataIndex: "column1",
           title: "停电审批人",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "停电操作人",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "停电时间",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "送电申请人",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "送电审批人",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "送电操作人",
           width: "15%",
           align: "center",
         },
         {
           dataIndex: "column1",
           title: "送电时间",
           width: "15%",
           align: "center",
         },
         
       ],
     });
     const onSelectChange = () => {};
     const selectedRow: any = reactive({
       selectedRowKeys: [],
       selectedRows: [],
     });
    return () => (
      <div class="pssRecord">
        <div class="seachFrom">
          <Form
            labelAlign="right"
            layout="inline"
          >
            <FormItem label="车间">
              <Select></Select>
            </FormItem>
            <FormItem label="设备编号">
              <Select></Select>
            </FormItem>
            <FormItem label="申请开始时间">
              <RangePicker showTime format="YYYY/MM/DD HH:mm:ss"></RangePicker>
            </FormItem>
          </Form>

          <div class="op">
            <Button type="primary">查询</Button>
            <Button>重置</Button>
          </div>
        </div>

        <div class="operation_btn">
          <Button type="primary" disabled>
            导出选中
          </Button>
          <Button type="primary">导出全部</Button>
        </div>
        <div class="tables">
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
            rowSelection={{
              onChange: onSelectChange,
              selectedRowKeys: selectedRow.selectedRowKeys,
            }}
          ></Table>
        </div>

        <div class="pages">
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={3}
            total={500}
          />
        </div>
      </div>
    );
  },
});
export default utils.installComponent(com, "pss-record");

