import filterPressConfigurationApi, {
  listItem,
} from "@/api/pressureFiltration/filterPressConfiguration";
import { message } from "ant-design-vue";
import { defineComponent, ref, PropType, watch } from "vue";

interface formItem {
  [key: string]: string | number;
}

const props = {
  title: String,
  form: {
    type: Array as PropType<Array<formItem>>,
    default: [],
  },
};

export default defineComponent({
  props,
  emits: ["refresh"],
  setup(this, _props, _ctx) {
    // 配置数据
    const dataList = ref<Array<listItem>>([]);

    // 下发
    const setPageParamValueSingle = async (instanceCode, metricCode, value) => {
      const res = await filterPressConfigurationApi.setPageParamValueSingle({
        instanceCode,
        metricCode,
        value,
      });
      if (res.data === "ok") {
        message.success("下发成功");
        _ctx.emit("refresh");
      }
    };

    // 组件类型判断
    const inputType = (val) => {
      const { instanceCode, metricCode } = val;
      if (val.inputType === "btn") {
        const inputList = JSON.parse(val.inputList);
        return (
          <a-radio-group
            v-model={[val.value, "value"]}
            button-style="solid"
            onChange={(e) => {
              setPageParamValueSingle(instanceCode, metricCode, e.target.value);
            }}
          >
            {inputList?.map((item) => (
              <a-radio-button value={item.value}>{item.name}</a-radio-button>
            ))}
          </a-radio-group>
        );
      }
      if (val.inputType === "select") {
        const inputList = JSON.parse(val.inputList);
        return (
          <a-select
            v-model={[val.value, "value"]}
            onChange={(e) => {
              setPageParamValueSingle(instanceCode, metricCode, e);
            }}
          >
            {inputList.map((item) => (
              <a-select-option value={item.value}>{item.name}</a-select-option>
            ))}
          </a-select>
        );
      }
      if (val.inputType === "text") {
        const inputList = JSON.parse(val.inputList)[0];
        return (
          <a-input-number
            v-model={[val.value, "value"]}
            addon-after={inputList.unit}
            onBlur={(e) => {
              setPageParamValueSingle(instanceCode, metricCode, val.value);
            }}
          ></a-input-number>
        );
      }
    };
    watch(
      () => _props.form,
      (e) => {
        dataList.value = e;
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <div>
        <a-divider orientation="left">{_props.title}</a-divider>
        <a-form>
          <a-row gutter={24}>
            {dataList.value.map((item) => (
              <a-col span={8}>
                <a-form-item
                  label={`${item.key ? item.key : ""}${item.desc}`}
                  colon={false}
                >
                  {inputType(item)}
                </a-form-item>
              </a-col>
            ))}
          </a-row>
        </a-form>
      </div>
    );
  },
});
