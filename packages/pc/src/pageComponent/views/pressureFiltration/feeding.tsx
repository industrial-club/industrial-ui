import { defineComponent, ref } from "vue";
import utils from "@/utils";
import conditionSetting from "@/pageComponent/components/pressureFiltration/conditionSetting";

const feeding = defineComponent({
  name: "Feeding",
  components: {
    conditionSetting,
  },
  setup(this, props, ctx) {
    const form = ref<{
      model?: string;
      time?: number;
    }>({});
    const visible = ref(false);
    return () => (
      <div class="feeding">
        <div>
          <a-divider orientation="left">进料模式设定</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="进料结束确认模式" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">人工确认</a-radio-button>
                    <a-radio-button value="1">系统自动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="流量获取模式" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">人工设定</a-radio-button>
                    <a-radio-button value="1">系统计算</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="时间获取模式" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">人工设定</a-radio-button>
                    <a-radio-button value="1">系统计算</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-divider orientation="left">8053参数设定</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="进料结束判断模式" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="1">智能</a-radio-button>
                    <a-radio-button value="0">手动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="时间设定" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="s"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="流量设定" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="m³/h"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="选择性条件设定" colon={false}>
                  <a-button
                    type="link"
                    v-slots={{
                      icon: () => <setting-outlined />,
                    }}
                    onClick={() => {
                      visible.value = true;
                    }}
                  >
                    未设定
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-modal
          v-model={[visible.value, "visible"]}
          title="条件设定"
          footer={false}
        >
          <conditionSetting></conditionSetting>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(feeding, "feeding");
