# 布局组件 - 内容区域

>根据路由query中的menuCode获取到对应的组件进行展示，内部管理页签功能，可以缓存打开的页签。

## 组件名称 [inl-layout-content]

### 示例

```jsx
const allRoutes = [{code: '1010', component: MenuManager}];
const userNavList = [];
<inl-layout-content
  allRoutes={allRoutes}
  userMenuTree={userNavList.value}
></inl-layout-content>
```

### 属性说明

| 属性名称     | 类型   | 默认值 | 说明                     |
| ------------ | ------ | ------ | ------------------------ |
| allRoutes    | 见下方 | []     | 所有的组件列表(一维数组) |
| userMenuTree | --     | []     | 服务器返回的用户菜单列表 |

### 类型说明

```typescript
// allRoutes
interface route {
	code: string;
	component: Component // import('vue')
}
```

