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
  let stock: string[] = [];
  let going = true;
  var warker = function (menuTree: any[], code: string) {
    menuTree.forEach((item) => {
      if (!going) return;
      stock.push(item.code);
      if (item.code == code) {
        going = false;
      } else if (item.subList) {
        warker(item.subList, code);
      } else {
        stock.pop();
      }
    });
    if (going) stock.pop();
  };
  warker(menuTree, code);
  return stock;
}

/**
 * 获取需要打开url的地址 (拼接http:// token userId)
 * @param url 路径
 */
export function getOpenUrl(url: string) {
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo")!);
  const theme = localStorage.getItem("theme") ?? "light";
  const isWithOrigin = url.startsWith("http");
  const fullUrl = isWithOrigin
    ? url
    : `${location.origin}${url.startsWith("/") ? "" : "/"}${url}`;

  const urlObj = new URL(fullUrl);
  if (urlObj.hash) {
    const converceUrl = new URL(urlObj.hash.replace("#", location.origin));
    converceUrl.searchParams.set("token", sessionStorage.getItem("token")!);
    converceUrl.searchParams.set("userId", userinfo.userId);
    converceUrl.searchParams.set("theme", theme);
    urlObj.hash = converceUrl.href.replace(location.origin, "#");
  } else {
    urlObj.searchParams.set("token", sessionStorage.getItem("token")!);
    urlObj.searchParams.set("userId", userinfo.userId);
    urlObj.searchParams.set("theme", theme);
  }
  return urlObj.href;
}

export default "";
