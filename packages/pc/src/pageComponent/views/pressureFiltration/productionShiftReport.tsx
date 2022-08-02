import { defineComponent, onMounted, reactive, ref } from "vue";
import utils from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import pressureFiltrationRecordApi from "@/api/pressureFiltration/pressureFiltrationRecord";

interface formType {
  shift?: string;
  time?: Array<string>;
  startTime?: string | number;
  endTime?: string | number;
}

const productionShiftReport = defineComponent({
  name: "ProductionShiftReport",
  setup(this, props, ctx) {
    const formData = ref<formType>({
      shift: "0",
    });
    const columns = ref([]);

    // 列表数据
    const dataSource = ref([]);

    // 班次列表
    const shiftList = ref<Array<{ [key: string]: string }>>([]);

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
    });

    const getShiftList = async () => {
      const res = await pressureFiltrationRecordApi.getShiftList();
      shiftList.value = res.data;
    };

    // 获取列表数据
    const http = async () => {
      const data: formType = {};
      if (formData.value.time && formData.value.time.length > 0) {
        data.startTime = dayjs(formData.value.time[0]).valueOf();
        data.endTime = dayjs(formData.value.time[1]).valueOf();
      }
      data.shift = formData.value.shift;
      const res = await pressureFiltrationRecordApi.getFilterShiftLogger(
        pagination.pageSize,
        pagination.current,
        data
      );
      if (res.data) {
        const { body, head } = res.data;

        dataSource.value = body.data;
        columns.value = head;
        pagination.current = body.pageNum;
        pagination.total = body.total;
      }
    };

    // 查询
    const search = () => {
      http();
    };

    // 重置
    const reset = () => {
      formData.value = {
        shift: "0",
      };
      http();
    };

    onMounted(() => {
      http();
      getShiftList();
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
                    {shiftList.value.map((item) => (
                      <a-select-option value={item.code}>
                        {item.text}
                      </a-select-option>
                    ))}
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
            v-slots={{
              bodyCell: ({ column, record, index }) => {
                if (column.key === "recordDate") {
                  return dayjs(record.recordDate).format("YYYY-MM-DD");
                }
                if (column.key === "shiftCode") {
                  const data = shiftList.value.find(
                    (n) => n.code === `${record.shiftCode}`
                  );
                  return data?.text || "--";
                }
              },
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
