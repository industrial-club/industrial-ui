# 用户管理

## 组件名称[**inl-user-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-user-manager></inl-user-manager>;
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
  // 列表查询
  list: string;
  // 用户详情
  detail: string;
  // 新增用户
  add: string;
  // 更新用户
  update: string;
  // 删除用户
  delete: string;
  // 角色列表（下拉框）
  roleList: string;
  // 员工列表(下拉框)
  employeeList: string;
  // 重置密码
  resetPass: string;
  // 员工详情
  employeeDetail: string;
}
```
