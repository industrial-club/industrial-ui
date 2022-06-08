/*
 * @Abstract: 全局自定义事件
 * @Author: wang liang
 * @Date: 2022-04-15 16:52:41
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-15 16:59:27
 */

import mitt, { Emitter } from 'mitt';

const emitterMap = new Map<string, Emitter<Record<string, unknown>>>();

/**
 * 自定义事件 （按模块区分）
 * @param module 模块名称 默认global
 */
export default function useBus(
  module = 'global',
): Emitter<Record<string, unknown>> {
  if (emitterMap.has(module)) {
    return emitterMap.get(module)!;
  }
  const emitter = mitt();
  emitterMap.set(module, emitter);
  return emitter;
}
