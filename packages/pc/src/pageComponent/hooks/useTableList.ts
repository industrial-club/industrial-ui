/*
 * @Abstract: 表格查询hook
 * @Author: wang liang
 * @Date: 2022-03-30 16:56:21
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 13:05:01
 */

import { ref, reactive } from "vue";
import { debounce } from "lodash";

/**
 * 通用表格查询hook
 * @param getData 获取数据的函数 返回Promise
 * @param listProp 数据列表在data中的属性 不传代表不分页
 */
export default function useTableList(
  getData: () => Promise<any>,
  listProp?: string,
  totalName = "totalCount"
) {
  const tableList = ref([]);
  const isLoading = ref(false);

  const total = ref(0);

  // 刷新数据函数 (节流)
  const refresh = debounce(async () => {
    isLoading.value = true;
    try {
      const { data } = await getData();
      if (listProp) {
        tableList.value = data[listProp];
        total.value = data[totalName];
      } else {
        tableList.value = data;
      }
    } finally {
      isLoading.value = false;
    }
  }, 200);

  const currPage = ref(1);
  const handlePageChange = (page: number) => {
    currPage.value = page;
    refresh();
  };

  const pageSize = ref(10);
  const hanldePageSizeChange = (size: number) => {
    currPage.value = 1;
    pageSize.value = size;
    refresh();
  };

  const pagination = reactive({
    current: currPage,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    "onUpdate:current": handlePageChange,
    "onUpdate:pageSize": hanldePageSizeChange,
  });

  return {
    isLoading,
    tableList,

    currPage,
    handlePageChange,

    pageSize,
    hanldePageSizeChange,

    total,
    refresh,

    pagination,
  };
}
