import { computed } from 'vue';

export default function useVModel<
  P extends object,
  K extends keyof P,
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>(props: P, key: K, emit: (name: Name, ...args: any[]) => void) {
  return computed<P[K]>({
    get() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return props[key!];
    },
    set(value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emit(`update:${key}` as any, value);
    },
  });
}
