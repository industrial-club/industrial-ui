import {
  computed,
  defineComponent,
  PropType,
  reactive,
  watch,
  ref,
  inject,
  Ref,
} from "vue";
import { message } from "ant-design-vue";
import $store from "@/pageComponent/store";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons-vue";
// import { mapMutations } from 'vuex';

const props = {
  enumObj: {
    type: Object as PropType<{ [key: string]: Array<any> }>,
  },
  instanceList: {
    type: Array,
    default: () => [],
  },
};

const rules = {
  propertyCode: [
    {
      required: true,
      type: "array",
      message: "请选择设备信号",
      trigger: "change",
    },
  ],
};

/**
 * 报警规则表单
 */
const RuleForm = defineComponent({
  props,
  setup(_props, _ctx) {
    // 把formRef传给页面根组件
    const formRef = ref();
    const setFormRef: any = inject("setFormRef");
    setFormRef(formRef);

    const isEdit = inject<Ref<boolean>>("isEdit")!;
    const isInitSetSysId = ref(false);

    // 报警类型是否为阈值类
    const isThread = computed(
      () => $store.state.basicForm.alarmType === "THRESHOLD"
    );

    const judgeSymbolList = computed(() => {
      if (isThread.value) {
        return [
          {
            code: "GT",
            name: "大于",
          },
          {
            code: "GTE",
            name: "大于等于",
          },
          {
            code: "LT",
            name: "小于",
          },
          {
            code: "LTE",
            name: "小于等于",
          },
        ];
      } else {
        return [
          {
            code: "EQ",
            name: "等于",
          },
          {
            code: "NEQ",
            name: "不等于",
          },
        ];
      }
    });

    const ruleForm = ref<any>({
      propertyCode: [], // 设备信号
      valueType: "CURRENT", // 统计方式
      alarmConditionList: [
        {
          alarmLevel: 4, // 报警级别
          opValue: undefined, // 报警值
          operator: judgeSymbolList.value[0].code, // 操作符
        },
      ], // 报警规则
      conditionRelation: "OR",
      triggerType: "IMMEDIATELY", // 触发类型
      triggerTime: 0, // 触发时间
    });

    watch(
      judgeSymbolList,
      () =>
        (ruleForm.value.alarmConditionList[0].operator =
          judgeSymbolList.value[0].code)
    );

    // 选择其他系统 清空设备信号
    watch(
      () => $store.state.basicForm.systemUuid,
      () => {
        if (!isEdit.value || isInitSetSysId.value) {
          ruleForm.value.propertyCode = [];
        } else if (isEdit.value) {
          isInitSetSysId.value = true;
        }
      }
    );

    watch(
      () => _props.instanceList,
      (val) => {
        console.log(val, ruleForm.value.propertyCode);
      }
    );

    // 表单回显
    watch(
      () => $store.state.ruleForm,
      (val) => {
        ruleForm.value = val;
      }
    );
    watch(
      () => ruleForm,
      (e) => {
        if (e) {
          $store.commit("setRuleForm", e);
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return () => (
      <div class="rule-form form">
        <h2 class="form-title">报警规则</h2>
        <div class="form-container">
          <a-form
            ref={formRef}
            colon={false}
            model={ruleForm.value}
            label-col={{ style: { width: "80px" } }}
            wrapper-col={{ span: 19 }}
            rules={rules}
          >
            <a-row gutter={16}>
              <a-col span={24}>
                <a-row gutter={16}>
                  <a-col span={12}>
                    <a-form-item label="物属性" name="propertyCode">
                      <a-cascader
                        placeholder="请选择"
                        allowClear={false}
                        options={(_props.instanceList as any[]) ?? []}
                        v-model={[ruleForm.value.propertyCode, "value"]}
                        // @ts-ignore
                        onClick={() => {
                          if (!$store.state.basicForm.systemUuid) {
                            message.warning("请先选择报警系统");
                          }
                        }}
                      ></a-cascader>
                    </a-form-item>
                  </a-col>
                  {/* {isThread.value && (
                    <a-col span={12}>
                      <a-form-item label='统计方式'>
                        <a-select v-model={[ruleForm.value.valueType, 'value']}>
                          {_props.enumObj?.AlarmValueTypeEnum.map((item) => (
                            <a-select-option value={item.code}>
                              {item.name}
                            </a-select-option>
                          ))}
                        </a-select>
                      </a-form-item>
                    </a-col>
                  )} */}
                </a-row>
              </a-col>
              {ruleForm.value.alarmConditionList.map((item, index) => (
                <>
                  <a-col span={10}>
                    <a-form-item
                      style={{ marginBottom: 0 }}
                      label="阈值条件"
                      required
                    >
                      <a-space align="start">
                        <a-select
                          style={{ minWidth: "6em" }}
                          v-model={[item.operator, "value"]}
                        >
                          {judgeSymbolList.value.map((val) => (
                            <a-select-option value={val.code}>
                              {val.name}
                            </a-select-option>
                          ))}
                        </a-select>
                        <a-form-item
                          // style={{ marginBotton: 0 }}
                          name={
                            ["alarmConditionList", index, "opValue"] as any[]
                          }
                          rules={{ required: true, message: "请输入阈值" }}
                        >
                          <a-input v-model={[item.opValue, "value"]}></a-input>
                        </a-form-item>
                      </a-space>
                    </a-form-item>
                  </a-col>
                  <a-col span={10}>
                    <a-form-item
                      label="报警等级"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <a-select
                          v-model={[item.alarmLevel, "value"]}
                          style={
                            ruleForm.value.alarmConditionList.length > 1
                              ? { width: "90%", marginRight: "10px" }
                              : ""
                          }
                        >
                          {_props.enumObj?.AlarmLevelEnum.map((val) => (
                            <a-select-option value={val.code}>
                              {val.name}
                            </a-select-option>
                          ))}
                        </a-select>
                      </div>
                    </a-form-item>
                  </a-col>
                  <a-col span={4}>
                    <a-space style={{ marginTop: "8px" }}>
                      {/* 减号 */}
                      {ruleForm.value.alarmConditionList.length > 1 &&
                        isThread.value && (
                          <MinusCircleFilled
                            style={{ color: "#4b7ff7", fontSize: "24px" }}
                            onClick={() => {
                              ruleForm.value.alarmConditionList.splice(
                                index,
                                1
                              );
                            }}
                          />
                        )}
                      {/* 加号 在最后一个上面 */}
                      {isThread.value &&
                        index ===
                          ruleForm.value.alarmConditionList.length - 1 && (
                          <PlusCircleFilled
                            style={{ color: "#4b7ff7", fontSize: "24px" }}
                            onClick={() => {
                              if (
                                ruleForm.value.alarmConditionList.length < 3
                              ) {
                                ruleForm.value.alarmConditionList.push({
                                  alarmLevel: 4, // 报警级别
                                  opValue: undefined, // 报警值
                                  operator: judgeSymbolList.value[0].code, // 操作符
                                });
                              } else {
                                message.error("最多添加三条");
                              }
                            }}
                          />
                        )}
                    </a-space>
                  </a-col>
                </>
              ))}
              {isThread.value && (
                <a-col span={24}>
                  <a-form-item label="规则间关系" labelCol={{ span: 2.5 }}>
                    <a-radio-group
                      v-model={[ruleForm.value.conditionRelation, "value"]}
                    >
                      <a-radio value="OR">满足任意规则执行</a-radio>
                      <a-radio value="AND">满足全部规则执行</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              )}
              <a-col span={12}>
                <a-form-item label="触发时间">
                  <a-radio-group
                    v-model={[ruleForm.value.triggerType, "value"]}
                  >
                    {_props.enumObj?.AlarmTriggerTypeEnum.map((item) => (
                      <a-radio
                        value={item.code}
                        style={{ display: "block", marginBottom: "10px" }}
                      >
                        {item.name}
                        {item.code === "IMMEDIATELY" ? (
                          ""
                        ) : (
                          <a-input-number
                            step={1}
                            precision={0}
                            min={0}
                            style={{ width: "100px", marginLeft: "10px" }}
                            disabled={
                              ruleForm.value.triggerType === "IMMEDIATELY" ||
                              ruleForm.value.triggerType !== item.code
                            }
                            v-model={[ruleForm.value.triggerTime, "value"]}
                            formatter={(value) => `${value}s`}
                            parser={(value: string) => value.replace("s", "")}
                          />
                        )}
                      </a-radio>
                    ))}
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

export default RuleForm;
