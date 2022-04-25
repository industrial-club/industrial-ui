/*
 * @Abstract: 判断
 * @Author: wang liang
 * @Date: 2022-04-19 17:06:25
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 13:36:00
 */
type ValidateFn = (key: string, value: unknown) => boolean;

/**
 * 判断一个对象的所有属性是否都符合条件
 * @param obj 源对象
 * @param _func 判断函数
 * @returns 是否符合条件
 */
export function every(obj: Record<string, unknown>, _func: ValidateFn) {
  let flag = true;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const res = _func(key, obj[key]);
      if (!res) {
        flag = false;
        break;
      }
    }
  }
  return flag;
}

export default '';
