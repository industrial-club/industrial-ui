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
 * 获取propValue对应菜单的最顶层菜单
 * @param propName 菜单的属性名
 * @param propValue 需要查找的属性值
 * @param menuTree 菜单树结构
 */
export function getActiveNavByProp(
  propName: string,
  propValue: string,
  menuTree: any[]
) {
  function isChildpropValue(menu: any): boolean {
    let flag = false;

    if (menu[propName] === propValue) {
      flag = true;
    }
    if (Array.isArray(menu.subList)) {
      for (const item of menu.subList) {
        if (isChildpropValue(item)) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  const res = menuTree.find((nav: any) => {
    return isChildpropValue(nav);
  });
  return res;
}

/**
 * 根据菜单code返回对应的菜单
 * @param code 菜单编码
 * @param menuTree 菜单树结构
 */
export function getMenuByCode(code: string, menuTree: any[]) {
  for (const menu of menuTree) {
    if (menu.code === code) {
      return menu;
    } else {
      const res = getMenuByCode(code, menu.subList);
      if (res) {
        return res;
      }
    }
  }
}

/**
 * 获取对应菜单的父级菜单
 * @param code 菜单编码
 * @param menuTree 菜单树结构
 */
export function getParentMenuByCode(code: string, menuTree: any[]) {
  for (const menu of menuTree) {
    if (menu.code === code) {
      return menu;
    } else {
      const res = getParentMenuByCode(code, menu.subList);
      if (res) {
        return menu;
      }
    }
  }
}

export default "";
