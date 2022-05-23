import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
  PropType,
} from "vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api from "@/pageComponent/api/logManager";
import { Moment } from "moment";
import utils from "@/utils";

export interface IUrlObj {
  // 日志列表
  list: string;
  // 筛选列表
  searchList: string;
}

const DEFAULT_URL: IUrlObj = {
  list: "/comlite/v1/log/list",
  searchList: "/comlite/v1/log/head",
};

const column = [
  {
    title: "日志时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "系统名称",
    dataIndex: "systemType",
    key: "systemType",
  },
  {
    title: "模块名称",
    dataIndex: "moduleType",
    key: "moduleType",
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
    dataIndex: "contentText",
    key: "contentText",
  },
  {
    title: "操作人",
    dataIndex: "userName",
    key: "userName",
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
  },
  setup(prop, context) {
    const urlMap = { ...DEFAULT_URL, ...prop.url };

    const formRef = ref();

    const formState = reactive<FormState>({
      systemType: "", // 系统类型
      moduleType: "", // 模块类型
      operateType: "", // 操作类型
      recordType: "", // 记录类型
      searchText: "", // 日志内容
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      time: [],
    });

    const state = reactive({
      systemTypeList: [], // 系统类型
      moduleTypeList: [], // 模块类型
      operateTypeList: [], // 操作类型
      recordTypeList: [], // 记录类型
    });

    const showMore = ref(false);

    const getList = async (val: string | number) => {
      const resp = await api.getHead(urlMap.searchList)({ parent: val });
      return resp.data;
    };

    onMounted(async () => {
      state.systemTypeList = await getList(0);
    });

    // 模块类型
    watch(
      () => formState.systemType,
      async (val) => {
        if (!val) {
          state.moduleTypeList = [];
          formState.moduleType = "";
          return;
        }
        state.moduleTypeList = await getList(formState.systemType);
        formState.moduleType = "";
      }
    );
    // 操作类型
    watch(
      () => formState.moduleType,
      async (val) => {
        if (!val) {
          state.operateTypeList = [];
          formState.operateType = "";
          return;
        }
        state.operateTypeList = await getList(formState.moduleType);
        formState.operateType = "";
      }
    );

    // 记录类型
    watch(
      () => formState.operateType,
      async (val) => {
        if (!val) {
          state.recordTypeList = [];
          formState.recordType = "";
          return;
        }
        state.recordTypeList = await getList(formState.operateType);
        formState.recordType = "";
      }
    );

    // table
    const { currPage, isLoading, refresh, tableList, handlePageChange, total } =
      useTableList(
        () =>
          api.getList(urlMap.list)({
            ...formState,
            pageNum: currPage.value - 1,
            pageSize: 10,
          }),
        "logList"
      );
    refresh();

    // 重置表单
    const handleReset = () => {
      formRef.value.resetFields();
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

    const info = ref({
      userName: null,
      systemType: "",
      moduleType: null,
      recordType: "",
      operateType: null,
      contentText: "",
      createTime: "",
    });

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
              <a-form-item name="systemType" label="系统名称">
                <a-select
                  v-model={[formState.systemType, "value"]}
                  allowClear
                  style="width: 200px"
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
              <a-form-item name="moduleType" label="模块名称">
                <a-select
                  v-model={[formState.moduleType, "value"]}
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
              <a-form-item name="operateType" label="操作类型">
                <a-select
                  v-model={[formState.operateType, "value"]}
                  allowClear
                  style="width: 200px"
                >
                  {state.operateTypeList &&
                    state.operateTypeList.map((item: any) => (
                      <a-select-option value={item.id} key={item.id}>
                        {item.headName}
                      </a-select-option>
                    ))}
                </a-select>
                <span style={{ margin: "0 16px" }}>-</span>
                <a-form-item name="recordType">
                  <a-select
                    v-model={[formState.recordType, "value"]}
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
              <a-form-item name="searchText" label="关键字">
                <a-input
                  v-model={[formState.searchText, "value"]}
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
            total: total.value,
            onChange: handlePageChange,
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
              <div>{info.value.createTime}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">系统名称:</div>
              <div>{info.value.systemType}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">模块名称:</div>
              <div>{info.value.moduleType}</div>
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
              <div>{info.value.userName}</div>
            </a-col>
            <a-col span={span} class="col">
              <div class="label">日志内容:</div>
              <div>{info.value.contentText}</div>
            </a-col>
          </a-row>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(LogManager, "log-manager");
