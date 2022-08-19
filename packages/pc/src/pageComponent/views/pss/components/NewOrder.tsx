import { defineComponent, reactive, ref, watch, nextTick } from "vue";
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
  MinusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import { cloneDeep } from "lodash";

import dayjs, { Dayjs } from "dayjs";

import pssApi from "@/api/pss";

const Format = "YYYY-MM-DD HH:mm";

const typeColumns = [
  {
    label: "低压停送电",
    value: "stopSupplyPower",
  },
  // {
  //   label: "低压停电",
  //   value: "stopPower",
  // },
  // {
  //   label: "低压送电",
  //   value: "supplyPower",
  // },
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
      bus: 0,
      deviceList: [] as any, // 设备列表
      stopTime: dayjs().format(Format),
      supplyTime: dayjs().format(Format),
      // stopTime: null,
      // supplyTime: null,
      duration: 8,
      cause: "检修设备",
      causetext: "",
    });

    const selectRows: any = ref([]);
    const selectedList: any = ref([]);

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

        selectRows.value = [];
        selectedList.value = [];
        eqModal.visible = true;
      } catch (error) {
        console.log(error);
      }
    };

    const onSelectEq = (selectedRowKeys: any, selectedRows: any) => {
      // console.log(selectedRowKeys, selectedRows);
      selectRows.value = selectedRowKeys;
      selectedList.value = selectedRows;
    };

    const sureAddEq = async () => {
      if (selectedList.value.length > 0) {
        const old = cloneDeep(formState.value.deviceList);
        formState.value.deviceList = [];

        nextTick(() => {
          formState.value.deviceList = [...old, ...selectedList.value];
          formState.value.deviceList.forEach(async (device: any) => {
            const { data } = await pssApi.applyLoop(device.id);
            device.equmentId = device.id;
            device.list = data;
          });
        });

        cancelAddEq();
      } else {
        message.info("请选择设备");
      }
    };

    const cancelAddEq = () => {
      eqModal.visible = false;
    };

    const ok = async () => {
      await formRef.value.validateFields();

      // 计划送电时间
      let supplyTime = dayjs(formState.value.stopTime)
        .add(formState.value.duration, "h")
        .format(Format);

      const param = {
        equments: formState.value.deviceList, // 设备信息
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

    watch(
      () => props.showCreate,
      (val) => {
        if (val) {
          formState.value.stopTime = dayjs().format(Format);
          formState.value.supplyTime = dayjs().format(Format);
        }
      }
    );

    const cancelModal = () => {
      context.emit("update:showCreate", false);
      nextTick(() => {
        formRef.value.resetFields();
        formState.value.deviceList = [];
      });
    };

    return () => (
      <div class="newOrder">
        <Modal
          visible={props.showCreate}
          title="新建工单"
          width="850px"
          wrapClassName="newOrder_modal"
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
          <div class="modal_content">
            <Form
              model={formState.value}
              ref={formRef}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 24 }}
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
                <a-select
                  v-model={[formState.value.bus, "value"]}
                  style="width: 200px"
                >
                  {typeColumns.map((type: any, index: number) => (
                    <a-select-option key={type.value} value={index}>
                      {type.label}
                    </a-select-option>
                  ))}
                </a-select>
              </FormItem>

              <FormItem
                label="停送电设备"
                name="deviceList"
                rules={{
                  required: true,
                  message: "请选择",
                }}
              >
                <div class="content flex">
                  <div class="line flex-center">
                    <Button onClick={addEq}>
                      <PlusOutlined />
                      添加设备
                    </Button>

                    <div class="all">
                      已选：
                      <span class="num">
                        {formState.value.deviceList.length}
                      </span>
                      台设备
                    </div>
                  </div>

                  {formState.value.deviceList.length > 0 && (
                    <div class="deviceBox">
                      {formState.value.deviceList.map(
                        (device: any, index: number) => (
                          <div class="device" key={device.id}>
                            <div class="titleLine flex-center">
                              <span class="title">
                                {device.id}-{device.name}
                              </span>

                              <Button
                                type="link"
                                onClick={() => {
                                  formState.value.deviceList.splice(index, 1);
                                }}
                              >
                                <MinusSquareOutlined />
                              </Button>
                            </div>

                            <div class="loop">
                              <FormItem
                                name={["deviceList", index, "loopIds"]}
                                rules={{
                                  required: true,
                                  message: "请选择",
                                }}
                              >
                                <a-checkbox-group
                                  v-model={[device.loopIds, "value"]}
                                  style="width: 100%; max-height: 110px; overflow-y: auto;"
                                >
                                  <a-row>
                                    <a-col span="3">
                                      <div class="title">控制回路</div>
                                    </a-col>
                                    {device?.list?.map(
                                      (loop: any, idx: number) => (
                                        <a-col span="7">
                                          <a-checkbox
                                            key={loop.key}
                                            value={loop.key}
                                          >
                                            {loop.key}-{loop.value}
                                          </a-checkbox>
                                        </a-col>
                                      )
                                    )}
                                  </a-row>
                                </a-checkbox-group>
                              </FormItem>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </FormItem>

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
                    style="width: 200px"
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
                    style="width: 200px"
                  />
                </FormItem>
              )}
              {formState.value.bus === 2 && (
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
                    style="width: 200px"
                  />
                </a-form-item>
              )}
              <a-form-item
                label="申请原因"
                name="cause"
                rules={[{ required: true, message: "不能为空!" }]}
              >
                <a-select
                  v-model={[formState.value.cause, "value"]}
                  style="width: 200px"
                >
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
                    <a-form-item
                      label=""
                      name="causetext"
                      rules={[{ required: true, message: "不能为空!" }]}
                    >
                      <a-textarea
                        v-model={[formState.value.causetext, "value"]}
                        placeholder="请输入"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              )}
            </Form>
          </div>
        </Modal>

        <Modal
          v-model={[eqModal.visible, "visible"]}
          title="添加设备"
          width="1200px"
          wrapClassName="newOrder_device_modal"
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
          <div class="modal_content flex" style="max-height: 500px;">
            <div class="left">
              <Input
                class="serach"
                prefix={<SearchOutlined />}
                placeholder="设备编号/名称"
                style="margin-bottom: 24px; width: 200px"
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
                scroll={{ y: "340px" }}
                dataSource={eqModal.dataSource}
                class="cus-table"
                rowKey={(record: any) => {
                  return record.id;
                }}
                rowSelection={{
                  onChange: onSelectEq,
                  selectedRowKeys: selectRows.value,
                  type: "checkbox",
                  getCheckboxProps: (record: any) => {
                    const oldDeviceIdList = formState.value.deviceList.map(
                      (device: any) => device.id
                    );

                    return {
                      disabled: oldDeviceIdList.includes(record.id),
                      name: record.name,
                    };
                  },
                }}
              ></Table>
            </div>

            <div class="right flex">
              <div class="top flex-center">
                <div>已选{selectedList.value.length}台设备</div>
                <a-button
                  type="link"
                  onClick={() => {
                    selectRows.value = [];
                    selectedList.value = [];
                  }}
                >
                  清空
                </a-button>
              </div>

              <div class="activedBox">
                {selectedList.value.map((selected: any, idx: number) => {
                  const name = `${selected.id}-${selected.name}`;
                  const textLength = 10;
                  const title = name.length > textLength ? name : "";
                  return (
                    <a-tag
                      class="tag"
                      title={title}
                      key={selected.id}
                      closable
                      onClose={() => {
                        const index = selectedList.value.findIndex(
                          (item: any) => item.id === selected.id
                        );
                        selectRows.value.splice(index, 1);

                        selectedList.value.splice(idx, 1);
                      }}
                    >
                      {name.length > textLength
                        ? `${name.slice(0, textLength)}...`
                        : name}
                    </a-tag>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
});
