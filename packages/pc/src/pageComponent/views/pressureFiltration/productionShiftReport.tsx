import { defineComponent, onMounted, reactive, ref } from "vue";
import utils from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import pressureFiltrationRecordApi from "@/api/pressureFiltration/pressureFiltrationRecord";

interface formType {
  shift?: number;
  time?: Array<string>;
  startTime?: string | number;
  endTime?: string | number;
}

const productionShiftReport = defineComponent({
  name: "ProductionShiftReport",
  setup(this, props, ctx) {
    const formData = ref<formType>({
      time: [],
      shift: 0,
    });
    const columns = ref([]);

    // 列表数据
    const dataSource = ref([]);

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
      showQuickJumper: true,
    });

    // 获取列表数据
    const http = async (data?) => {
      const res = await pressureFiltrationRecordApi.getFilterShiftLogger(
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
      data.shift = formData.value.shift;
      http(data);
    };

    // 重置
    const reset = () => {
      formData.value = {};
      http();
    };

    onMounted(() => {
      http();
    });
    return () => (
      <div class="productionShiftReport">
        <div class="productionShiftReport-top">
          <a-form
            model={formData.value}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
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
                  />
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="班次">
                  <a-select
                    ref="select"
                    style={{ width: "100%" }}
                    v-model:value={[formData.value.shift, "value"]}
                  >
                    <a-select-option value={0}>全部</a-select-option>
                    <a-select-option value={1}>早班</a-select-option>
                    <a-select-option value={2}>晚班</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6} style={{ textAlign: "right" }}>
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
        <div class="productionShiftReport-table">
          <a-table
            columns={columns.value}
            dataSource={dataSource.value}
            onChange={(page) => {
              const { current, pageSize, total } = page;
              pagination.current = current;
              pagination.pageSize = pageSize;
              pagination.total = total;
              http();
            }}
          ></a-table>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(
  productionShiftReport,
  "productionShiftReport"
);
