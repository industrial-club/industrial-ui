import { getCurrentInstance } from 'vue';

/**
 * 获取当实例的proxy
 */
export default function useProxy() {
  return getCurrentInstance()!.proxy as any;
}
