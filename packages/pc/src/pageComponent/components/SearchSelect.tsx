/*
 * @Abstract: 可以搜索的选择下拉框 对Select组件的二次封装
 * @Author: wang liang
 * @Date: 2022-04-19 16:46:58
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 13:58:53
 */

import { PropType, defineComponent, ref, watch, inject } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { getInstance } from "@/api/axios";
import { isNil, debounce, isEqual } from "lodash";
import { every } from "@/pageComponent/utils/is";
import faceName from "@/api/faceName";

const SearchSelect = defineComponent({
  emits: ["update:value"],
  props: {
    value: {
      type: [String, Array, Number],
    },
    // 获取列表的url
    getUrl: {
      type: String,
      required: true,
    },
    /* 额外的参数 必须有值才能搜索 */
    extParams: {
      type: Object,
    },
    valuePorp: {
      type: Object as PropType<{ key: string; label: string }>,
      default: () => ({}),
    },
    /* 需要排除的值  不展示在下拉列表中 也无法选中 */
    excludeValues: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit, attrs }) {
    const urlPrefix: any = inject("urlPrefix")!;
    const instance = getInstance({
      prefix: urlPrefix.prefix,
      serverName: urlPrefix.serverName ?? faceName.common,
    });
    const modelValue = useVModel(props, "value", emit);

    /* 列表 */
    const optionList = ref([]);
    const isFetching = ref(false);
    let lastFetchId = 0;
    const getOptionList = debounce(async (val: string) => {
      if (
        !props.extParams ||
        every(props.extParams, (key, value) => !isNil(value))
      ) {
        const fetchId = lastFetchId;
        // 获取下拉列表
        optionList.value = [];
        isFetching.value = true;
        try {
          // 调用api传入参数
          const { data } = await instance.get(props.getUrl, {
            params: { ...props.extParams, keyword: val },
          });
          if (lastFetchId !== fetchId) {
            // for fetch callback order
            return;
          }
          optionList.value = data;
        } finally {
          isFetching.value = false;
        }
      }
    }, 300);
    getOptionList("");

    watch(
      () => props.extParams,
      (curr, prev) => {
        if (!isEqual(curr, prev)) {
          getOptionList("");
        }
      }
    );

    watch(
      () => props.excludeValues,
      (curr, prev) => {
        if (isEqual(curr, prev)) return;
        if (Array.isArray(modelValue.value)) {
          modelValue.value = modelValue.value.filter(
            (item) => !props.excludeValues.includes(item)
          );
        } else {
          if (props.excludeValues.includes(modelValue.value)) {
            modelValue.value = undefined;
          }
        }
      }
    );

    return () => (
      <a-select
        {...attrs}
        notFoundContent={isFetching.value ? "加载中" : "暂无数据"}
        showSearch
        defaultActiveFirstOption={false}
        showArrow={true}
        filterOption={false}
        v-model={[modelValue.value, "value"]}
        onSearch={getOptionList}
      >
        {optionList.value.map(
          (item: any) =>
            !props.excludeValues.includes(
              item[props.valuePorp.key ?? "id"]
            ) && (
              <a-select-option key={item[props.valuePorp.key ?? "id"]}>
                {item[props.valuePorp.label ?? "name"]}
              </a-select-option>
            )
        )}
      </a-select>
    );
  },
});

export default SearchSelect;
