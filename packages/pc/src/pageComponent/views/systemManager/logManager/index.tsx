import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
  PropType,
} from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api, { setInstance } from "@/api/logManager";
import { Moment } from "moment";
import utils from "@/utils";

export interface IUrlObj {
  // 日志列表
  list: string;
  // 筛选列表
  searchList: string;
}

const column = [
  {
    title: "日志时间",
    dataIndex: "createDt",
    key: "createDt",
  },
  {
    title: "系统名称",
    dataIndex: "softSysName",
    key: "softSysName",
  },
  {
    title: "模块名称",
    dataIndex: "moduleName",
    key: "moduleName",
  },
  {
    title: "日志类型",
    dataIndex: "recordType",
    key: "recordType",
  },
  {
    title: "操作类型",
    dataIndex: "operateType",
    key: "operateType",
  },
  {
    title: "日志内容",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "操作人",
    dataIndex: "createUser",
    key: "createUser",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    slots: { customRender: "action" },
  },
];

interface FormState {
  systemType: string; // 系统类型
  moduleType: string; // 模块类型
  operateType: string; // 操作类型
  recordType: string; // 记录类型
  searchText: string; // 日志内容
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  time: Moment[];
  // keyword: string;
}

const span = 24;

const LogManager = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    prefix: {
      type: String,
    },
    serverName: {
      type: String,
    },
  },
  setup(prop, context) {
    setInstance({ prefix: prop.prefix, serverName: prop.serverName });
    const urlMap = { ...prop.url };

    const formRef = ref();

    const formState = reactive({
      softSysId: "", // 系统类型
      moduleId: "", // 模块类型
      operateId: "", // 操作类型
      recordId: "", // 记录类型
      keyword: "", // 日志内容
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      time: [] as any[],
    });

    const state = reactive({
      systemTypeList: [], // 系统类型
      moduleTypeList: [], // 模块类型
      operateTypeList: [], // 操作类型
      recordTypeList: [], // 记录类型
    });

    const showMore = ref(false);

    const getList = async () => {
      const resp = await api.getHead(urlMap.searchList)();
      return resp.data;
    };

    onMounted(async () => {
      const res = await getList();
      state.systemTypeList = res.sysLogHeadList;
      state.operateTypeList = res.recordLogHeadList;
    });

    // 选择系统 模块列表
    const onSystemChange = () => {
      formState.moduleId = "";
      if (formState.softSysId) {
        const sys: any = state.systemTypeList.find(
          (item: any) => item.id === formState.softSysId
        );
        state.moduleTypeList = sys?.subList ?? [];
      } else {
        state.moduleTypeList = [];
      }
    };

    // 选择操作类型 日志类型列表
    const onOperateTypeChange = () => {
      formState.operateId = "";
      if (formState.recordId) {
        const operate: any = state.operateTypeList.find(
          (item: any) => item.id === formState.recordId
        );
        state.recordTypeList = operate.subList;
      } else {
        state.recordTypeList = [];
      }
    };

    // table
    const {
      currPage,
      isLoading,
      refresh,
      tableList,
      handlePageChange,
      total,
      pageSize,
      hanldePageSizeChange,
    } = useTableList(
      () =>
        api.getList(urlMap.list)({
          ...formState,
          pageNum: currPage.value,
          pageSize: pageSize.value,
        }),
      "logList"
    );
    refresh();

    // 重置表单
    const handleReset = () => {
      formRef.value.resetFields();
      state.recordTypeList = [];
      state.moduleTypeList = [];
      refresh();
    };

    const visible = ref(false);
    const cancel = () => {
      visible.value = false;
    };

    const submit = () => {
      formState.startTime = formState.time?.[0]
        ?.startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      formState.endTime = formState.time?.[1]
        ?.endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      refresh();
    };

    const info = ref<any>({});

    return () => (
      <div class="logManager">
        <a-form
          ref={formRef}
          model={formState}
          name="basic"
          class="searchLine"
          labelCol={{ style: { width: "9em" } }}
          colon={false}
          layout="inline"
          onSubmit={submit}
        >
          <a-row>
            <a-col span={6}>
              <a-form-item name="softSysId" label="系统名称">
                <a-select
                  v-model={[formState.softSysId, "value"]}
                  allowClear
                  style="width: 200px"
                  onChange={onSystemChange}
                >
                  {state.systemTypeList &&
                    state.systemTypeList.map((item: any) => (
                      <a-select-option value={item.id} key={item.id}>
                        {item.headName}
                      </a-select-option>
                    ))}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span={6}>
              <a-form-item name="moduleId" label="模块名称">
                <a-select
                  v-model={[formState.moduleId, "value"]}
                  allowClear
                  style="width: 200px"
                >
                  {state.moduleTypeList &&
                    state.moduleTypeList.map((item: any) => (
                      <a-select-option value={item.id} key={item.id}>
                        {item.headName}
                      </a-select-option>
                    ))}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item name="recordId" label="操作类型">
                <a-space align="start">
                  <a-select
                    v-model={[formState.recordId, "value"]}
                    allowClear
                    style="width: 200px"
                    onChange={onOperateTypeChange}
                  >
                    {state.operateTypeList &&
                      state.operateTypeList.map((item: any) => (
                        <a-select-option value={item.id} key={item.id}>
                          {item.headName}
                        </a-select-option>
                      ))}
                  </a-select>
                  <span style={{ lineHeight: "32px" }}>-</span>
                  <a-form-item name="operateId">
                    <a-select
                      v-model={[formState.operateId, "value"]}
                      allowClear
                      style="width: 200px"
                    >
                      {state.recordTypeList &&
                        state.recordTypeList.map((item: any) => (
                          <a-select-option value={item.id} key={item.id}>
                            {item.headName}
                          </a-select-option>
                        ))}
                    </a-select>
                  </a-form-item>
                </a-space>
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item label="时间段查询">
                <a-range-picker
                  style={{ width: "400px" }}
                  v-model={[formState.time, "value"]}
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col span={6}>
              <a-form-item name="keyword" label="关键字">
                <a-input
                  v-model={[formState.keyword, "value"]}
                  allowClear
                  placeholder="请输入日志关键内容"
                />
              </a-form-item>
            </a-col>
            <a-col style={{ textAlign: "right" }} span={6}>
              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit">
                    查询
                  </a-button>
                  <a-button onClick={handleReset}>重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          dataSource={tableList.value}
          columns={column}
          pagination={{
            pageSize: pageSize.value,
            current: currPage.value,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共${total}条`,
            total: total.value,
            "onUpdate:current": handlePageChange,
            "onUpdate:pageSize": hanldePageSizeChange,
          }}
          loading={isLoading.value}
          v-slots={{
            action: ({ record }: any) => {
              return (
                <a
                  onClick={() => {
                    info.value = record;
                    visible.value = true;
                  }}
                >
                  详情
                </a>
              );
            },
          }}
        />

        <a-modal
          v-model={[visible.value, "visible"]}
          title="日志内容详情"
          onCancel={cancel}
          width="500px"
          class="logModal"
          footer={null}
        >
          <a-row gutter={16}>
            <a-col span={span} class="col">
              <div class="label">日志时间:</div>
              <div>{info.value.createDt}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">系统名称:</div>
              <div>{info.value.softSysName}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">模块名称:</div>
              <div>{info.value.moduleName}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">日志类型:</div>
              <div>{info.value.recordType}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">操作类型:</div>
              <div>{info.value.operateType}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">操作人:</div>
              <div>{info.value.createUser}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">日志内容:</div>
              <div>{info.value.content}</div>
            </a-col>
          </a-row>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(LogManager, "log-manager");
