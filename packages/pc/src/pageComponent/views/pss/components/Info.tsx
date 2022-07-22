import {
  defineComponent,
  onMounted,
  nextTick,
  ref,
  shallowRef,
  reactive,
  watch,
} from "vue";
import {
  Button,
  Row,
  Col,
  Table,
  Timeline,
  TimelineItem,
  Modal,
  Input,
} from "ant-design-vue";
const { TextArea } = Input;
import { CheckOutlined } from "@ant-design/icons-vue";

import dayjs, { Dayjs } from "dayjs";

import pssApi from "@/api/pss";

const Format = "YYYY-MM-DD HH:mm";

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    showInfo: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    btn: {
      type: Object,
      default: () => {},
    },
    tab: { type: String, default: "do" }, // 代办 do 、已办 done 、我发起的 self
  },

  emits: ["update:showInfo"],

  setup(props, context) {
    const { corpId } = sessionStorage.getItem("userinfo")
      ? JSON.parse(sessionStorage.getItem("userinfo"))
      : "";

    const dataObj: any = ref({});

    // 待办
    const getTodo = async () => {
      const { data } = await pssApi.todoDetail({
        id: props.detail.taskId,
        name: props.detail.taskName,
        processInstanceId: props.detail.processInstanceId,
        taskDefinitionKey: props.detail.taskDefKey,
        taskFlag: props.detail.taskFlag,
        taskStatus: props.detail.taskStatus,
        properties: {
          startTime: props.detail.applyDt,
          stopTime: props.detail.planStopPowerDt,
          supplyTime: props.detail.planSupplyPowerDt,
          applyuserId: props.detail.applyUserId,
          equipmentId: props.detail.equipId,
          loopIds: props.detail.loops.map((lo: any) => lo.id),
          busId: "spms",
          processId: props.detail.supplyTypeCode,
          processName: props.detail.supplyTypeName,
          corpId,
          reason: props.detail.applyReason,
        },
      });

      dataObj.value = data;
    };

    // 已办
    const getDone = async () => {
      const { data } = await pssApi.doneDetail({
        id: props.detail.taskId,
        name: props.detail.taskName,
        processInstanceId: props.detail.processInstanceId,
        taskDefinitionKey: props.detail.taskDefKey,
        taskFlag: props.detail.taskFlag,
        taskStatus: props.detail.taskStatus,
        properties: {
          startTime: props.detail.applyDt,
          stopTime: props.detail.planStopPowerDt,
          supplyTime: props.detail.planSupplyPowerDt,
          applyuserId: props.detail.applyUserId,
          equipmentId: props.detail.equipId,
          loopIds: props.detail.loops.map((lo: any) => lo.id),
          busId: "spms",
          processId: props.detail.supplyTypeCode,
          processName: props.detail.supplyTypeName,
          corpId,
          reason: props.detail.applyReason,
        },
      });

      dataObj.value = data;
    };

    // 我发起的
    const getStartByMe = async () => {
      const { data } = await pssApi.startByMeDetail({
        id: props.detail.taskId,
        name: props.detail.taskName,
        processInstanceId: props.detail.processInstanceId,
        taskDefinitionKey: props.detail.taskDefKey,
        taskFlag: props.detail.taskFlag,
        taskStatus: props.detail.taskStatus,
        properties: {
          startTime: props.detail.applyDt,
          stopTime: props.detail.planStopPowerDt,
          supplyTime: props.detail.planSupplyPowerDt,
          applyuserId: props.detail.applyUserId,
          equipmentId: props.detail.equipId,
          loopIds: props.detail.loops.map((lo: any) => lo.id),
          busId: "spms",
          processId: props.detail.supplyTypeCode,
          processName: props.detail.supplyTypeName,
          corpId,
          reason: props.detail.applyReason,
        },
      });

      dataObj.value = data;
    };

    // 查询回路挂锁列表
    const getLockLoop = () => {
      dataObj.value.loopVOs.forEach(async (loopVo: any) => {
        if (loopVo.loop.id) {
          const { data } = await pssApi.findlockLoop(loopVo.loop.id);
          loopVo.loop.list = data;
        }
      });
    };

    const getData = async () => {
      if (props.tab === "do") {
        // 待办
        await getTodo();
      } else if (props.tab === "done") {
        // 已办
        await getDone();
      } else if (props.tab === "self") {
        // 我发起的
        await getStartByMe();
      }

      getLockLoop();
    };

    watch(
      () => props.showInfo,
      (nval, oval) => {
        if (nval) {
          getData();
        }
      }
    );

    const modal: any = reactive({
      visible: false,
      title: "审批意见",
    });

    const transModal: any = reactive({
      visible: false,
    });

    const commonTable: any = reactive({
      columns: [
        {
          title: "序号",
          width: "15%",
          key: "num",
        },
        {
          dataIndex: "applyUser",
          title: "申请人",
          width: "15%",
        },
        {
          title: "挂锁",
          width: "15%",
          key: "lock",
        },
        {
          dataIndex: "operationUser",
          title: "当前操作人",
          width: "15%",
          align: "center",
        },
        {
          title: "当前状态",
          width: "15%",
          key: "state",
        },
      ],
    });

    const close = () => {
      context.emit("update:showInfo", false);
    };

    return () => (
      <div class="pssInfo">
        <a-modal
          v-model={[props.showInfo, "visible"]}
          title="任务/任务详情"
          wrapClassName="pssInfoModal"
          maskStyle={{ position: "absolute" }}
          getContainer={() => document.getElementById("pssList")}
          onCancel={close}
          v-slots={{
            footer: () => {
              return props.tab === "do" && props.showFooter ? (
                <div class="info_footer">
                  {/* <Button onClick={() => (modal.visible = true)}>转交</Button>
                  <Button danger>拒绝</Button>
                  <Button type="primary" ghost>
                    同意
                  </Button>
                  <a-button onClick={close}>取消</a-button> */}

                  {props.btn}
                </div>
              ) : (
                ""
              );
            },
          }}
        >
          <div class="info_container">
            <div class="content">
              <div class="content_title">
                申请{dataObj.value.supplyTypeName}
                <span>{dataObj.value.applyUserName}</span>
                <span>创建于{dayjs(dataObj.value.applyDt).format(Format)}</span>
              </div>
              <div class="content_info">
                <Row gutter={24}>
                  <Col span={8}>
                    <div class="label">当前状态:</div>
                    {dataObj.value.taskStatus && (
                      <div class={["stateNode", dataObj.value.taskFlag]}>
                        {dataObj.value.taskStatus}
                      </div>
                    )}
                  </Col>
                  <Col span={8}>
                    <div class="label">设备名称:</div>
                    <div class="value">{dataObj.value.equipName}</div>
                  </Col>
                  <Col span={8}>
                    {dataObj.value.supplyTypeCode !== "supplyPower" &&
                      dataObj.value.planStopPowerDt && (
                        <>
                          <div class="label">计划停电时间:</div>
                          <div class="value">
                            {dayjs(dataObj.value.planStopPowerDt).format(
                              Format
                            )}
                          </div>
                        </>
                      )}
                  </Col>
                  <Col span={8}>
                    <div class="label">任务编号:</div>
                    <div class="value">{dataObj.value.processInstanceId}</div>
                  </Col>
                  <Col span={8}>
                    <div class="label">停电原因:</div>
                    <div class="value"> {dataObj.value.applyReason}</div>
                  </Col>

                  <Col span={8}>
                    {dataObj.value.supplyTypeCode !== "stopPower" &&
                      dataObj.value.planSupplyPowerDt && (
                        <>
                          <div class="label">计划送电时间:</div>
                          <div class="value">
                            {dayjs(dataObj.value.planSupplyPowerDt).format(
                              Format
                            )}
                          </div>
                        </>
                      )}
                  </Col>
                </Row>
              </div>
              <div class="content_title" style="margin-top: 24px">
                控制回路 ({dataObj.value?.loopVOs?.length})
              </div>
              {dataObj.value?.loopVOs?.map((loopVo: any, index: number) => (
                <div class="loop" key={index}>
                  <div class="every">
                    <div class="every_title">{loopVo.loop.name}</div>
                    <div class="every_spa">位置：</div>
                    <div class="state flex">
                      <div class="every_state">
                        <div class="flex-center">
                          <div
                            class={[
                              "point ",
                              loopVo.loop.loopStatusPO.code === "0" && "gray",
                              loopVo.loop.loopStatusPO.code === "1" && "red",
                              (loopVo.loop.loopStatusPO.code === "2" ||
                                loopVo.loop.loopStatusPO.code === "3") &&
                                "green",
                            ]}
                          ></div>
                          <div class="value">
                            {loopVo.loop.loopStatusPO.name}
                          </div>
                        </div>

                        <div class="flex-center">
                          <img
                            src={
                              loopVo.locks.length === 0
                                ? "/micro-assets/inl/pss/rlock.png"
                                : "/micro-assets/inl/pss/glock.png"
                            }
                            alt="锁"
                          />
                          <div class="num">{loopVo.locks.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="cus-table">
                    <Table
                      pagination={false}
                      columns={commonTable.columns}
                      loading={false}
                      scroll={{ y: "100%" }}
                      dataSource={loopVo.loop.list}
                      style="width: 100%"
                      v-slots={{
                        bodyCell: ({ column, record, index }: any) => {
                          // console.info(text, column, record, index);
                          if (column.key === "num") {
                            return index + 1;
                          }

                          if (column.key === "lock") {
                            return (
                              <img
                                src="/micro-assets/inl/pss/glock.png"
                                alt="锁"
                              />
                            );
                          }

                          if (column.key === "state") {
                            return (
                              <span class="stateNode">{record.taskStatus}</span>
                            );
                          }
                        },
                      }}
                    ></Table>
                  </div>
                </div>
              ))}

              <div class="content_title">工单流程</div>
              <div class="timeLine">
                <Timeline>
                  {dataObj.value?.process?.map((pro: any, index: number) => (
                    <TimelineItem
                      dot={
                        dataObj.value?.process?.length - 1 === index ? (
                          <div class="complate">
                            <CheckOutlined />
                          </div>
                        ) : (
                          <div class="active">
                            <span></span>
                          </div>
                        )
                      }
                    >
                      <div class="content flex">
                        <div
                          class={[
                            "label",
                            dataObj.value?.process?.length - 1 === index
                              ? "timeLineActive"
                              : "",
                          ]}
                        >
                          <div>{pro.activityName}</div>
                          <div>{pro.assigneeName || "-"}</div>
                          <div>{pro.comments}</div>
                        </div>
                        <div class="time">
                          {pro.endTime && dayjs(pro.endTime).format(Format)}
                        </div>
                      </div>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </div>
          </div>
        </a-modal>

        <Modal
          v-model={[modal.visible, "visible"]}
          title={modal.title}
          width="480px"
          wrapClassName="pssInfo_modal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary">保存</Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <div class="title">同意审批意见</div>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              bordered={false}
              showCount
              maxlength={100}
              placeholder="请填写"
            />
          </div>
          <div class="transfer">
            <div class="title">
              <span>
                <img src="/micro-assets/inl/pss/required.png" />
              </span>
              转交人
            </div>
            <div class="choosePeople">
              <div class="addBtn" onClick={() => (transModal.visible = true)}>
                <img src="/micro-assets/inl/pss/addBtn.png" />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          v-model={[transModal.visible, "visible"]}
          title="选择转交人"
          width="480px"
          wrapClassName="pssInfo_transModal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary">确认转交人</Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <Input placeholder="搜索人" class="searchInput" />
            <div class="choosePeople">
              <div class="row">
                <div class="avater"></div>
                <div class="label">万亿</div>
                <div class="choosen">sjsjs</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
});
