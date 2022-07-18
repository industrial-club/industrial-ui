import { watch, WatchOptions } from "vue";

export default function useWatchOnce(
  val: any,
  callback: (newVal?: any, oldVal?: any) => void,
  watchOptions?: WatchOptions
) {
  const cancle = watch(val, (newVal, odlVal) => {
    callback(newVal, odlVal);
    cancle();
  });
}
