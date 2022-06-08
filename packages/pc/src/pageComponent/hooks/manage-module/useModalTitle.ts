/*
 * @Abstract: 系统管理模块 - 根据模式 返回对话框的标题
 * @Author: wang liang
 * @Date: 2022-04-01 18:15:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 17:42:45
 */

import { computed } from 'vue';

/**
 * 根据模式返回对话框标题
 * @param mode 模式
 * @param moduleName 模块名称
 */
export default function useModalTitle(
  mode: 'view' | 'add' | 'edit',
  moduleName: string,
) {
  const modalTitle = computed(() => {
    if (mode === 'add') {
      return `新增${moduleName}`;
    }
    if (mode === 'edit') {
      return `修改${moduleName}`;
    }
    return `查看${moduleName}`;
  });

  return modalTitle;
}
