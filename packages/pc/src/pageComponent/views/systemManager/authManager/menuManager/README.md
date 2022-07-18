# 菜单管理

## 组件名称[**inl-menu-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-menu-manager></inl-menu-manager>;
    );
  },
});
```

## 参数

| 参数名称     | 类型   | 默认值    | 作用                                                     |
| ------------ | ------ | --------- | -------------------------------------------------------- |
| url          | 见下方 | {}        | 网络请求路径                                             |
| prefix       | string | /api/     | 网络请求前缀                                             |
| serverName   | string | common/v1 | 服务端名称                                               |
| dividerGap   | number | 24        | 树结构和表格中间分割线的上下 margin(传入正数 渲染为负数) |
| dividerColor | color  | \#EFF2F6  | 分割线的颜色                                             |

### url

```typescript
export interface IUrlObj {
  // 树结构数据
  tree: string;
  // 添加菜单
  add: string;
  // 更新菜单
  update: string;
  // 删除菜单
  delete: string;
  // 排序菜单
  sort: string;
  // 上传菜单JSON
  upload: string;
}
```
