import { Directive } from 'vue';

/**
 * 输入框自动获取焦点
 */
const focusDirective: Directive = {
  mounted(el, { value }) {
    if (value !== false) {
      el.focus();
    }
  },
};

export default focusDirective;
