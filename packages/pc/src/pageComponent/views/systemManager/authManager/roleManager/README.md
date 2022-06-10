# 角色管理

## 组件名称[**inl-role-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-role-manager></inl-role-manager>;
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
  // 角色列表
  list: string;
  // 切换角色启用状态
  switchStatus: string;
  // 保存角色 新增/更新
  save: string;
  // 删除角色
  delete: string;
  // 获取角色权限树- 编辑角色
  editPermission: string;
  // 获取角色权限树- 新建角色
  addPermission: string;
}
```
