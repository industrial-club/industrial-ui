import { defineComponent, reactive } from 'vue';
import {
  Button,
  Table,
  Pagination,
  Modal,
  Form,
  FormItem,
  Select,
  DatePicker,
  Input,
  Row,
  Col
} from "ant-design-vue";
import {
  CaretDownOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
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
    const onSelectChange = () => {};
    const selectedRow: any = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    });
    const modal: any = reactive({
      visible: false
    });
    const eqModal: any = reactive({
      visible: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "column1",
          title: "设备编号/名称",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "设备位置",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "控制回路",
          
          align: "center",
        },
      ],
    });
    

    const addModal = () => {
      modal.visible = true;
    }
    
    return () => (
      <div class="pssList_content">
        <div class="dropSelect">
          <a-dropdown
            placement="bottomRight"
            v-slots={{
              overlay: () => <div class="menu-min flex1">33333</div>,
            }}
          >
            <div class="">
              <span>
                全部类型
                <CaretDownOutlined />
              </span>
            </div>
          </a-dropdown>
          <a-dropdown
            placement="bottomRight"
            v-slots={{
              overlay: () => <div class="menu-min flex1">33333</div>,
            }}
          >
            <div class="">
              <span>
                全部状态
                <CaretDownOutlined />
              </span>
            </div>
          </a-dropdown>
        </div>
        <div class="operation_btn">
          <Button type="primary" onClick={addModal}>
            新建工单
          </Button>
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
        <Modal
          v-model={[modal.visible, "visible"]}
          title="新建工单"
          width="799px"
          wrapClassName="pssList_modal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary" onClick={() => (modal.visible = false)}>
                  保存
                </Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
            >
              <FormItem label="申请类型">
                <Select></Select>
              </FormItem>
              <FormItem label="停送电设备">
                <Button onClick={() => (eqModal.visible = true)}>
                  <PlusOutlined />
                  添加设备
                </Button>
              </FormItem>
              <FormItem label="计划停电时间">
                <DatePicker showTime />
              </FormItem>
              <FormItem label="申请时长">
                <Select></Select>
              </FormItem>
              <FormItem label="检修设备">
                <Select></Select>
              </FormItem>
            </Form>
          </div>
        </Modal>
        <Modal
          v-model={[eqModal.visible, "visible"]}
          title="添加设备"
          width="799px"
          wrapClassName="pssList_modal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button
                  type="primary"
                  onClick={() => (eqModal.visible = false)}
                >
                  确定
                </Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <Input
              class="serach"
              prefix={<SearchOutlined />}
              placeholder="设备编号/名称"
            />
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="right"
            >
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem label="所属车间">
                    <Select></Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="所属系统">
                    <Select></Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="设备类型">
                    <Select></Select>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table
              pagination={false}
              rowKey={(record: any) => {
                if (!record.rowKey) {
                  record.rowKey = randomKey();
                }
                return record.rowKey;
              }}
              columns={eqModal.columns}
              
              scroll={{ y: "100%" }}
              dataSource={eqModal.dataSource}
              class="cus-table"
              
            ></Table>
          </div>
        </Modal>
      </div>
    );
  },
});
