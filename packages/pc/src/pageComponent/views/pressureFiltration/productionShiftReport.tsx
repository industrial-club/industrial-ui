import { defineComponent, ref } from "vue";
import utils from "@/utils";

const productionShiftReport = defineComponent({
  name: "ProductionShiftReport",
  setup(this, props, ctx) {
    const formData = ref({
      time: [],
      shift: 0,
    });
    const columns = ref([]);
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
                <a-form-item label="日期">
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
                <a-button type="primary">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="productionShiftReport-table">
          <a-table columns={columns.value}></a-table>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(
  productionShiftReport,
  "productionShiftReport"
);
