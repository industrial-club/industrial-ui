import {
  defineComponent,
  reactive,
  ref,
  h,
  resolveComponent,
  onMounted,
  onUnmounted,
  watch,
  computed,
} from "vue";
import {
  Table,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  RangePicker,
  Button,
  Modal,
  Row,
  Col,
  Space,
} from "ant-design-vue";
import useTableList from "@/pageComponent/hooks/useTableList";
import api from "@/pageComponent/api/logManager";
import moment, { Moment } from "moment";

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

export default defineComponent({
  setup(prop, context) {
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
      const resp = await api.getHead({ parent: val });
      return resp.data;
    };

    onMounted(async () => {
      state.systemTypeList = await getList(0);
    });

    // 模块类型
    watch([() => formState.systemType], async () => {
      state.moduleTypeList = await getList(formState.systemType);
      formState.moduleType = "";
    });
    // 操作类型
    watch([() => formState.moduleType], async () => {
      state.operateTypeList = await getList(formState.moduleType);
      formState.operateType = "";
    });

    // 记录类型
    watch([() => formState.operateType], async () => {
      state.recordTypeList = await getList(formState.operateType);
      formState.recordType = "";
    });

    // table
    const { currPage, isLoading, refresh, tableList, handlePageChange, total } =
      useTableList(
        () =>
          api.getList({
            ...formState,
            pageNum: currPage.value - 1,
            pageSize: 10,
          }),
        "logList"
      );
    refresh();

    const useForm = Form.useForm;
    const { resetFields, validate, validateInfos } = useForm(formState);

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
        <Form
          v-model={formState}
          name="basic"
          class="searchLine"
          layout="inline"
          onSubmit={submit}
        >
          <div style="width:80%;">
            <FormItem label="系统名称">
              <Select
                v-model={[formState.systemType, "value"]}
                allowClear
                style="width: 120px"
              >
                {state.systemTypeList &&
                  state.systemTypeList.map((item: any) => (
                    <SelectOption value={item.id} key={item.id}>
                      {item.headName}
                    </SelectOption>
                  ))}
              </Select>
            </FormItem>

            <FormItem label="模块名称">
              <Select
                v-model={[formState.moduleType, "value"]}
                allowClear
                style="width: 120px"
              >
                {state.moduleTypeList &&
                  state.moduleTypeList.map((item: any) => (
                    <SelectOption value={item.id} key={item.id}>
                      {item.headName}
                    </SelectOption>
                  ))}
              </Select>
            </FormItem>

            <FormItem label="操作类型">
              <Select
                v-model={[formState.operateType, "value"]}
                allowClear
                style="width: 120px"
              >
                {state.operateTypeList &&
                  state.operateTypeList.map((item: any) => (
                    <SelectOption value={item.id} key={item.id}>
                      {item.headName}
                    </SelectOption>
                  ))}
              </Select>
              --
              <Select
                v-model={[formState.recordType, "value"]}
                allowClear
                style="width: 120px"
              >
                {state.recordTypeList &&
                  state.recordTypeList.map((item: any) => (
                    <SelectOption value={item.id} key={item.id}>
                      {item.headName}
                    </SelectOption>
                  ))}
              </Select>
            </FormItem>

            <FormItem label="">
              <Input
                v-model={[formState.searchText, "value"]}
                allowClear
                placeholder="请输入日志关键内容"
              />
            </FormItem>

            {showMore.value && (
              <FormItem label="时间段查询">
                <RangePicker v-model={[formState.time, "value"]} allowClear />
              </FormItem>
            )}
          </div>

          <FormItem>
            <Space>
              <Button type="primary" html-type="submit">
                查询
              </Button>
              <Button onClick={resetFields}>重置</Button>
              {showMore.value}
              {showMore.value ? (
                <Button
                  type="link"
                  onClick={() => {
                    showMore.value = false;
                  }}
                >
                  收起
                  <upOutlined />
                </Button>
              ) : (
                <Button
                  type="link"
                  onClick={() => {
                    showMore.value = true;
                  }}
                >
                  展开
                  <downOutlined />
                </Button>
              )}
            </Space>
          </FormItem>
        </Form>

        <Table
          dataSource={tableList.value}
          columns={column}
          size="middle"
          pagination={{ total: total.value, onChange: handlePageChange }}
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

        <Modal
          v-model={[visible.value, "visible"]}
          title="日志内容详情"
          onCancel={cancel}
          width="500px"
          class="logModal"
          footer={null}
        >
          <Row gutter={16}>
            <Col span={span} class="col">
              <div class="label">日志时间:</div>
              <div>{info.value.createTime}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">系统名称:</div>
              <div>{info.value.systemType}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">模块名称:</div>
              <div>{info.value.moduleType}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">日志类型:</div>
              <div>{info.value.recordType}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">操作类型:</div>
              <div>{info.value.operateType}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">操作人:</div>
              <div>{info.value.userName}</div>
            </Col>
            <Col span={span} class="col">
              <div class="label">日志内容:</div>
              <div>{info.value.contentText}</div>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  },
});
