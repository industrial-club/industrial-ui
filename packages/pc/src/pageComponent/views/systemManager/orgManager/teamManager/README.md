# 班组管理

## 组件名称[**inl-team-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-team-manager></inl-team-manager>;
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
  // 班组列表
  list: string;
  // 新增班组
  add: string;
  // 更新班组
  update: string;
  // 删除班组
  delete: string;
  // 启用/禁用班组
  switchStatus: string;
  // 获取部门列表(添加、编辑 部门下拉框)
  depList: string;
  // 岗位下拉列表
  postList: string;
  // 获取人员列表 (下拉框)
  empList: string;
}
```
