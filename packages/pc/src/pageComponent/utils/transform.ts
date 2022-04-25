/*
 * @Abstract: 转换数据
 * @Author: wang liang
 * @Date: 2022-04-06 15:18:26
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-06 15:28:29
 */

/**
 * 转换菜单树结构数据
 * 第一层menuList 转换为 subList 和子列表key保持一致
 * softSysName 转换为 name
 * softSysId 转换为 sys${id} ※取数据时要去掉sys
 * @param treeData 树结构数据
 */
export function transformMenuTree(treeData: any[]) {
  return treeData.map((item) => {
    return {
      ...item,
      id: `sys${item.softSysId}`,
      name: item.softSysName,
      subList: item.menuList,
    };
  });
}

export default {};
