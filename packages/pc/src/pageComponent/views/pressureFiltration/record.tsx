import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
import utils from "@/utils";
import pressureFiltrationRecordApi from "@/api/pressureFiltration/pressureFiltrationRecord";
import dayjs, { Dayjs } from "dayjs";

const columns = [
  {
    title: "设备编号",
    dataIndex: "ylCode",
    key: "ylCode",
  },
  {
    title: "日期",
    dataIndex: "recordDate",
    key: "recordDate",
  },
  {
    title: "进料时刻",
    dataIndex: "feedingTime",
    key: "feedingTime",
  },
  {
    title: "进料状态",
    dataIndex: "feedingSmart",
    key: "feedingSmart",
  },
  {
    title: "进料时长（s）",
    dataIndex: "feedingDuration",
    key: "feedingDuration",
  },
  {
    title: "进料流量（m³/h）",
    dataIndex: "feedingFl",
    key: "feedingFl",
  },
  {
    title: "卸料时刻",
    dataIndex: "unloadTime",
    key: "unloadTime",
  },
  {
    title: "卸料状态",
    dataIndex: "unloadSmart",
    key: "unloadSmart",
  },
  {
    title: "等待时长（s）",
    dataIndex: "waitingDuration",
    key: "waitingDuration",
  },
  {
    title: "过程计时（m）",
    dataIndex: "produceDuration",
    key: "produceDuration",
  },
];
interface formType {
  ylCode?: string | null;
  feedingModel?: string | null;
  unloadModel?: string | null;
  time?: Array<string>;
  startTime?: string | number;
  endTime?: string | number;
}
const record = defineComponent({
  name: "Record",
  setup(this, props, ctx) {
    // 查询表单
    const formData = ref<formType>({
      feedingModel: null,
      unloadModel: null,
      ylCode: null,
    });

    // 列表数据
    const dataSource = ref([]);

    // 模式数据
    const modelList = ref<
      Array<{
        [key: string]: string;
      }>
    >([]);

    // 设备数据
    const filterList = ref<
      Array<{
        [key: string]: string;
      }>
    >([]);

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
      showQuickJumper: true,
    });

    // 获取模式
    const getModelList = async () => {
      const res = await pressureFiltrationRecordApi.getModelList();
      modelList.value = res.data;
    };

    // 获取设备
    const getFilterList = async () => {
      const res = await pressureFiltrationRecordApi.getFilterList();
      filterList.value = res.data;
    };

    // 获取列表数据
    const http = async (data?) => {
      const res = await pressureFiltrationRecordApi.getFilterStatisticLogger(
        pagination.pageSize,
        pagination.current,
        data
      );
      if (res.data) {
        dataSource.value = res.data.list;
        pagination.current = res.data.pageNum;
        pagination.total = res.data.total;
      }
    };

    // 查询
    const search = () => {
      const data: formType = {};
      if (formData.value.time && formData.value.time.length > 0) {
        data.startTime = dayjs(formData.value.time[0]).valueOf();
        data.endTime = dayjs(formData.value.time[1]).valueOf();
      }
      data.ylCode = formData.value.ylCode;
      data.feedingModel = formData.value.feedingModel;
      data.unloadModel = formData.value.unloadModel;
      http(data);
    };

    // 重置
    const reset = () => {
      formData.value = {};
      http();
    };

    onMounted(() => {
      http();
      getModelList();
      getFilterList();
    });
    return () => (
      <div class="record">
        <div class="record-top">
          <a-form
            model={formData.value}
            labelAlign="right"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <a-row gutter={24}>
              <a-col span={12}>
                <a-form-item
                  label="日期"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <a-range-picker
                    v-model={[formData.value.time, "value"]}
                    style={{ width: "100%" }}
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="设备">
                  <a-select
                    ref="select"
                    style={{ width: "100%" }}
                    v-model:value={[formData.value.ylCode, "value"]}
                  >
                    {filterList.value.map((item) => (
                      <a-select-option value={item.code}>
                        {item.text}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="进料模式">
                  <a-select
                    ref="select"
                    style={{ width: "100%" }}
                    v-model:value={[formData.value.feedingModel, "value"]}
                  >
                    {modelList.value.map((item) => (
                      <a-select-option value={item.code}>
                        {item.text}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="卸料模式">
                  <a-select
                    ref="select"
                    style={{ width: "100%" }}
                    v-model:value={[formData.value.unloadModel, "value"]}
                  >
                    {modelList.value.map((item) => (
                      <a-select-option value={item.code}>
                        {item.text}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={18} style={{ textAlign: "right" }}>
                <a-button
                  type="primary"
                  onClick={search}
                  style={{ marginRight: "10px" }}
                >
                  查询
                </a-button>
                <a-button onClick={reset}>重置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="record-table">
          <a-table
            columns={columns}
            dataSource={dataSource.value}
            onChange={(page) => {
              const { current, pageSize, total } = page;
              pagination.current = current;
              pagination.pageSize = pageSize;
              pagination.total = total;
              http();
            }}
            pagination={pagination}
            v-slots={{
              bodyCell: ({ column, record, index }) => {
                if (column.key === "feedingTime") {
                  return dayjs(record.feedingTime).format("HH:mm:ss");
                }
                if (column.key === "unloadTime") {
                  return dayjs(record.unloadTime).format("HH:mm:ss");
                }
              },
            }}
          ></a-table>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(record, "record");
