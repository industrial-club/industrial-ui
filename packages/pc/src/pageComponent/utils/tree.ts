/*
 * @Abstract: 树结构工具
 * @Author: wang liang
 * @Date: 2022-04-18 09:12:12
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-25 10:23:49
 */

/**
 * 从树结构中筛选
 * @param treeData 树结构数据
 * @param id id
 * @param childProp 子列表属性名
 */
export function findById(treeData: any[], id: number, childProp = 'subList') {
  const find = (dataList: any[]) => {
    let node;
    dataList.some((item) => {
      let flag = false;
      if (item.id === id) {
        flag = true;
        node = item;
      } else {
        const res = find(item[childProp]);
        if (res) {
          flag = true;
          node = res;
        }
      }
      return flag;
    });
    return node;
  };

  return find(treeData);
}

/**
 * 递归去除树结构中的 createDt/updateDt
 */
export function removeDateProp(treeData: any[]) {
  treeData.forEach((item: any) => {
    for (const key in item) {
      if (Array.isArray(item[key])) {
        removeDateProp(item[key]);
      }
      if (key === 'updateDt' || key === 'createDt') {
        delete item[key];
      }
    }
  });
}

/**
 * 查询父节点数据
 */
// export function getParent(treeData: any[], id: number, childProp = 'subList') {}

export default '';
