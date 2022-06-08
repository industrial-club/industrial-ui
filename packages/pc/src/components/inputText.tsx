/**
 * 默认显示文字 双击展示输入框
 */

import { defineComponent, ref } from 'vue';
import useVModel from '@/hooks/userVModel';
import focusDirective from '@/directives/focus';

const InputText = defineComponent({
  directives: { focus: focusDirective },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const isInput = ref(false);

    const inputValue = useVModel(props, 'value', emit);

    return {
      isInput,
      inputValue,
    };
  },
  render() {
    return this.isInput ? (
      <a-input
        v-focus
        v-model={[this.inputValue, 'value']}
        onBlur={() => {
          this.isInput = false;
        }}
      />
    ) : (
      <span
        onDblclick={() => {
          this.isInput = true;
        }}
      >
        {this.inputValue}
      </span>
    );
  },
});

export default InputText;
