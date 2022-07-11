import { defineComponent, reactive, ref, watch } from "vue";
import {
  Button,
  Table,
  Pagination,
  Modal,
  Form,
  FormItem,
  Select,
  SelectOption,
  DatePicker,
  Input,
  Row,
  Col,
} from "ant-design-vue";
import {
  CaretDownOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { randomKey } from "../utils";
import useTableList from "@/pageComponent/hooks/useTableList";

import pssApi from "@/api/pss";

export default defineComponent({
  props: {
    type: { type: String, default: "do" },
  },

  setup(props, context) {
    // 列表
    const list = ref([]);

    const state = reactive({
      typeOptions: [
        // { text: '全部类型', value: 0 },
        // { text: '低压停送电', value: 1 },
        // { text: '低压送电', value: 2 },
      ],
      statusOptions: [
        // { text: '全部状态', value: 'a' },
        // { text: '停电审批', value: 'b' },
        // { text: '停电执行', value: 'c' },
      ],
    });

    // // table
    // const {
    //   currPage,
    //   isLoading,
    //   refresh,
    //   tableList,
    //   handlePageChange,
    //   total,
    //   hanldePageSizeChange,
    //   pageSize,
    //   pagination,
    // } = useTableList(
    //   async () => {
    //     if (props.type === "do") {
    //       getTodo();
    //     }
    //     if (props.type === "done") {
    //       getDone();
    //     }
    //     if (props.type === "self") {
    //       getStartByMe();
    //     }
    //   },
    //   "list",
    //   "total"
    // );

    // 待办
    const getTodo = async () => {
      const { data } = await pssApi.todoPage({
        pageDTO: {
          pageNo: 1,
          pageSize: 9999999,
        },
        busId: "spms",
        processId: null,
        taskDefKey: null,
      });

      list.value = data.pageInfo?.list;

      // 筛选条件 typeOptions
      state.typeOptions = data.processIdMapCountVOs.map((vo: any) => ({
        text: `${vo.name} ${vo.count}`,
        value: vo.code,
        count: vo.count,
      }));

      if (data.processIdMapCountVOs.length > 0) {
        const typeCount =
          data.processIdMapCountVOs.length === 1
            ? data.processIdMapCountVOs[0].count
            : data.processIdMapCountVOs.reduce((prev: any, curr: any) => {
                return prev.count + curr.count;
              });

        state.typeOptions.unshift({
          text: `全部类型 ${typeCount}`,
          value: "all",
          count: typeCount,
        });
      }

      // 筛选条件 statusOptions
      state.statusOptions = data.taskDefKeyMapCountVOs.map((vo: any) => ({
        text: `${vo.name} ${vo.count}`,
        value: vo.code,
        count: vo.count,
      }));

      if (data.taskDefKeyMapCountVOs.length) {
        const stateCount =
          data.taskDefKeyMapCountVOs.length === 1
            ? data.taskDefKeyMapCountVOs[0].count
            : data.taskDefKeyMapCountVOs.reduce((prev: any, curr: any) => {
                return prev.count + curr.count;
              });

        state.statusOptions.unshift({
          text: `全部状态 ${stateCount}`,
          value: "all",
          count: stateCount,
        });
      }

      return data.pageInfo;
    };

    // 已办
    const getDone = async () => {
      const { data } = await pssApi.donePage({
        pageDTO: {
          pageNo: 1,
          pageSize: 9999999,
        },
        busId: "spms",
        processId: null,
        taskDefKey: null,
      });

      list.value = data.pageInfo?.list;

      return data.pageInfo;
    };

    // 我发起的
    const getStartByMe = async () => {
      const { data } = await pssApi.startByMePage({
        pageDTO: {
          pageNo: 1,
          pageSize: 9999999,
        },
        busId: "spms",
        processId: null,
        taskDefKey: null,
      });

      list.value = data.pageInfo?.list;

      return data.pageInfo;
    };

    watch(
      () => props.type,
      async (nVal, oVal) => {
        console.info(1231, nVal);
        if (nVal === "do") {
          getTodo();
        }
        if (nVal === "done") {
          getDone();
        }
        if (nVal === "self") {
          getStartByMe();
        }
      },
      { deep: true, immediate: true }
    );

    const tableConfig: any = reactive({
      loading: false,
      dataSource: [{}],
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
      visible: false,
      formData: {
        busId: "",
      },
    });
    const selectRows: any = ref([]);
    const eqModal: any = reactive({
      visible: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "column1",
          title: "设备编号/名称",
          width: "15%",
          align: "center",
          customRender: (rowCell: any) => {
            const { record } = rowCell;
            const { id, name } = record;
            return (
              <div>
                {id}-{name}
              </div>
            );
          },
        },
        {
          dataIndex: "location",
          title: "设备位置",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "loop",
          title: "控制回路",
          align: "center",
        },
      ],
    });

    const addModal = () => {
      modal.visible = true;
    };

    const addEq = async () => {
      try {
        const res: any = await pssApi.getDeviceList();
        eqModal.dataSource = res.data.map((item: any) => {
          item.loop = item.loops.join(",");
          return item;
        });
        eqModal.visible = true;
        console.log(eqModal, "location");
      } catch (error) {
        console.log(error);
      }
    };

    const onSelectEq = (val: any) => {
      debugger;
      selectRows.value = val;
    };

    const sureAddEq = async () => {
      console.log(selectRows.value, "2222");
      if (selectRows.value.length > 0) {
        const postList: Promise<any>[] = [];
        selectRows.value.forEach((item: any) => {
          postList.push(pssApi.getloopByEq(item));
        });
        const resList = await Promise.all(postList);
        console.log(resList, "9090");
      }

      // eqModal.visible = false;
    };

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
        {/* <div class="pages">
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={3}
            total={500}
          />
        </div> */}
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
                <Select>
                  <SelectOption value="stopSupplyPower">
                    低压停送电
                  </SelectOption>
                  <SelectOption value="stopPower">低压停电</SelectOption>
                  <SelectOption value="supplyPower">低压送电</SelectOption>
                </Select>
              </FormItem>
              <FormItem label="停送电设备">
                <Button
                  onClick={() => {
                    addEq();
                  }}
                >
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
                  onClick={() => {
                    sureAddEq();
                  }}
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
              style="margin-bottom: 24px; width: 307px"
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
                return record.id;
              }}
              columns={eqModal.columns}
              scroll={{ y: "400px" }}
              dataSource={eqModal.dataSource}
              class="cus-table"
              rowSelection={{
                onChange: onSelectEq,
                selectedRowKeys: selectRows.value,
              }}
            ></Table>
          </div>
        </Modal>
      </div>
    );
  },
});
