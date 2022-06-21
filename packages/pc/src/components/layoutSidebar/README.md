# 布局组件 - 侧边导航菜单

> 渲染传入的 menu 树形列表

## 组件名称 [inl-layout-sidebar]

### 示例

```jsx
const activeNav = ref({});
const userNavList = ref([]);
<inl-layout-sidebar
  menu={currNav.value?.subList ?? []}
  userMenuTree={userNavList.value}
/>;
```

### 属性说明

| 属性名称     | 类型 | 默认值 | 说明                     |
| ------------ | ---- | ------ | ------------------------ |
| menu         | --   | []     | 需要渲染的菜单列表       |
| userMenuTree | --   | []     | 服务器返回的用户菜单列表 |
