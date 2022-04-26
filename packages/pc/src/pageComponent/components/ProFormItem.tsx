/*
 * @Abstract: 动态表单项 根据api返回的描述 渲染不同的表单元素
 * @Author: wang liang
 * @Date: 2022-03-29 15:56:57
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-22 16:59:34
 */

import {
  Ref,
  defineComponent,
  inject,
  computed,
  ref,
  watch,
  PropType,
} from "vue";
import { isObject } from "lodash";

import {
  FormItem,
  Input,
  InputNumber,
  Switch,
  Select,
  SelectOption,
} from "ant-design-vue";

const ProFormItem = defineComponent({
  props: {
    description: {
      type: Object,
      required: true,
    },
    onChange: {
      type: Function as PropType<(name: string, value: any) => void>,
      required: true,
    },
  },
  setup(props) {
    // 参数描述
    const paramDefine = computed(() => props.description.paramDefine);
    // 参数值描述
    const paramDefineValue = computed(() => props.description.paramDefineValue);
    // 表单类型
    const type = computed(() => paramDefine.value.type);
    // 是否是开关表单
    const isSwitch = computed(() => type.value === "boolean");

    /* 是否修改状态 */
    const isEdit = inject<Ref<boolean>>("isEdit")!;

    /* ===== 输入框值 ===== */
    const inputValue = ref();
    watch(
      [() => props.description, isEdit],
      () => {
        // 传入的描述变化 / 切换为只读模式  =>  恢复输入框的值
        const value = props.description.paramDefineValue.value;
        // boolean类型 true/false是字符串 所以需要单独判断
        inputValue.value = isSwitch.value
          ? value === "false"
            ? false
            : true
          : value;
      },
      { deep: true, immediate: true }
    );
    // 输入框变化回调
    const handleValueChange = (e: any) => {
      if (isObject(e)) {
        inputValue.value = (e as any).target.value;
      } else {
        inputValue.value = e;
      }
      // 通知父组件 值变化 父组件绑定到Form组件上(表单验证)
      props.onChange(props.description.paramDefine.code, inputValue.value);
    };

    /* ==== 根据类型 返回不同的表单项 ===== */
    let Filed: any = null;
    switch (type.value) {
      case "float":
      case "int":
        Filed = InputNumber;
        break;
      case "boolean":
        Filed = Switch;
        break;
      case "select":
        Filed = Select;
        break;

      default:
        Filed = Input;
        break;
    }

    // 动态表单规则
    const rules = computed(() => {
      const res: any[] = [];
      // 最大值
      if (paramDefine.value.maxValue !== null) {
        res.push({
          type: "number",
          max: paramDefine.value.maxValue,
          message: `最大值为${paramDefine.value.maxValue}`,
        });
      }
      // 最小值
      if (paramDefine.value.minValue !== null) {
        res.push({
          type: "number",
          min: paramDefine.value.minValue,
          message: `最小值为${paramDefine.value.minValue}`,
        });
      }
      // 最大长度
      if (paramDefine.value.limitLength !== null) {
        res.push({ max: paramDefine.value.limitLength });
      }
      // 正则
      if (paramDefine.value.regularExpression) {
        res.push({ pattern: new RegExp(paramDefine.value.regularExpression) });
      }
      // 是否必须
      if (paramDefine.value.required) {
        res.push({
          required: true,
          message: `${paramDefine.value.name}是必填项`,
        });
      }
      return res;
    });

    // 动态输入框prop
    const inputProps = computed(() => {
      const res: any = {};

      // 单位
      if (paramDefine.value.unit) {
        res["addon-after"] = paramDefine.value.unit;
      }
      // 是否可修改
      if (!paramDefine.value.writeable || !isEdit.value) {
        res.disabled = true;
      }

      /* 值绑定 开关需要绑定checked属性 */
      if (isSwitch.value) {
        res.checked = inputValue.value;
      } else {
        res.value = inputValue.value;
      }

      return res;
    });

    return () => {
      // console.log(isSwitch.value);

      const vModel = isSwitch.value
        ? [inputValue.value, "checked"]
        : [inputValue.value, "value"];
      return (
        <FormItem
          name={paramDefine.value.code}
          key={paramDefine.value.id}
          label={paramDefine.value.name}
          rules={rules.value}
        >
          <Filed
            style={{ width: isSwitch.value ? "" : "100%" }}
            {...inputProps.value}
            onChange={handleValueChange}
          >
            <SelectOption key="你好">你好</SelectOption>
          </Filed>
        </FormItem>
      );
    };
  },
});

export default ProFormItem;
