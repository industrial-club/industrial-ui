# 岗位管理

## 组件名称[**inl-post-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-post-manager></inl-post-manager>;
    );
  },
});
```

## 参数

| 参数名称   | 类型   | 默认值    | 作用         |
| ---------- | ------ | --------- | ------------ |
| url        | 见下方 | {}        | 网络请求路径 |
| prefix     | string | /api/     | 网络请求前缀 |
| serverName | string | common/v1 | 服务端名称   |

### url

```typescript
export interface IUrlObj {
  // 岗位列表
  list: string;
  // 新增岗位
  add: string;
  // 更新岗位
  update: string;
  // 删除岗位
  delete: string;
  // 部门列表 (添加、编辑 部门下拉框)
  depList: string;
  // 切换岗位启用状态
  switchStatus: string;
}
```
