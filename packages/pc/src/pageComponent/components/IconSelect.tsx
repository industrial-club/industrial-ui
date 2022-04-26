/*
 * @Abstract: icon 选择器
 * @Author: wang liang
 * @Date: 2022-04-06 16:06:46
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-06 16:12:58
 */

import { defineComponent } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";

import { Select, SelectOption } from "ant-design-vue";
import {
  CiOutlined,
  UpOutlined,
  ApiOutlined,
  EyeOutlined,
  KeyOutlined,
} from "@ant-design/icons-vue";

const iconsList = [
  { name: "CiOutlined", icon: CiOutlined },
  { name: "UpOutlined", icon: UpOutlined },
  { name: "ApiOutlined", icon: ApiOutlined },
  { name: "EyeOutlined", icon: EyeOutlined },
  { name: "KeyOutlined", icon: KeyOutlined },
];

const IconSelect = defineComponent({
  emits: ["update:value"],
  props: {
    value: {
      type: [String, Number],
    },
  },
  setup(props, { emit }) {
    const selectValue = useVModel(props, "value", emit);

    return () => (
      <Select v-model={[selectValue.value, "value"]}>
        {iconsList.map((item) => (
          <SelectOption key={item.name}>
            <item.icon />
          </SelectOption>
        ))}
      </Select>
    );
  },
});

export default IconSelect;
