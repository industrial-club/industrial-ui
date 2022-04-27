/*
 * @Abstract: 系统管理 - 编辑对话框的表单
 * @Author: wang liang
 * @Date: 2022-04-01 18:56:13
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-02 09:53:00
 */

import { ref, watch, nextTick, Ref } from 'vue';
import { cloneDeep } from 'lodash';

export default function useModalForm(
  isVisible: Ref<boolean>,
  getRecord: () => any,
  mode: string,
  transformForm?: (r: any) => any,
) {
  const formRef = ref();
  const form = ref<any>({});
  watch(isVisible, async (val) => {
    // 等待record赋值 / 完全关闭
    await nextTick();
    // 打开对话框时复制表单 新建模式不用
    if (val) {
      if (mode === 'add') return;

      const cloneRecord = cloneDeep(getRecord());
      transformForm && transformForm(cloneRecord);
      form.value = cloneRecord;
    } else {
      // 清空表单
      formRef.value?.resetFields();
    }
  });

  return { formRef, form };
}
