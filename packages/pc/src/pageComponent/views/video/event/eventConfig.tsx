import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import eventApi from "@/api/event";
import transfer from "../components/transfer";
import "../assets/styles/video/event.less";

import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  components: { transfer },
  setup() {
    const data = reactive<{
      pagination: {
        eventTypeCode: string;
        eventTypeName: string;
        algoTypeCode: string;
        algoTypeName: string;
        pageNum: number;
        pageSize: number;
        current: number;
        total: number;
      };
      dataSource: Array<any>;
      columns: any;
      param: any;
      rules: any;
      dialog: boolean;
      algoPoList: Array<any>;
      eventTypeList: Array<any>;
    }>({
      pagination: {
        eventTypeCode: "",
        eventTypeName: "",
        algoTypeCode: "",
        algoTypeName: "",
        pageNum: 1,
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total: number) => `共 ${total} 条`,
      },
      dataSource: [],
      columns: [
        {
          title: "事件类型",
          dataIndex: "eventTypeName",
          align: "left",
        },
        {
          title: "事件类型编码",
          dataIndex: "eventTypeCode",
          align: "left",
        },
        {
          title: "算法类型",
          dataIndex: "algoTypeName",
          align: "left",
        },
        {
          title: "算法类型编码",
          dataIndex: "algoTypeCode",
          align: "left",
        },
        {
          title: "是否启用",
          dataIndex: "enabled",
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
        algoTypeCode: "",
        createUser: "",
        enabled: false,
        eventTypeCode: "",
        id: "",
        name: "",
        remark: "",
      },
      rules: {
        eventTypeCode: [{ required: true, message: "此项必填" }],
        algoTypeCode: [{ required: true, message: "此项必填" }],
      },
      dialog: false,
      algoPoList: [],
      eventTypeList: [],
    });
    const getList = async () => {
      // 算法类型
      const res = await eventApi.getAlgorithmTypeList();
      const resq = await eventApi.getEventTypeList();
      data.algoPoList = res.data;
      data.eventTypeList = resq.data;
    };
    const getData = async () => {
      data.pagination.pageNum = data.pagination.current;
      // if (data.pagination.algoTypeName.trim()) {
      //   data.pagination.algoTypeCode = data.algoPoList.find(
      //     (item) => item.name === data.pagination.algoTypeName.trim()
      //   )?.code;
      // } else {
      //   data.pagination.algoTypeCode = "";
      // }
      // if (data.pagination.eventTypeName.trim()) {
      //   data.pagination.eventTypeCode = data.eventTypeList.find(
      //     (item) => item.name === data.pagination.eventTypeName.trim()
      //   )?.code;
      // } else {
      //   data.pagination.eventTypeCode = "";
      // }
      const res = await eventApi.getEventConfig(data.pagination);
      data.pagination.total = res.data.total;
      data.dataSource = res.data.list;
    };
    onMounted(() => {
      getList().then(() => {
        getData();
      });
    });

    const pageChange = (page: any) => {
      data.pagination = { ...data.pagination, ...page };
      getData();
    };
    const cameraData: any = ref([]);
    const getName = async (uuid: string) => {
      const res = await eventApi.getByUuid(uuid);
      const name = `${res.data.name} (${res.data.ip})*${uuid}`;
      if (name) cameraData.value.push(name);
    };
    const open = async () => {
      data.dialog = true;
      if (data.param.id === "") {
        data.param = {
          algoTypeCode: "",
          createUser: "",
          enabled: false,
          eventTypeCode: "",
          id: "",
          name: "",
          remark: "",
        };
        cameraData.value = [];
      } else {
        const res = await eventApi.getEventConfigById(data.param.id);
        cameraData.value = [];
        if (res.data.cameraUuids) {
          res.data.cameraUuids.forEach((ele: string) => {
            getName(ele);
          });
        }
        data.param = res.data.po;
      }
    };
    // 删除
    const handledelete = async (id: string) => {
      await eventApi.deleteEventConfig(id);
      data.pagination.pageNum = 1;
      getData();
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <a
                onClick={() => {
                  data.param.id = param.record.id;
                  open();
                }}
              >
                编辑
              </a>
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => {
                  handledelete(param.record.id);
                }}
              >
                <a>删除</a>
              </a-popconfirm>
            </div>
          );
        }
        if (param.column.dataIndex === "enabled") {
          return (
            <div class="flex">{param.record.enabled ? "启用" : "禁用"}</div>
          );
        }
        return true;
      };
      return obj;
    };
    const formRef = ref();

    const ok = ref(false);
    // 保存
    const handleSave = async () => {
      // 点击保存时需要把子组件的cameraUuids传回来
      ok.value = true; // 穿梭框监听这个值为true传回cameraUuids
      formRef.value
        .validate()
        .then(async () => {
          data.dialog = false;
          formRef.value.resetFields();
        })
        .catch((error: any) => {});
    };
    const bind = async (e: Array<string>) => {
      await eventApi.saveEventConfig({
        po: data.param,
        cameraUuids: e.map((item) => item.split("*")[1]),
      });
      getData();
    };

    const getAlgoTypeByCode = async () => {
      const res = await eventApi.getEventAlgoTypeByCode(
        data.param.eventTypeCode
      );
      data.algoPoList = res.data.algoPoList;
    };
    watch(
      () => data.dialog,
      async () => {
        ok.value = false;
        if (data.dialog) {
          // const resq = await eventApi.getEventTypeList(data.pagination);
          // data.eventTypeList = resq.data;
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

    return () => (
      <div class="event">
        <div class="header flex">
          <div class="">
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
          <div class="flex3 btns">
            <a-button
              type="primary"
              onClick={() => {
                data.pagination.current = 1;
                getData();
              }}
            >
              查询
            </a-button>
            <a-button
              class="reset"
              onClick={() => {
                data.pagination.algoTypeName = "";
                data.pagination.eventTypeName = "";
                data.pagination.current = 1;
                getData();
              }}
            >
              重置
            </a-button>
          </div>
        </div>
        <div class="header flex">
          <div class="flex3">
            <a-button
              type="primary"
              onClick={() => {
                data.param.id = "";
                open();
              }}
            >
              配置事件
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
          width="800px"
          class="eventModal"
          title="事件配置"
          v-model={[data.dialog, "visible"]}
          onOk={() => {
            handleSave();
          }}
          okText="保存"
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
                onChange={(e: Array<string>) => {
                  data.param.algoTypeCode = "";
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
            <a-form-item label="备注">
              <a-textarea v-model={[data.param.remark, "value"]} />
            </a-form-item>
            <a-form-item label="是否启用">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model={[data.param.enabled, "checked"]}
              />
            </a-form-item>
            <div class="addCamera">
              <div class="label">添加相机：</div>
              <transfer
                ok={ok.value}
                onSaveCameraUuids={bind}
                checkList={cameraData.value}
              ></transfer>
            </div>
          </a-form>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-eventConfig");
