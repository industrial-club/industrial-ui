# 布局组件 - 上方导航栏中菜单

> 根据服务器返回的菜单树结构 渲染出第一层菜单

## 组件名称 [inl-layout-nav]

### 示例

```jsx
const activeNav = ref();
const userNavList = ref([]);

const onRouteChange = (route: any) => {
  activeNav.value = route;
};
<inl-layout-nav
  menu={userNavList.value}
  userMenuTree={userNavList.value}
  onRouteChange={onNavChange}
/>;
```

### 属性说明

| 属性名称     | 类型 | 默认值 | 说明                     |
| ------------ | ---- | ------ | ------------------------ |
| menu         | --   | []     | 服务器返回的用户菜单列表 |
| userMenuTree | --   | []     | 服务器返回的用户菜单列表 |

### 事件

| 事件名        | 参数  | 说明         |
| ------------- | ----- | ------------ |
| onRouteChange | route | 选择导航回调 |

