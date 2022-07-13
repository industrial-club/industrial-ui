import { defineComponent, ref } from "vue";
import utils from "@/utils";

const unloading = defineComponent({
  name: "Unloading",
  setup(this, props, ctx) {
    const form = ref<{
      model?: string;
      time?: number;
    }>({});
    return () => (
      <div class="unloading">
        <div>
          <a-divider orientation="left">卸料设定</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="开始卸料模式确认" colon={false}>
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
                <a-form-item label="允许卸料台数" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">一台</a-radio-button>
                    <a-radio-button value="1">两台</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-divider orientation="left">卸料判断模式</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="8053判断式" colon={false}>
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
          </a-form>
        </div>
        <div>
          <a-divider orientation="left">转载设备启动设置</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="模式选择" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="1">智能</a-radio-button>
                    <a-radio-button value="0">手动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="确认模式选择" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">人工确认</a-radio-button>
                    <a-radio-button value="1">系统自动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-divider orientation="left">转载设备启动设置</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="模式选择" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="1">智能</a-radio-button>
                    <a-radio-button value="0">手动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="确认模式选择" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="0">人工确认</a-radio-button>
                    <a-radio-button value="1">系统自动</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="8087延时设置" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="s"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="8088延时设置" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="s"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="8089延时设置" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="s"
                  ></a-input-number>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="8091延时设置" colon={false}>
                  <a-input-number
                    v-model={[form.value.time, "value"]}
                    addon-after="s"
                  ></a-input-number>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-divider orientation="left">生产闭锁</a-divider>
          <a-form model={form.value}>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="生产闭锁" colon={false}>
                  <a-radio-group
                    v-model={[form.value.model, "value"]}
                    button-style="solid"
                  >
                    <a-radio-button value="1">闭锁</a-radio-button>
                    <a-radio-button value="0">解锁</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(unloading, "unloading");
