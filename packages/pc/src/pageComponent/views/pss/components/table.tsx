import { defineComponent, reactive, ref, watch } from "vue";
import { Button, Modal, message } from "ant-design-vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { randomKey } from "../utils";
import useTableList from "@/pageComponent/hooks/useTableList";
import NewOrder from "@/pageComponent/views/pss/components/NewOrder";
import ApproveOpinion from "@/pageComponent/views/pss/components/ApproveOpinion";
import PerformOperation from "@/pageComponent/views/pss/components/PerformOperation";
import Info from "@/pageComponent/views/pss/components/Info";

import dayjs, { Dayjs } from "dayjs";

import pssApi from "@/api/pss";

const Format = "YYYY-MM-DD HH:mm";

export default defineComponent({
  components: {
    NewOrder,
    ApproveOpinion,
    PerformOperation,
    Info,
  },

  props: {
    tab: { type: String, default: "do" },
  },

  setup(props, context) {
    const { userId } = sessionStorage.getItem("userinfo")
      ? JSON.parse(sessionStorage.getItem("userinfo"))
      : "";

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

    // table
    const {
      currPage,
      isLoading,
      refresh,
      tableList,
      handlePageChange,
      total,
      hanldePageSizeChange,
      pageSize,
      pagination,
    } = useTableList(
      async () => {
        if (props.tab === "do") {
          const data = await getTodo();
          return { data };
        }
        if (props.tab === "done") {
          const data = await getDone();
          return { data };
        }
        if (props.tab === "self") {
          getStartByMe();
          const data = await getStartByMe();
          return { data };
        }
      },
      "list",
      "total"
    );

    // 待办
    const getTodo = async () => {
      console.info(state.typeOptions, state.type);
      const { data } = await pssApi.todoPage({
        pageDTO: {
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
        },
        busId: "spms",
        processId: (state.typeOptions[state.type] as any)?.code,
        taskDefKey: (state.statusOptions[state.status] as any)?.code,
      });

      if (state.type === 0) {
        // 筛选条件 typeOptions
        state.typeOptions = data.processIdMapCountVOs.map((vo: any) => ({
          text: `${vo.name} ${vo.count}`,
          code: vo.code,
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
            code: null,
            count: typeCount,
          });
        }

        // 筛选条件 statusOptions
        state.statusOptions = data.taskDefKeyMapCountVOs.map((vo: any) => ({
          text: `${vo.name} ${vo.count}`,
          code: vo.code,
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
            code: null,
            count: stateCount,
          });
        }
      }

      return data.pageInfo;
    };

    // 已办
    const getDone = async () => {
      const { data } = await pssApi.donePage({
        pageDTO: {
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
        },
        busId: "spms",
        processId: (state.typeOptions[state.type] as any)?.code,
        taskDefKey: (state.statusOptions[state.status] as any)?.code,
      });

      return data.pageInfo;
    };

    // 我发起的
    const getStartByMe = async () => {
      const { data } = await pssApi.startByMePage({
        pageDTO: {
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
        },
        busId: "spms",
        processId: (state.typeOptions[state.type] as any)?.code,
        taskDefKey: (state.statusOptions[state.status] as any)?.code,
      });

      return data.pageInfo;
    };

    watch(
      () => props.tab,
      async (nVal, oVal) => {
        refresh();
      },
      { deep: true, immediate: true }
    );

    watch([() => state.type], async (nVal, oVal) => {
      if (nVal[0] === 0) {
        state.status = 0;
      }
      refresh();
    });

    watch(
      () => state.status,
      async (nVal, oVal) => {
        refresh();
      }
    );

    const batch = ref(false);

    const tableConfig: any = reactive({
      dataSource: [{}],
      columns: [
        {
          dataIndex: "supplyTypeName",
          title: "申请类型",
          width: 200,
        },
        {
          dataIndex: "applyUserName",
          title: "发起人",
          width: 100,
        },
        {
          title: "当前状态",
          key: "currentState",
          width: 120,
        },
        {
          title: "设备编号/名称",
          key: "numAndName",
          width: 200,
        },
        {
          title: "回路数量",
          key: "loopsNum",
          width: 100,
        },
        {
          title: "控制回路",
          key: "loops",
          width: 300,
          ellipsis: true,
        },
        {
          dataIndex: "applyReason",
          title: "申请原因",
          width: 120,
          ellipsis: true,
        },
        {
          title: "计划停电时间",
          key: "planStopPowerDt",
          width: 150,
        },
        {
          title: "计划送电时间",
          key: "planSupplyPowerDt",
          width: 150,
        },
        {
          title: "执行操作",
          key: "operation",
          fixed: "right",
          width: 220,
        },
      ],
    });

    // 新建任务
    const showCreate = ref(false);
    const addModal = () => {
      showCreate.value = true;
    };

    const currentObj: any = ref({});

    const operationState = reactive({
      showFooter: true,
      showInfo: false,
      showPerform: false,
      showOpinion: false,
      comment: "",
      isAgree: null as any,
      label: "",
      showDetailPopup: false,
    });

    // 停电拒绝
    const toStopRefuse = (record) => {
      currentObj.value = record;

      operationState.isAgree = false;
      operationState.showOpinion = true;
      operationState.label = "拒绝审批意见";
    };
    // 停电同意
    const toStopAgree = (record) => {
      currentObj.value = record;

      operationState.isAgree = true;
      operationState.showOpinion = true;
      operationState.label = "同意审批意见";
    };
    // 执行
    const toExecute = (record) => {
      currentObj.value = record;

      operationState.showPerform = true;
    };
    // 停电试车
    const toStopTestRun = (record) => {
      currentObj.value = record;

      operationState.showOpinion = true;
      operationState.label = "停电试车备注";
    };
    // 检修
    const toRecondition = (record) => {
      currentObj.value = record;

      operationState.showOpinion = true;
      operationState.label = "停电检修备注";
    };
    // 送电拒绝
    const toSupplyRefuse = (record) => {
      currentObj.value = record;

      operationState.isAgree = false;
      operationState.showOpinion = true;
      operationState.label = "驳回审批意见";
    };
    // 送电同意
    const toSupplyAgree = (record) => {
      currentObj.value = record;

      operationState.isAgree = true;
      operationState.showOpinion = true;
      operationState.label = "同意审批意见";
    };
    // 送电试车
    const toSupplyTestRun = (record) => {
      currentObj.value = record;

      operationState.showOpinion = true;
      operationState.label = "送电试车备注";
    };

    /**
     * 按钮方法
     */
    // 停电审批、送电审批
    const processApproval = async () => {
      const resp: any = await pssApi.processApproval({
        comment: operationState.comment,
        processGateway: operationState.isAgree ? "agree" : "disagree",
        taskId: currentObj.value.taskId,
        userId,
      });

      if (resp.data === "ok") {
        message.success(resp.message || "成功");
        operationState.showOpinion = false;

        operationState.showFooter = false;
        refresh();
      }
    };

    // 批量 停电审批、送电审批
    const processApproval_Batch = async () => {
      const postData = selectedRow.selectedRows.map((item: any) => {
        const obj = {
          comment: operationState.comment,
          processGateway: operationState.isAgree ? "agree" : "disagree",
          taskId: item.taskId,
          userId,
        };
        return obj;
      });

      const resp: any = await pssApi.processApprovalBatch(postData);
      if (resp.code === "ok") {
        message.success(resp.message || "成功");
        operationState.showOpinion = false;

        cancelBatch();
        refresh();
      }
    };

    // 停电执行
    const executeStop = async () => {
      const loopIds = currentObj.value.loops.map((lo: any) => lo.id);
      const resp: any = await pssApi.executeStop({
        lockUser: userId,
        loopIds,
        loopStatus: "localBreakStopPower",
        processInstanceId: currentObj.value.processInstanceId,
        processName: currentObj.value.supplyTypeName, // 低压停送电
        taskDefKey: currentObj.value.taskDefKey, // Execute_stop
        taskId: currentObj.value.taskId,
      });

      if (resp.data === true) {
        message.success(resp.message || "成功");
        operationState.showPerform = false;

        operationState.showFooter = false;
        refresh();
      }
    };

    // 送电执行
    const executeSupply = async () => {
      const loopIds = currentObj.value.loops.map((lo: any) => lo.id);
      const resp: any = await pssApi.executeSupply({
        unLockUser: userId,
        loopIds,
        loopStatus: "localBreakStopPower",
        processInstanceId: currentObj.value.processInstanceId,
        processName: currentObj.value.supplyTypeName, // 低压停送电
        taskDefKey: currentObj.value.taskDefKey, // Execute_stop
        taskId: currentObj.value.taskId,
      });

      if (resp.data === true) {
        message.success(resp.message || "成功");
        operationState.showPerform = false;

        operationState.showFooter = false;
        refresh();
      }
    };

    // 停电试车、送电试车
    const processAttempt = async () => {
      const resp: any = await pssApi.processAttempt({
        comment: operationState.comment,
        processGateway: operationState.isAgree ? "agree" : "disagree",
        taskId: currentObj.value.taskId,
        userId,
      });

      if (resp.data === "ok") {
        message.success(resp.message || "成功");
        operationState.showOpinion = false;

        operationState.showFooter = false;
        refresh();
      }
    };

    // 停电检修
    const overhaulStop = async () => {
      const resp: any = await pssApi.processOverhaul({
        comment: operationState.comment,
        processGateway: operationState.isAgree ? "agree" : "disagree",
        taskId: currentObj.value.taskId,
        userId,
      });

      if (resp.data === "ok") {
        message.success(resp.message || "成功");
        operationState.showOpinion = false;

        operationState.showFooter = false;
        refresh();
      }
    };
    /**
     * 按钮方法
     */

    // 按钮
    const getBtn = (record: any, isInfo = false) => {
      return (
        <div class="op">
          {/* 停电审批 Approval_stop */}
          {record.taskDefKey === "Approval_stop" && !batch.value && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                class="red"
                onClick={() => {
                  toStopRefuse(record);
                }}
              >
                拒绝
              </a-button>

              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toStopAgree(record);
                }}
              >
                同意
              </a-button>
            </a-space>
          )}
          {/* 停电审批 Approval_stop */}
          {/* 停电执行 Execute_stop, 送电执行 Execute_supply */}
          {(record.taskDefKey === "Execute_stop" ||
            record.taskDefKey === "Execute_supply") && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toExecute(record);
                }}
              >
                {record.taskName}
              </a-button>
            </a-space>
          )}
          {/* 停电执行 Execute_stop, 送电执行 Execute_supply */}
          {/* 停电试车 Attempt_stop  */}
          {record.taskDefKey === "Attempt_stop" && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toStopTestRun(record);
                }}
              >
                停电试车
              </a-button>
            </a-space>
          )}
          {/* 停电试车 Attempt_stop */}
          {/* 停电检修 Overhaul_stop */}
          {record.taskDefKey === "Overhaul_stop" && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toRecondition(record);
                }}
              >
                停电检修
              </a-button>
            </a-space>
          )}
          {/* 停电检修 Overhaul_stop */}
          {/* 送电审批 Approval_supply */}
          {record.taskDefKey === "Approval_supply" && !batch.value && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                class="yellow"
                onClick={() => {
                  toSupplyRefuse(record);
                }}
              >
                驳回
              </a-button>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toSupplyAgree(record);
                }}
              >
                同意
              </a-button>
            </a-space>
          )}
          {/* 送电审批 Approval_supply */}
          {/* 送电试车 Attempt_supply */}
          {record.taskDefKey === "Attempt_supply" && (
            <a-space>
              <a-button
                type={isInfo ? "primary" : "link"}
                ghost={isInfo}
                onClick={() => {
                  toSupplyTestRun(record);
                }}
              >
                送电试车
              </a-button>
            </a-space>
          )}
          {/* 送电试车 Attempt_supply */}
        </div>
      );
    };

    const selectedRow: any = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    });
    const onSelect = (selectedRowKeys: any[], selectedRows: any) => {
      console.info(selectedRowKeys, selectedRows);
      selectedRow.selectedRowKeys = selectedRowKeys;
      selectedRow.selectedRows = selectedRows;
    };

    const cancelBatch = () => {
      batch.value = false;
      selectedRow.selectedRowKeys = [];
      selectedRow.selectedRows = [];
    };

    return () => (
      <div class="pssList_content">
        {state.typeOptions.length > 0 && state.statusOptions.length > 0 && (
          <div class="dropSelect">
            <a-dropdown
              placement="bottomRight"
              v-slots={{
                overlay: () => {
                  return (
                    <a-menu>
                      {state.typeOptions.map((option: any, index: number) => (
                        <a-menu-item
                          key={index}
                          onClick={() => {
                            state.type = index;
                          }}
                        >
                          <a href="javascript:;">{option.text}</a>
                        </a-menu-item>
                      ))}
                    </a-menu>
                  );
                },
              }}
            >
              <div class="">
                <span>
                  {(state.typeOptions[state.type] as any).text}
                  <CaretDownOutlined />
                </span>
              </div>
            </a-dropdown>

            <a-dropdown
              placement="bottomRight"
              v-slots={{
                overlay: () => {
                  return (
                    <a-menu>
                      {state.statusOptions.map((option: any, index: number) => (
                        <a-menu-item
                          key={index}
                          onClick={() => {
                            state.status = index;
                          }}
                        >
                          <a href="javascript:;">{option.text}</a>
                        </a-menu-item>
                      ))}
                    </a-menu>
                  );
                },
              }}
            >
              <div class="">
                <span>
                  {(state.statusOptions[state.status] as any).text}
                  <CaretDownOutlined />
                </span>
              </div>
            </a-dropdown>
          </div>
        )}
        <div class="operation_btn">
          <a-space>
            <Button type="primary" onClick={addModal}>
              新建任务
            </Button>
            {!batch.value && props.tab === "do" && (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  batch.value = true;
                }}
              >
                批量审批
              </Button>
            )}
          </a-space>
        </div>

        {batch.value && (
          <div class="batchLine flex-center">
            <a-space>
              <span>已勾选：{selectedRow.selectedRowKeys.length}个</span>
              <a-button
                type="primary"
                ghost
                onClick={() => {
                  if (selectedRow.selectedRowKeys.length) {
                    toStopRefuse({ taskDefKey: "batch" });
                  } else {
                    message.error("请选择");
                  }
                }}
              >
                拒绝
              </a-button>

              <a-button
                type="primary"
                ghost
                onClick={() => {
                  if (selectedRow.selectedRowKeys.length) {
                    toStopAgree({ taskDefKey: "batch" });
                  } else {
                    message.error("请选择");
                  }
                }}
              >
                同意
              </a-button>

              <a-button type="link" onClick={cancelBatch}>
                取消批量审批
              </a-button>
            </a-space>
          </div>
        )}

        <div class="table">
          <a-table
            scroll={{ x: 1300 }}
            dataSource={tableList.value}
            columns={tableConfig.columns}
            pagination={pagination}
            loading={isLoading.value}
            rowKey={(record: any) => {
              return record.processInstanceId;
            }}
            rowSelection={
              batch.value
                ? {
                    onChange: onSelect,
                    selectedRowKeys: selectedRow.selectedRowKeys,
                  }
                : null
            }
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                // console.info(text, column, record, index);
                if (column.key === "currentState") {
                  return (
                    <span class="stateNode">
                      待{record.taskName || record.applyReason}
                    </span>
                  );
                }

                // 设备编号/名称"
                if (column.key === "numAndName") {
                  return (
                    <span>
                      {record.equipId}-{record.equipName}
                    </span>
                  );
                }

                // 回路数量
                if (column.key === "loopsNum") {
                  return <span>{record.loops.length}个</span>;
                }

                // 控制回路
                if (column.key === "loops") {
                  const result = record.loops
                    .map((loop: any) => {
                      return `${loop.id}-${loop.name}`;
                    })
                    .join("；");

                  return (
                    <a-tooltip
                      v-slots={{
                        title: () => result,
                      }}
                    >
                      {result}
                    </a-tooltip>
                  );
                }

                // 计划停电时间
                if (column.key === "planStopPowerDt") {
                  return (
                    <span>{dayjs(record.planStopPowerDt).format(Format)}</span>
                  );
                }

                // 计划送电时间
                if (column.key === "planSupplyPowerDt") {
                  return (
                    <span>
                      {dayjs(record.planSupplyPowerDt).format(Format)}
                    </span>
                  );
                }

                // 操作
                if (column.key === "operation") {
                  return (
                    <div class="operation">
                      {getBtn(record)}

                      <a-button
                        type="link"
                        onClick={() => {
                          currentObj.value = record;
                          operationState.showFooter = true;
                          operationState.showInfo = true;
                        }}
                      >
                        详情
                      </a-button>
                    </div>
                  );
                }
              },
            }}
          ></a-table>
        </div>

        {/* 新建任务 */}
        <NewOrder
          v-model={[showCreate.value, "showCreate"]}
          onRefresh={refresh}
        />

        {/* 停电审批 Approval_stop、送电审批 Approval_supply */}
        {/* 停电试车 Attempt_stop、停电检修 Overhaul_stop、送电试车 Attempt_supply */}
        <ApproveOpinion
          onToProcessApproval={processApproval}
          onToProcessAttempt={processAttempt}
          onToOverhaulStop={overhaulStop}
          onToProcessApproval_Batch={processApproval_Batch}
          detail={currentObj.value}
          isAgree={operationState.isAgree}
          label={operationState.label}
          v-models={[
            [operationState.showOpinion, "showOpinion"],
            [operationState.comment, "comment"],
          ]}
        ></ApproveOpinion>

        {/* 停电执行 Execute_stop, 送电执行 Execute_supply */}
        <PerformOperation
          detail={currentObj.value}
          onToExecuteStop={executeStop}
          onToExecuteSupply={executeSupply}
          v-model={[operationState.showPerform, "showPerform"]}
        ></PerformOperation>

        {/* 详情 */}
        <Info
          v-model={[operationState.showInfo, "showInfo"]}
          btn={getBtn(currentObj.value, true)}
          showFooter={operationState.showFooter}
          detail={currentObj.value}
          tab={props.tab}
        ></Info>
      </div>
    );
  },
});
