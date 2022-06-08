import { defineComponent, onMounted, PropType, reactive, ref } from "vue";
import { EnumItem, getEnum } from "@/pageComponent/api/alarm/alarmRecord";

const QueryFilter = defineComponent({
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    enumObj: {
      type: Object as PropType<{ [key: string]: Array<EnumItem> }>,
    },
  },
  setup(_props, _ctx) {
    const formRef = ref();
    const form = reactive({
      level: null, // 报警级别
      type: null, // 报警类型
      status: null, // 报警状态
      time: [], // 时间
      keyword: null, // 关键字
    });
    return () => (
      <div class="query-filter">
        <a-form
          style={{ width: "100%" }}
          layout="inline"
          labelCol={{ width: "150px" }}
          colon={false}
          model={form}
          ref={formRef}
        >
          <a-row style={{ width: "100%" }}>
            <a-col span={6}>
              <a-form-item label="报警级别" name="level">
                <a-select
                  style={{ width: "200px" }}
                  v-model={[form.level, "value"]}
                >
                  <a-select-option value={null}>全部</a-select-option>
                  {_props.enumObj?.AlarmLevelEnum.map((item) => (
                    <a-select-option value={item.code}>
                      {item.name}
                    </a-select-option>
                  ))}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span={6}>
              <a-form-item label="报警类型" name="type">
                <a-select
                  style={{ width: "200px" }}
                  v-model={[form.type, "value"]}
                >
                  <a-select-option value={null}>全部</a-select-option>
                  {_props.enumObj?.AlarmTypeEnum.map((item) => (
                    <a-select-option value={item.code}>
                      {item.name}
                    </a-select-option>
                  ))}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span={6}>
              <a-form-item label="报警状态" name="status">
                <a-select
                  style={{ width: "200px" }}
                  v-model={[form.status, "value"]}
                >
                  <a-select-option value={null}>全部</a-select-option>
                  {_props.enumObj?.AlarmStatusEnum.map((item) => (
                    <a-select-option value={item.code}>
                      {item.name}
                    </a-select-option>
                  ))}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span={6}>
              <a-form-item label={null} name="keyword">
                <a-input
                  style={{ width: "200px" }}
                  placeholder="请输入关键字"
                  v-model={[form.keyword, "value"]}
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item label="报警时间" name="time">
                <a-range-picker
                  style={{ width: "400px" }}
                  v-model={[form.time, "value"]}
                  // valueFormat='YYYY-MM-DDTHH:mm:[00][Z]'
                />
              </a-form-item>
            </a-col>
            <a-col span={6} offset={6}>
              <a-form-item style={{ textAlign: "right" }}>
                <a-space>
                  <a-button
                    type="primary"
                    onClick={() => {
                      _props.onSubmit(form);
                    }}
                  >
                    查询
                  </a-button>
                  <a-button
                    onClick={() => {
                      formRef.value.resetFields();
                      _props.onSubmit(form);
                    }}
                  >
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    );
  },
});

export default QueryFilter;
