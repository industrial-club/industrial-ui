import { defineComponent, reactive, ref, watch } from "vue";
import {
  Button,
  Table,
  Modal,
  Form,
  FormItem,
  Select,
  Input,
  Row,
  Col,
  message,
} from "ant-design-vue";
import {
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import useTableList from "@/pageComponent/hooks/useTableList";

import dayjs, { Dayjs } from "dayjs";

import pssApi from "@/api/pss";

const Format = "YYYY-MM-DD HH:mm";

const typeColumns = [
  {
    label: "低压停送电",
    value: "stopSupplyPower",
  },
  {
    label: "低压停电",
    value: "stopPower",
  },
  {
    label: "低压送电",
    value: "supplyPower",
  },
];

const durationColumns = [
  {
    label: "8小时",
    value: 8,
  },
  {
    label: "12小时",
    value: 12,
  },
  {
    label: "16小时",
    value: 16,
  },
];

const reasonColumns = [
  {
    label: "检修设备",
    value: 1,
  },
  {
    label: "保养设备",
    value: 2,
  },
  {
    label: "打扫设备",
    value: 3,
  },
  {
    label: "其他",
    value: 4,
  },
];
const reasonColumns2 = ["检修设备", "保养设备", "打扫设备", "其他"];

export default defineComponent({
  emits: ["update:showCreate", "refresh"],

  props: {
    showCreate: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const state = reactive({
      type: 0, // 类型
      status: 0, // 状态
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

    const formRef = ref();

    const formState = ref({
      equment: null as any, // 申请设备ID
      loopIds: [], // 申请停送电回路ids
      bus: 0,
      // stopTime: dayjs().format(Format),
      // supplyTime: dayjs().format(Format),
      stopTime: null,
      supplyTime: null,
      duration: 8,
      cause: "检修设备",
      causetext: "",
    });

    const selectRows: any = ref([]);

    const eqModal: any = reactive({
      visible: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "column1",
          title: "设备编号/名称",
          width: "30%",
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
          width: "30%",
          ellipsis: true,
        },
        {
          dataIndex: "loop",
          title: "控制回路",
          ellipsis: true,
        },
      ],
    });

    // 添加设备
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

    // 删除设备
    const delEq = () => {
      formState.value.equment = null;
      loopList.value = [];
    };

    const onSelectEq = (val: any, selectedRows: any) => {
      console.info(val, selectedRows);
      selectRows.value = selectedRows;
    };

    const loopList: any = ref([]);
    const sureAddEq = async () => {
      if (selectRows.value.length > 0) {
        formState.value.equment = selectRows.value[0];
        const { data } = await pssApi.applyLoop(formState.value.equment.id);
        console.info(data);
        loopList.value = data;
        console.info(555, loopList.value);

        cancelAddEq();
      } else {
        message.info("请选择设备");
      }
    };

    const cancelAddEq = () => {
      eqModal.visible = false;
      selectRows.value = [];
    };

    const ok = async () => {
      await formRef.value.validateFields();

      // 计划送电时间
      let supplyTime = dayjs(formState.value.stopTime)
        .add(formState.value.duration, "h")
        .format(Format);

      const param = {
        equmentId: formState.value.equment.id, // 申请设备ID
        loopIds: formState.value.loopIds, // 申请停送电回路ids
        busId: typeColumns[formState.value.bus].value, // stopSupplyPower(低压停送电) stopPower（低压停电） supplyPower（低压送电）
        busName: typeColumns[formState.value.bus].label, // 业务名称
        reason:
          formState.value.cause !== "其他"
            ? formState.value.cause
            : formState.value.causetext, // 原因
        stopTime: formState.value.stopTime, // 计划停电时间
        supplyTime: supplyTime, // 计划送电时间
      };

      const resp: any = await pssApi.toApply(param);
      if (resp.code === "ok") {
        message.success(resp.message || "成功");

        cancelModal();

        context.emit("refresh");
      }
    };

    const cancelModal = () => {
      context.emit("update:showCreate", false);
      formRef.value.resetFields();
    };

    return () => (
      <div class="newOrder">
        <Modal
          v-model={[props.showCreate, "visible"]}
          title="新建工单"
          width="799px"
          wrapClassName="pssList_modal"
          onCancel={cancelModal}
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary" onClick={ok}>
                  保存
                </Button>
                <Button onClick={cancelModal}>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content" style="height: 400px">
            <Form
              model={formState.value}
              ref={formRef}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              labelAlign="right"
            >
              <FormItem
                label="申请类型"
                name="bus"
                rules={{
                  required: true,
                  message: "请选择",
                }}
              >
                <a-select v-model={[formState.value.bus, "value"]}>
                  {typeColumns.map((type: any, index: number) => (
                    <a-select-option key={type.value} value={index}>
                      {type.label}
                    </a-select-option>
                  ))}
                </a-select>
              </FormItem>

              <FormItem
                label="停送电设备"
                name="equment"
                rules={{
                  required: true,
                  message: "请选择",
                }}
              >
                <div>
                  {!formState.value.equment && (
                    <Button onClick={addEq}>
                      <PlusOutlined />
                      添加设备
                    </Button>
                  )}

                  {formState.value.equment && (
                    <div
                      class="flex"
                      style="justify-content: space-between;  align-items: center;"
                    >
                      <span>
                        {formState.value.equment.id}-
                        {formState.value.equment.name}
                      </span>
                      <Button type="link" onClick={delEq}>
                        <MinusOutlined />
                        删除设备
                      </Button>
                    </div>
                  )}
                </div>
              </FormItem>

              {loopList.value.length > 0 && (
                <a-form-item
                  label="控制回路"
                  name="loopIds"
                  rules={[{ required: true, message: "不能为空!" }]}
                >
                  <a-checkbox-group
                    v-model={[formState.value.loopIds, "value"]}
                    style="max-height: 110px; overflow-y: auto;"
                  >
                    <a-row>
                      {loopList.value.map((loop: any) => (
                        <a-col span="24">
                          <a-checkbox key={loop.key} value={loop.key}>
                            {loop.value}
                          </a-checkbox>
                        </a-col>
                      ))}
                    </a-row>
                  </a-checkbox-group>
                </a-form-item>
              )}

              {formState.value.bus !== 2 && (
                <a-form-item
                  label="计划停电时间"
                  name="stopTime"
                  rules={[{ required: true, message: "不能为空!" }]}
                >
                  <a-date-picker
                    show-time
                    v-model={[formState.value.stopTime, "value"]}
                    minute-step={10}
                    format={Format}
                    valueFormat={Format}
                    style="width: 100%"
                  />
                </a-form-item>
              )}
              {formState.value.bus === 0 && (
                <FormItem
                  label="申请时长"
                  name="duration"
                  rules={{
                    required: true,
                    message: "请选择",
                  }}
                >
                  <a-select
                    v-model={[formState.value.duration, "value"]}
                    options={durationColumns}
                  />
                </FormItem>
              )}
              {formState.value.bus === 1 && (
                <a-form-item
                  label="计划送电时间"
                  name="supplyTime"
                  rules={[{ required: true, message: "不能为空!" }]}
                >
                  <a-date-picker
                    show-time
                    v-model={[formState.value.supplyTime, "value"]}
                    minute-step={10}
                    format={Format}
                    valueFormat={Format}
                    style="width: 100%"
                  />
                </a-form-item>
              )}
              <a-form-item
                label="申请原因"
                name="cause"
                rules={[{ required: true, message: "不能为空!" }]}
              >
                <a-select v-model={[formState.value.cause, "value"]}>
                  {reasonColumns2.map((reason: any) => (
                    <a-select-option key={reason} value={reason}>
                      {reason}
                    </a-select-option>
                  ))}
                </a-select>
              </a-form-item>
              {formState.value.cause === "其他" && (
                <a-row class="row">
                  <a-col span="10" offset="4">
                    <a-textarea
                      v-model={[formState.value.causetext, "value"]}
                      placeholder="请输入"
                      allow-clear
                    />
                  </a-col>
                </a-row>
              )}
            </Form>
          </div>
        </Modal>

        <Modal
          v-model={[eqModal.visible, "visible"]}
          title="添加设备"
          width="799px"
          wrapClassName="pssList_modal"
          onCancel={cancelAddEq}
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary" onClick={sureAddEq}>
                  确定
                </Button>
                <Button onClick={cancelAddEq}>取消</Button>
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
              columns={eqModal.columns}
              scroll={{ y: "400px" }}
              dataSource={eqModal.dataSource}
              class="cus-table"
              rowKey={(record: any) => {
                return record.id;
              }}
              rowSelection={{
                onChange: onSelectEq,
                selectedRowKeys: selectRows.value.id,
                type: "radio",
              }}
            ></Table>
          </div>
        </Modal>
      </div>
    );
  },
});
