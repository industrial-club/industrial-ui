import { defineComponent, reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";

interface Domain {
  relationship: string;
  key: number;
}
export default defineComponent({
  name: "ConditionSetting",
  setup(this, props, ctx) {
    const formRef = ref<FormInstance>();
    const dynamicValidateForm = reactive<{
      parameter: string;
      domains: Domain[];
    }>({
      parameter: "",
      domains: [],
    });
    return () => (
      <div class="conditionSetting">
        <div class="conditionSetting-top">
          <a-button
            type="link"
            v-slots={{
              icon: () => <plus-circle-outlined />,
            }}
            onClick={() => {
              dynamicValidateForm.domains.push({
                relationship: "",
                key: Date.now(),
              });
            }}
          >
            添加参数
          </a-button>
        </div>
        <div class="conditionSetting-content">
          <a-form
            ref={formRef}
            name="dynamic_form_item"
            model="dynamicValidateForm"
          >
            <a-form-item label="参数1" name="parameter"></a-form-item>
            {dynamicValidateForm.domains.map((domain, index) => (
              <a-form-item
                label={`参数${index + 2}`}
                name={["domains", index, "value"]}
              >
                <a-row gutter={24}>
                  <a-col span={12}>
                    <a-select ref="select" v-model={[domain.value, "value"]}>
                      <a-select-option value="and">与</a-select-option>
                      <a-select-option value="or">或</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col span={12}>
                    <a-radio-group
                      v-model={[domain.value, "value"]}
                      button-style="solid"
                    >
                      <a-radio-button value="a">流量</a-radio-button>
                      <a-radio-button value="b">时间</a-radio-button>
                    </a-radio-group>
                  </a-col>
                </a-row>
              </a-form-item>
            ))}
          </a-form>
        </div>
      </div>
    );
  },
});
