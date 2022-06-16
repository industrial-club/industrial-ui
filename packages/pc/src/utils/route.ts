import { RouteRecordRaw } from "vue-router";

/**
 * 展平树结构 =》 数组
 * @param menuList 菜单树结构
 */
export function flatMenuList(menuList: any[]): any[] {
  const res: any[] = [];
  for (const menu of menuList) {
    res.push(menu);
    if (Array.isArray(menu.subList)) {
      res.push(...flatMenuList(menu.subList));
    }
  }
  return res;
}

/**
 * 获取code对应菜单的最顶层菜单
 * @param code 菜单编码
 * @param menuTree 菜单树结构
 */
export function getActiveNavByCode(code: string, menuTree: any[]) {
  function isChildCode(menu: any): boolean {
    let flag = false;

    if (menu.code === code) {
      flag = true;
    }
    if (Array.isArray(menu.subList)) {
      for (const item of menu.subList) {
        if (isChildCode(item)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  const res = menuTree.find((nav: any) => {
    return isChildCode(nav);
  });
  return res;
}

export default "";
