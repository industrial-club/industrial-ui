/*
 * @Abstract: 动态展示图表
 * @Author: wang liang
 * @Date: 2022-04-14 13:44:35
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 13:47:41
 */
import { defineComponent, createVNode } from 'vue';
import * as icons from '@ant-design/icons-vue';

const Dynamicicon = defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    return () => (
      <span class='DynamicIcon'>
        {props.icon ? createVNode((icons as any)[props.icon], attrs) : ''}
      </span>
    );
  },
});

export default Dynamicicon;
