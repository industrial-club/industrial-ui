/*
 * @Abstract: 系统管理 - 对话框控制
 * @Author: wang liang
 * @Date: 2022-04-01 19:26:44
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-01 19:36:20
 */

import { Ref, ref } from 'vue';

/**
 * 控制新增、编辑等对话框的显示
 */
export default function useModalVisibleControl() {
  const isDialogVisible = ref(false);

  const tableRow = ref({});

  const handleOpenDialog = (record?: any) => {
    isDialogVisible.value = true;
    if (record) {
      tableRow.value = record;
    }
  };

  return [isDialogVisible, handleOpenDialog, tableRow] as [
    Ref<boolean>,
    (record?: any) => void,
    Ref<any>,
  ];
}
