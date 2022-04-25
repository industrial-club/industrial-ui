/*
 * @Abstract: base64
 * @Author: wang liang
 * @Date: 2022-04-19 13:14:09
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-19 13:17:00
 */

/**
 * base64加密字符串
 * @param str 要加密的字符串
 * @returns 加密后的字符串
 */
export function encodeStr(str: string) {
  return window.btoa(str);
}

/**
 * 解密base64
 * @param str 要解密的字符串
 * @returns 解密后的字符串
 */
export function decodeStr(str: string) {
  return window.atob(str);
}

export default '';
