import { computed } from "vue";

export default function useVModel<
  P extends Record<string, any>,
  K extends keyof P,
  Name extends string
>(props: P, key: K, emit: (name: Name, ...args: any[]) => void) {
  return computed<P[K]>({
    get() {
      return props[key!];
    },
    set(value) {
      const keyName = `update:${String(key)}` as Name;
      emit(keyName, value);
    },
  });
}
