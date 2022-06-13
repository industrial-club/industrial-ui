import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import dayjs from "dayjs";
import moment from "moment";
import eventApi from "@/api/event";
import { timestampToTime } from "../utils";
import "../assets/styles/video/event.less";
import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const data = reactive<{
      cameraTreeData: any;
      pagination: {
        name: string;
        ip: string;
        algoTypeCode: string;
        algoTypeName: string;
        eventTypeCode: string;
        eventTypeName: string;
        pageNum: number;
        pageSize: number;
        current: number;
        total: number;
        startTime: number;
        endTime: number;
        time: any;
      };
      dataSource: Array<any>;
      columns: any;
      param: any;
      rules: any;
      dialog: boolean;
      showDialog: boolean;
      algoPoList: Array<any>;
      algorithmTypeList: Array<any>;
      eventTypeList: Array<any>;
      alarmType: any;
    }>({
      cameraTreeData: [],
      pagination: {
        name: "",
        ip: "",
        algoTypeCode: "",
        algoTypeName: "",
        eventTypeCode: "",
        eventTypeName: "",
        pageNum: 1,
        pageSize: 8,
        current: 1,
        total: 0,
        startTime: dayjs(new Date()).subtract(1, "week").valueOf(),
        endTime: dayjs(new Date()).valueOf(),
        time: [
          dayjs(new Date()).subtract(1, "week").format("YYYY-MM-DD"),
          dayjs(new Date()).format("YYYY-MM-DD"),
        ],
      },
      dataSource: [],
      columns: [
        {
          title: "时间",
          dataIndex: "createDt",
          align: "left",
        },
        {
          title: "事件源",
          dataIndex: "source",
          align: "left",
        },
        {
          title: "事件类型",
          dataIndex: "eventTypeName",
          align: "left",
        },
        {
          title: "算法类型",
          dataIndex: "algoTypeName",
          align: "left",
        },
        {
          title: "相机名称",
          dataIndex: "name",
          align: "left",
        },
        {
          title: "相机IP",
          dataIndex: "ip",
          align: "left",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          align: "left",
        },
      ],
      param: {
        id: "", // id为空格则为新增,不为空是修改
        name: "",
        eventType: "",
        algoType: "", // 算法类型code
        source: "", // 事件来源
        cameraUuid: "", // 相机uuid
        body: "", // 其他数据  以json形式存储
        cameraIp: "",
        remark: "",
        data: null,
      },
      rules: {
        eventTypeCode: [{ required: true, message: "此项必填" }],
        algoTypeCode: [{ required: true, message: "此项必填" }],
        cameraUuid: [{ required: true, message: "此项必填" }],
        data: [{ required: true, message: "此项必填" }],
      },
      alarmType: [
        { label: "消警", value: 0 },
        { label: "预警", value: 1 },
        { label: "报警", value: 2 },
      ],
      dialog: false,
      showDialog: false,
      algoPoList: [],
      eventTypeList: [],
      algorithmTypeList: [],
    });
    const createTime = ref(dayjs());
    const time = ref<any>([
      dayjs(new Date()).subtract(1, "week").format("YYYY-MM-DD"),
      dayjs(new Date()).format("YYYY-MM-DD"),
    ]);
    // 表格数据
    const getData = async () => {
      data.pagination.pageNum = data.pagination.current;
      const res = await eventApi.getEventData({ ...data.pagination, id: "" });
      res.data.list.forEach(async (item: any) => {
        item.createDt = timestampToTime(item.createDt);
      });
      data.pagination.total = res.data.total;
      data.dataSource = res.data.list;
    };
    const getList = async () => {
      // 算法类型
      const res = await eventApi.getAlgorithmTypeList();
      const resq = await eventApi.getEventTypeList();
      data.algoPoList = res.data;
      data.eventTypeList = resq.data;
    };
    onMounted(async () => {
      await getData();
      getList();
    });

    const pageChange = (page: any) => {
      data.pagination = { ...data.pagination, ...page };
      getData();
    };
    const getName = async (uuid: string) => {
      const res = await eventApi.getByUuid(uuid);
      const label = `${res.data.name}(${res.data.ip})`;
      if (label) data.cameraTreeData.push({ value: uuid, label });
    };
    const getCameraGroup = async () => {
      const res = await eventApi.cameraList();
      data.cameraTreeData = [];
      res.data.list.forEach((item: any) => {
        getName(item.uuid);
      });
    };
    // 新建事件-编辑
    const open = async (obj?: any) => {
      if (!obj) {
        data.param = {
          id: "",
          create_dt: dayjs(),
          name: "",
          eventType: "",
          algoType: "", // 算法类型code
          source: "",
          cameraIp: "",
          cameraUuid: "",
          remark: "",
          data: null,
          body: "",
        };
        getCameraGroup();
      } else {
        // const res = await eventApi.getEventData({
        //   ...data.pagination,
        //   id: data.param.id,
        // });
        // debugger;
        // [data.param] = res.data.list;
        data.param = obj;
        data.param.cameraIp = data.param.ip;
        data.param.eventType = data.param.eventTypeName
          ? `${data.param.eventTypeName}(${data.param.eventTypeCode})`
          : data.param.eventTypeCode;
        data.param.algoType = data.param.algoTypeName
          ? `${data.param.algoTypeName}(${data.param.algoTypeCode})`
          : data.param.algoTypeCode;
      }
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <div
                class="text"
                onClick={() => {
                  data.param.id = param.record.id;
                  data.showDialog = true;
                  open(param.record);
                }}
              >
                详情
              </div>
            </div>
          );
        }
        return true;
      };
      return obj;
    };
    const formRef = ref();

    // 保存
    const handleSave = async () => {
      formRef.value
        .validate()
        .then(async () => {
          await eventApi.saveEventData(data.param, createTime.value);
          getData();
          data.dialog = false;
          formRef.value.resetFields();
        })
        .catch((error: any) => {});
    };
    const getEventTypeByName = async (val: any) => {
      const res = await eventApi.getEventTypeListPage({
        pageNum: 1,
        pageSize: 999,
        name: val,
        code: "",
      });
      if (res.data.list.length) {
        data.eventTypeList = res.data.list;
      }
    };
    const getAlgoTypeByCode = async () => {
      const res = await eventApi.getEventAlgoTypeByCode(
        data.param.eventTypeCode
      );
      data.algoPoList = res.data.algoPoList;
    };
    const timeChange = (e: any) => {
      if (e) {
        data.pagination.startTime = moment(e[0]).startOf("day").valueOf();
        data.pagination.endTime = moment(e[1]).endOf("day").valueOf();
      } else {
        data.pagination.startTime = 0;
        data.pagination.endTime = 0;
      }
    };
    const reset = () => {
      data.pagination = {
        name: "",
        ip: "",
        algoTypeCode: "",
        algoTypeName: "",
        eventTypeCode: "",
        eventTypeName: "",
        pageNum: 1,
        pageSize: 8,
        current: 1,
        total: 0,
        startTime: dayjs(new Date()).subtract(1, "week").valueOf(),
        endTime: dayjs(new Date()).valueOf(),
        time: [
          dayjs(new Date()).subtract(1, "week").format("YYYY-MM-DD"),
          dayjs(new Date()).format("YYYY-MM-DD"),
        ],
      };
    };
    watch(
      () => data.dialog,
      async () => {
        if (data.dialog) {
          const res = await eventApi.getAlgorithmTypeList();
          data.algorithmTypeList = res.data;
          const resq = await eventApi.getEventTypeList(data.pagination);
          data.eventTypeList = resq.data;
          if (data.param.eventTypeCode) {
            getAlgoTypeByCode();
          }
        }
      }
    );
    const filterOption = (input: string, option: any) => {
      const ele = data.eventTypeList.find((type: any) => {
        return option.value === type.code;
      });
      return ele?.name.indexOf(input) >= 0;
    };
    const filterVideoOption = (input: string, option: any) => {
      const ele = data.cameraTreeData.find((type: any) => {
        return option.value === type.value;
      });
      return ele?.label.indexOf(input) >= 0;
    };

    return () => (
      <div class="event">
        <div class="header flex">
          <div class="flex1 flex">
            <span class="label">事件类型</span>
            <a-select
              placeholder="请选择"
              allowClear={true}
              v-model={[data.pagination.eventTypeCode, "value"]}
              show-search
              filter-option={filterOption}
            >
              {data.eventTypeList.map((item) => (
                <a-select-option value={item.code}>{item.name}</a-select-option>
              ))}
            </a-select>
          </div>
          <div class="flex1 flex">
            <span class="label">算法类型</span>
            <a-select
              allowClear={true}
              placeholder="请选择"
              v-model={[data.pagination.algoTypeCode, "value"]}
            >
              {data.algoPoList.map((item) => (
                <a-select-option value={item.code}>{item.name}</a-select-option>
              ))}
            </a-select>
          </div>
          <div class="flex1 flex">
            <span class="label">相机名称</span>
            <a-input
              class="param"
              v-model={[data.pagination.name, "value"]}
              placeholder=""
            ></a-input>
          </div>
          <div class="flex1 flex">
            <span class="label">相机IP</span>
            <a-input
              class="param"
              v-model={[data.pagination.ip, "value"]}
              placeholder=""
            ></a-input>
          </div>
        </div>
        <div class="header">
          <div class="flex1 flex">
            <span class="label">选择时间</span>
            <a-range-picker
              style={{ width: "300px" }}
              placeholder={["开始时间", "结束时间"]}
              v-model={[time.value, "value"]}
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              onChange={timeChange}
            />
          </div>
          <div class="flex3 btns">
            <a-button
              type="primary"
              onClick={() => {
                data.param.current = 1;
                getData();
              }}
            >
              查询
            </a-button>
            <a-button
              onClick={() => {
                reset();
                getData();
              }}
            >
              重置
            </a-button>
          </div>
        </div>
        <div class="header">
          <div>
            <a-button
              type="primary"
              onClick={() => {
                data.param.id = "";
                open();
                data.dialog = true;
              }}
            >
              创建事件
            </a-button>
          </div>
        </div>
        <div class="body">
          <a-table
            class="algorithmTypeTable"
            dataSource={data.dataSource}
            columns={data.columns}
            pagination={data.pagination}
            show-size-changer
            onChange={pageChange}
            rowKey="code"
            v-slots={tableSlot()}
          ></a-table>
        </div>
        <a-modal
          class="eventModal"
          title="创建事件"
          v-model={[data.dialog, "visible"]}
          onOk={() => {
            handleSave();
          }}
          okText="创建"
          onCancel={() => {
            formRef.value.resetFields();
            data.dialog = false;
          }}
        >
          <a-form ref={formRef} model={data.param} rules={data.rules}>
            <a-form-item label="事件类型" name="eventTypeCode">
              <a-select
                placeholder="请选择"
                v-model={[data.param.eventTypeCode, "value"]}
                show-search
                filter-option={filterOption}
                onChange={(e: Array<string>) => {
                  getAlgoTypeByCode();
                }}
              >
                {data.eventTypeList.map((item) => (
                  <a-select-option value={item.code}>
                    {item.name}
                  </a-select-option>
                ))}
              </a-select>
            </a-form-item>
            <a-form-item label="算法类型" name="algoTypeCode">
              <a-select
                placeholder="请选择"
                v-model={[data.param.algoTypeCode, "value"]}
              >
                {data.algoPoList.map((item) => (
                  <a-select-option value={item.code}>
                    {item.name}
                  </a-select-option>
                ))}
              </a-select>
            </a-form-item>
            <a-form-item label="选择相机" name="cameraUuid">
              <a-select
                show-search
                filter-option={filterVideoOption}
                v-model={[data.param.cameraUuid, "value"]}
              >
                {data.cameraTreeData.map((item: any) => (
                  <a-select-option value={item.value}>
                    {item.label}
                  </a-select-option>
                ))}
              </a-select>
            </a-form-item>
            <a-form-item label="数据" name="data">
              <a-input v-model={[data.param.data, "value"]} />
              {/* <a-select v-model={[data.param.data, 'value']}>
                {data.alarmType.map((item: any) => (
                  <a-select-option value={item.value}>
                    {item.label}
                  </a-select-option>
                ))}
              </a-select> */}
              0:消警 1:报警 2:预警
            </a-form-item>
            <a-form-item label="创建时间">
              <a-date-picker
                style="width:100%"
                show-time
                v-model={[createTime.value, "value"]}
              />
            </a-form-item>
            <a-form-item label="事件源">
              <a-textarea v-model={[data.param.source, "value"]} />
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea v-model={[data.param.remark, "value"]} />
            </a-form-item>
            <a-form-item label="扩展信息">
              <a-textarea v-model={[data.param.body, "value"]} />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal
          class="eventModal"
          title="事件详情"
          v-model={[data.showDialog, "visible"]}
          v-slots={{
            footer: () => {
              return (
                <div style="text-align:center">
                  <a-button
                    style="width:120px"
                    type="primary"
                    onClick={() => {
                      data.showDialog = false;
                    }}
                  >
                    关闭
                  </a-button>
                </div>
              );
            },
          }}
        >
          <a-form>
            <a-form-item label="时间">
              {timestampToTime(data.param.createDt)}
            </a-form-item>
            <a-form-item label="相机名称">{data.param.name}</a-form-item>
            <a-form-item label="相机UUID">{data.param.cameraUuid}</a-form-item>
            <a-form-item label="相机IP">{data.param.cameraIp}</a-form-item>
            <a-form-item label="事件源">{data.param.source}</a-form-item>
            <a-form-item label="事件类型">{data.param.eventType}</a-form-item>
            <a-form-item label="算法类型">{data.param.algoType}</a-form-item>
            <a-form-item label="数据">{data.param.data}</a-form-item>
            <a-form-item label="备注">{data.param.remark}</a-form-item>
            <a-form-item label="扩展信息">{data.param.body}</a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-events");
