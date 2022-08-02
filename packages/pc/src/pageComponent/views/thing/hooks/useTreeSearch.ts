import { reactive, ref, watch } from 'vue';
import type { TreeProps } from 'ant-design-vue';

const useTreeSearch = (fieldNameObj = {}) => {
  const tree = reactive<{ data: any[] }>({
    data: [],
  });
  const searchValue = ref<string>('');
  const expandedKeys = ref<(string | number)[]>([]);
  const autoExpandParent = ref<boolean>(true);
  const selectedKeyArr = ref<string[] | number[]>([]);
  const defaultFieldNames = {
    title: 'title',
    children: 'children',
  };
  const fieldNames: TreeProps['fieldNames'] & {
    children: string;
    title: string;
  } = {
    ...defaultFieldNames,
    ...fieldNameObj,
  };
  const generateKey = (_preKey: string, list: any[]) => {
    list.forEach((item, index) => {
      item.key = `${_preKey}-${index}`;
      if (item[fieldNames.children]?.length > 0) {
        generateKey(`${item.key}`, item[fieldNames.children]);
      }
    });
    return list;
  };
  const dataList: TreeProps['treeData'] = [];
  const generateList = (data: TreeProps['treeData']) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, name: node[fieldNames.title] });
      if (node[fieldNames.children]) {
        generateList(node[fieldNames.children]);
      }
    }
  };

  const getParentKey = (
    key: string | number,
    treeData: TreeProps['treeData'],
  ): string | number | undefined => {
    let parentKey;

    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node[fieldNames.children]) {
        if (node[fieldNames.children].some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node[fieldNames.children])) {
          parentKey = getParentKey(key, node[fieldNames.children]);
        }
      }
    }
    return parentKey;
  };

  const searchFn = (value: string) => {
    const expanded = dataList
      .map((item: TreeProps['treeData'][number]) => {
        if (item.name && item.name.indexOf(value) > -1) {
          return getParentKey(item.key, tree.data);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded;
    searchValue.value = value;
    autoExpandParent.value = true;
  };
  watch(searchValue, (value) => {
    searchFn(value);
  });
  return {
    tree,
    searchValue,
    expandedKeys,
    autoExpandParent,
    selectedKeyArr,
    fieldNames,
    generateKey,
    generateList,
    getParentKey,
    dataList,
    searchFn,
  };
};
export default useTreeSearch;
