# 部门管理

## 组件名称[**inl-dep-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-dep-manager></inl-dep-manager>;
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
  // 部门树结构列表
  tree: string;
  // 部门详情
  detail: string;
  // 新增部门
  add: string;
  // 更新部门
  update: string;
  // 删除部门
  delete: string;
  // 部门排序
  sort: string;
  // 部门下的员工下拉列表
  empSelect: string;

  // 人员列表
  empList: string;
  // 人员详情
  empDetail: string;
  // 新增人员
  addEmp: string;
  // 编辑人员
  updateEmp: string;
  // 删除人员
  deleteEmp: string;
  // 岗位下拉列表
  postSelect: string;
}
```
