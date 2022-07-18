import pressureFiltrationHomeApi from "@/api/pressureFiltration/pressureFiltrationHome";
import { message } from "ant-design-vue";
import { defineComponent, PropType, ref, watch } from "vue";

const props = {
  data: {
    type: Array as PropType<Array<{ [key: string]: string | number }>>,
    default: [],
  },
};

export default defineComponent({
  name: "ShiftChange",
  props,
  emits: ["close"],
  setup(this, _props, _ctx) {
    // 带料数据
    const shiftChangeData = ref<Array<{ [key: string]: string | number }>>([]);

    // 更新带料数据
    const save = async () => {
      const res = await pressureFiltrationHomeApi.updateFeedingStatus(
        shiftChangeData.value
      );
      if (res.data) {
        message.success("保存成功");
        shiftChangeData.value = [];
        _ctx.emit("close");
      }
    };

    watch(
      () => _props.data,
      (e) => {
        if (e) {
          console.log(e);
          shiftChangeData.value = e;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <div class="shiftChange">
        <div class="shiftChange-top">是否带料</div>
        <div class="shiftChange-content">
          <a-row gutter={24}>
            {shiftChangeData.value.map((item) => (
              <a-col span={12} style={{ marginBottom: "10px" }}>
                <a-row gutter={24}>
                  <a-col span={6}>
                    <div>{item.ylCode}</div>
                  </a-col>
                  <a-col span={18}>
                    <a-radio-group
                      v-model={[item.feedingStatus, "value"]}
                      button-style="solid"
                    >
                      <a-radio-button value="1">是</a-radio-button>
                      <a-radio-button value="2">否</a-radio-button>
                    </a-radio-group>
                  </a-col>
                </a-row>
              </a-col>
            ))}
          </a-row>
        </div>
        <div class="shiftChange-footer">
          <a-button
            style={{ marginRight: "20px" }}
            onClick={() => {
              shiftChangeData.value = [];
              _ctx.emit("close");
            }}
          >
            取消
          </a-button>
          <a-button
            type="primary"
            onClick={() => {
              save();
            }}
          >
            确定
          </a-button>
        </div>
      </div>
    );
  },
});
