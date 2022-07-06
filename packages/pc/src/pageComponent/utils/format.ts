/**
 * 秒 -> 分
 * @param s 秒
 */
export function secordToMinute(s: number | null) {
  if (s === null || s === undefined) return null;
  return {
    minute: Math.floor(s / 60),
    second: s % 60,
  };
}

/**
 * 转换部门、人员 树结构
 * @param treeData 源数据
 */
export function fomatDepTree(treeData: any) {
  treeData.subList = treeData.departmentList;
  const res = [treeData];

  function formatSubList(list: any[]) {
    list.forEach((dep: any) => {
      dep.id = `dep${dep.id}`;
      dep.isDep = true;
      dep.subList = dep.subList ?? [];
      if (dep.subList.length) {
        formatSubList(dep.subList);
      }
      if (dep.employeeSummaryList) {
        dep.subList.push(
          ...dep.employeeSummaryList.map((emp: any) => {
            emp.id = emp.employeeId;
            emp.name = emp.employeeName;

            return emp;
          })
        );
      }
    });
  }

  formatSubList(res);

  return res;
}
/**
 * 转换部门、人员 树结构
 * @param treeData 源数据
 */
export function fomatDepPeopleTree(res: any) {
  function formatSubList(list: any[]) {
    return list.map((item) => ({
      value: `dep${item.id}`,
      label: item.name,
      children:
        item.subList.length > 0
          ? formatSubList(item.subList)
          : formatemployeeSummaryList(item.userSummaryList),
    }));
  }
  function formatemployeeSummaryList(list: any[]) {
    return list.map((item) => ({
      value: item.userId,
      label: item.userName,
    }));
  }
  return formatSubList(res);
}
export default {};
